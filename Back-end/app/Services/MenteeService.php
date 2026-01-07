<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Task;
use App\Models\Pairing;
use App\Models\Schedule;
use App\Models\Material;
use App\Models\ProgressReport;
use App\Models\MaterialProgress;
use App\Models\MenteeLearningActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class MenteeService
{
    /**
     * Ambil semua user dengan role mentee.
     */
    public function getAllMentees()
    {
        return User::where('role', 'mentee')->get();
    }

    /**
     * Ambil data mentee berdasarkan ID.
     */
    public function getMenteeById($id)
    {
        return User::where('role', 'mentee')
            ->where('id', $id)
            ->firstOrFail();
    }

    /**
     * Ambil mentor aktif dari mentee tertentu.
     */
    public function getMyMentor($menteeId)
    {
        return Pairing::with('mentor')
            ->where('mentee_id', $menteeId)
            ->where('status', 'active')
            ->first(); // mentee hanya punya 1 mentor aktif
    }

    /**
     * Ambil semua laporan progress milik mentee.
     */
    public function getMenteeReports($menteeId)
    {
        return ProgressReport::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })
            ->with('pairing.mentor')
            ->latest()
            ->get();
    }

    /**
     * Ambil semua task milik mentee.
     */
    public function getMenteeTasks($menteeId)
    {
        return Task::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })->get();
    }

    /**
     * Upload task oleh mentee.
     */
    public function uploadTask(Request $request, $menteeId)
    {
        $validated = $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'judul'      => 'required|string|max:255',
            'deskripsi'  => 'nullable|string',
            'file'       => 'required|file|mimes:pdf,docx,jpg,png|max:10240',
        ]);

        // Validasi pairing benar-benar milik mentee
        $pairing = Pairing::where('id', $validated['pairing_id'])
            ->where('mentee_id', $menteeId)
            ->first();

        if (!$pairing) {
            throw ValidationException::withMessages([
                'pairing_id' => 'Pairing tidak valid untuk mentee ini'
            ]);
        }

        // Upload file
        $filePath = $validated['file']->store('tasks', 'public');

        // Simpan task
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

    /**
     * Ambil jadwal milik mentee.
     */
    public function getMenteeSchedules($menteeId)
    {
        return Schedule::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })
            ->with('pairing.mentor')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Statistik dashboard mentee: tugas selesai, pending, submitted.
     */
    public function getDashboardStats($menteeId)
    {
        $tasks = Task::where('mentee_id', $menteeId)->get();

        $total = $tasks->count();
        $completed = $tasks->where('status', 'approved')->count();
        $submitted = $tasks->where('status', 'submitted')->count();
        $pending = $tasks->where('status', 'pending')->count();

        $progress = $total === 0 ? 0 : round(($completed / $total) * 100);

        return [
            'tasks' => [
                'total'      => $total,
                'completed'  => $completed,
                'submitted'  => $submitted,
                'pending'    => $pending,
                'progress_percentage' => $progress,
                'status'     => $progress === 100 ? 'Completed' :
                               ($progress === 0 ? 'Not Started' : 'On Going'),
            ],
        ];
    }

    /**
     * Pairing aktif dari mentee.
     */
    public function getMenteePairings($menteeId)
    {
        return Pairing::with(['mentor', 'tasks', 'progressReports', 'schedules'])
            ->where('mentee_id', $menteeId)
            ->where('status', 'active')
            ->latest()
            ->get();
    }

    /**
     * Ambil jadwal terdekat (upcoming schedules).
     */
    public function getUpcomingSchedules($menteeId)
    {
        return Schedule::whereHas('pairing', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId);
        })
            ->where('start_time', '>=', Carbon::now())
            ->with('pairing.mentor')
            ->orderBy('start_time', 'asc')
            ->limit(5)
            ->get();
    }

    /**
     * Ambil semua materi dari mentor yang sedang aktif membimbing mentee.
     */
    public function getMenteeMaterials($menteeId)
    {
        $mentorIds = Pairing::where('mentee_id', $menteeId)
            ->where('status', 'active')
            ->pluck('mentor_id');

        return Material::whereIn('mentor_id', $mentorIds)
            ->orderBy('id', 'desc')
            ->get();
    }

    /**
     * Record action belajar mentee (open, watch, complete).
     */
    public function recordActivity($menteeId, $materialId, $action)
    {
        return MenteeLearningActivity::create([
            'mentee_id'   => $menteeId,
            'material_id' => $materialId,
            'action'      => $action,
        ]);
    }

    /**
     * Ambil semua aktivitas belajar mentee.
     */
    public function getMenteeActivities($menteeId)
    {
        return MenteeLearningActivity::where('mentee_id', $menteeId)
            ->with(['material:id,title,learning_activity_id'])
            ->latest()
            ->get();
    }

    /**
     * Ambil aktivitas berdasarkan pairing.
     */
    public function getPairingActivities($pairingId)
    {
        $pairing = Pairing::findOrFail($pairingId);

        $materialIds = Material::where('mentor_id', $pairing->mentor_id)
            ->pluck('id');

        if ($materialIds->isEmpty()) {
            return collect([]);
        }

        return MenteeLearningActivity::whereIn('material_id', $materialIds)
            ->with(['mentee:id,name', 'material:id,title'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Update progress menonton materi oleh mentee.
     */
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

    /**
     * Ambil semua progress materi mentee.
     */
    public function getMenteeMaterialProgress($menteeId)
    {
        return MaterialProgress::where('mentee_id', $menteeId)
            ->with('material:id,title,duration')
            ->get();
    }

    /**
     * Ambil aktivitas belajar berdasarkan learning activity tertentu.
     */
    public function getActivitiesByLearningActivity($menteeId, $learningActivityId)
    {
        return MenteeLearningActivity::where('mentee_id', $menteeId)
            ->whereHas('material', function ($q) use ($learningActivityId) {
                $q->where('learning_activity_id', $learningActivityId);
            })
            ->with('material:id,title')
            ->latest()
            ->get();
    }

    /**
     * Statistik pembelajaran mentee (berapa materi selesai).
     */
    public function getMenteeLearningStats($menteeId)
    {
        $materials = Material::whereHas('mentor.mentorPairings', function ($q) use ($menteeId) {
            $q->where('mentee_id', $menteeId)->where('status', 'active');
        })
        ->where('status', 'published')
        ->get();

        $completed = MaterialProgress::where('mentee_id', $menteeId)
            ->where('is_completed', true)
            ->count();

        $total = $materials->count();

        return [
            'total_materials'       => $total,
            'completed'             => $completed,
            'progress_percentage'   => $total === 0 ? 0 : round(($completed / $total) * 100),
        ];
    }

    /**
     * Ambil semua task mentee.
     */
    public function getMyTasks($menteeId)
    {
        return Task::where('mentee_id', $menteeId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
