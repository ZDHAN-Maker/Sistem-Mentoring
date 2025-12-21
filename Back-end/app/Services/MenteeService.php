<?php

namespace App\Services;

use App\Models\User;
use App\Models\ProgressReport;
use App\Models\Task;
use App\Models\Pairing;
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

    /**
     * Ambil semua report mentee
     * (tidak error jika kosong)
     */
    public function getMenteeReports($menteeId)
    {
        return ProgressReport::where('mentee_id', $menteeId)->get();
    }

    /**
     * Ambil semua task mentee
     */
    public function getMenteeTasks($menteeId)
    {
        return Task::where('mentee_id', $menteeId)->get();
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
         * Upload file
         */
        $filePath = $validated['file']->store('tasks', 'public');

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
}
