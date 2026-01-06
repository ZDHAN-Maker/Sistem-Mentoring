<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Models\ProgressReport;
use App\Models\Task;
use App\Models\Pairing;
use App\Models\MaterialProgress;
use App\models\Material;
use App\Models\MenteeLearningActivity;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class MenteeService
{
    /**
     * Ambil semua mentee
     */
    public function getAllMentees()
    {
        return User::where('role', 'mentee')->get();
    }

    /**
     * Ambil detail mentee
     */
    public function getMenteeById($id)
    {
        return User::where('role', 'mentee')
            ->where('id', $id)
            ->firstOrFail();
    }

    public function getMyMentor($menteeId)
    {
        return Pairing::with('mentor')
            ->where('mentee_id', $menteeId)
            ->where('status', 'active')
            ->first(); // satu mentor aktif
    }


    /**
     * Ambil semua report mentee
     * (tidak error jika kosong)
     */
    public function getMenteeReports($menteeId)
    {
        return ProgressReport::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })
            ->with(['pairing.mentor'])
            ->latest()
            ->get();
    }


    /**
     * Ambil semua task mentee
     */
    public function getMenteeTasks($menteeId)
    {
        return Task::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })->get();
    }

    /**
     * Upload task oleh mentee
     */
    public function uploadTask(Request $request, $menteeId)
    {
        $validated = $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'judul'      => 'required|string|max:255',
            'deskripsi'  => 'nullable|string',
            'file'       => 'required|file|mimes:pdf,docx,jpg,png|max:10240',
        ]);

        /**
         * 🔐 Validasi pairing milik mentee ini
         */
        $pairing = Pairing::where('id', $validated['pairing_id'])
            ->where('mentee_id', $menteeId)
            ->first();

        if (!$pairing) {
            throw ValidationException::withMessages([
                'pairing_id' => 'Pairing tidak valid untuk mentee ini'
            ]);
        }

        /**
         * Simpan task
         */
        return Task::create([
            'mentee_id'  => $menteeId,
            'mentor_id'  => $pairing->mentor_id,
            'pairing_id' => $pairing->id,
            'judul'      => $validated['judul'],
            'deskripsi'  => $validated['deskripsi'] ?? null,
            'file_path'  => $filePath,
            'status'     => 'submitted',
        ]);
    }

    public function getMenteeSchedules($menteeId)
    {
        return Schedule::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })
            ->with(['pairing.mentor'])
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    public function getDashboardStats($menteeId)
    {
        $tasks = Task::where('mentee_id', $menteeId)->get();

        $totalTasks = $tasks->count();
        $completedTasks = $tasks->where('status', 'approved')->count();
        $submittedTasks = $tasks->where('status', 'submitted')->count();
        $pendingTasks = $tasks->where('status', 'pending')->count();

        $progress = $totalTasks === 0
            ? 0
            : round(($completedTasks / $totalTasks) * 100);

        return [
            'tasks' => [
                'total' => $totalTasks,
                'completed' => $completedTasks,
                'submitted' => $submittedTasks,
                'pending' => $pendingTasks,
                'progress_percentage' => $progress,
                'status' => $progress === 100
                    ? 'Completed'
                    : ($progress === 0 ? 'Not Started' : 'On Going'),
            ],
        ];
    }

    /**
     * Ambil semua pairing mentee yang sedang aktif
     */
    public function getMenteePairings($menteeId)
    {
        return Pairing::with([
            'mentor',
            'tasks',
            'progressReports',
            'schedules'
        ])
            ->where('mentee_id', $menteeId)
            ->where('status', 'active')
            ->latest()
            ->get();
    }

    public function getUpcomingSchedules($menteeId)
    {
        return Schedule::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })
            ->where('start_time', '>=', Carbon::now())
            ->with(['pairing.mentor'])
            ->orderBy('start_time', 'asc')
            ->limit(5)
            ->get();
    }

    public function getMenteeMaterials($menteeId)
    {
        // Ambil semua mentor dari pairing aktif
        $mentorIds = Pairing::where('mentee_id', $menteeId)
            ->where('status', 'active')
            ->pluck('mentor_id');

        return Material::whereIn('mentor_id', $mentorIds)
            ->orderBy('id', 'desc')
            ->get();
    }


    public function recordActivity($menteeId, $materialId, $action)
    {
        return \App\Models\MenteeLearningActivity::create([
            'mentee_id'   => $menteeId,
            'material_id' => $materialId,
            'action'      => $action, // open | watch | complete
        ]);
    }

    public function getMenteeActivities($menteeId)
    {
        return \App\Models\MenteeLearningActivity::where('mentee_id', $menteeId)
            ->with(['material' => fn($q) => $q->select('id', 'title', 'learning_activity_id')])
            ->latest()
            ->get();
    }

    public function getPairingActivities($pairingId)
    {
        // Ambil data pairing
        $pairing = Pairing::findOrFail($pairingId);

        // Ambil semua ID materi milik mentor tersebut
        $materialIds = Material::where('mentor_id', $pairing->mentor_id)
            ->pluck('id');

        if ($materialIds->isEmpty()) {
            return collect([]); // Tidak ada materi
        }

        // Ambil aktivitas mentee berdasarkan materi-materi itu
        return MenteeLearningActivity::whereIn('material_id', $materialIds)
            ->with([
                'mentee:id,name',
                'material:id,title'
            ])
            ->orderBy('created_at', 'desc')
            ->get();
    }


    public function updateMaterialWatchProgress($menteeId, $materialId, $durationWatched)
    {
        $progress = MaterialProgress::firstOrCreate([
            'mentee_id'   => $menteeId,
            'material_id' => $materialId,
        ]);

        $progress->watch_duration = $durationWatched;

        if (
            $progress->material &&
            $progress->material->duration &&
            $durationWatched >= $progress->material->duration
        ) {
            $progress->markAsCompleted();
        } else {
            $progress->save();
        }

        if ($progress->is_completed) {
            MenteeLearningActivity::firstOrCreate([
                'mentee_id'   => $menteeId,
                'material_id' => $materialId,
                'action'      => 'complete'
            ]);
        }

        return $progress;
    }


    public function getMenteeMaterialProgress($menteeId)
    {
        return MaterialProgress::where('mentee_id', $menteeId)
            ->with(['material:id,title,duration'])
            ->get();
    }


    public function getActivitiesByLearningActivity($menteeId, $learningActivityId)
    {
        return \App\Models\MenteeLearningActivity::where('mentee_id', $menteeId)
            ->whereHas('material', function ($q) use ($learningActivityId) {
                $q->where('learning_activity_id', $learningActivityId);
            })
            ->with('material:id,title')
            ->latest()
            ->get();
    }

    public function getMenteeLearningStats($menteeId)
    {
        $materials = Material::whereHas('mentor.mentorPairings', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId)
                ->where('status', 'active');
        })
            ->where('status', 'published')
            ->get();

        $completed = MaterialProgress::where('mentee_id', $menteeId)
            ->where('is_completed', true)
            ->count();

        $total = $materials->count();

        return [
            'total_materials' => $total,
            'completed' => $completed,
            'progress_percentage' => $total === 0 ? 0 : round(($completed / $total) * 100),
        ];
    }

    public function getMyTasks($menteeId)
    {
        return Task::where('mentee_id', $menteeId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
