<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\Task;
use Illuminate\Http\Request;

class SubmissionService
{
    /**
     * Mentee mengirim submission untuk task.
     * - Validasi file atau jawaban harus ada salah satu
     * - File disimpan di storage/public/submissions
     */
    public function submitTask($menteeId, $taskId, Request $request)
    {
        // Pastikan task memang milik mentee tersebut
        $task = Task::where('id', $taskId)
            ->where('mentee_id', $menteeId)
            ->firstOrFail();

        // Validasi input
        $data = $request->validate([
            'file'   => 'nullable|file|max:10240', // 10MB
            'answer' => 'nullable|string'
        ]);

        // Minimal harus mengisi salah satu
        if (!$request->hasFile('file') && empty($data['answer'])) {
            throw new \Exception("File atau jawaban harus diisi.");
        }

        // Upload file jika ada
        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('submissions', 'public');
        }

        // Simpan submission
        return Submission::create([
            'task_id'   => $task->id,
            'mentee_id' => $menteeId,
            'file_path' => $filePath,
            'answer'    => $data['answer'] ?? null,
            'status'    => 'submitted',
        ]);
    }

    /**
     * Daftar semua submission untuk mentor.
     * - Bisa difilter berdasarkan pairing (opsional)
     * - Mengambil relasi task & mentee untuk kebutuhan UI
     */
    public function listSubmissionsForMentor($mentorId, $pairingId = null)
    {
        return Submission::whereHas('task', function ($q) use ($mentorId, $pairingId) {
            $q->where('mentor_id', $mentorId)
              ->when($pairingId, fn($qr) => $qr->where('pairing_id', $pairingId));
        })
        ->with(['task', 'mentee'])
        ->orderBy('created_at', 'desc')
        ->get();
    }

    /**
     * Mentor memberi nilai & status pada submission.
     * - Hanya mentor yang memiliki task tersebut yg dapat menilai
     */
    public function gradeSubmission($mentorId, $submissionId, array $data)
    {
        // Pastikan submission benar milik task mentor tersebut
        $submission = Submission::where('id', $submissionId)
            ->whereHas('task', fn($q) => $q->where('mentor_id', $mentorId))
            ->firstOrFail();

        // Update grade dan status
        $submission->update([
            'grade'  => $data['grade'],
            'status' => $data['status']
        ]);

        return $submission;
    }
}
