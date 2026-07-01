<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\Task;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\Storage;
use Exception;

class SubmissionService
{
    protected $notificationService;

    // Inject NotificationService
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Mengambil daftar submission berdasarkan peran user
     */
    public function getSubmissionsByUser(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Submission::with(['task', 'mentee', 'reviewer']);

        if ($user->hasRole('Mentor')) {
            // Mentor melihat submission dari tugas yang dia buat
            $query->whereHas('task', function ($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        } elseif ($user->hasRole('Mentee')) {
            // Mentee hanya melihat submission miliknya sendiri
            $query->where('mentee_id', $user->id);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['task_id'])) {
            $query->where('task_id', $filters['task_id']);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Mengambil detail satu data submission
     */
    public function getSubmissionById(int $id, User $user): Submission
    {
        $submission = Submission::with(['task', 'mentee', 'reviewer'])->find($id);

        if (!$submission) {
            throw new NotFoundHttpException('Data submission tidak ditemukan.');
        }

        // Validasi Hak Akses Baca
        if ($user->hasRole('Mentor') && $submission->task->mentor_id !== $user->id) {
            throw new AuthorizationException('Anda tidak memiliki akses ke submission ini.');
        }

        if ($user->hasRole('Mentee') && $submission->mentee_id !== $user->id) {
            throw new AuthorizationException('Anda tidak diizinkan melihat submission ini.');
        }

        return $submission;
    }

    /**
     * PROSES 1: Mentee mengumpulkan tugas
     */
    public function createSubmission(array $data, $file, User $mentee): Submission
    {
        $task = Task::with('pairing.mentor')->find($data['task_id']);

        if (!$task) {
            throw new NotFoundHttpException('Tugas tidak ditemukan.');
        }

        // Pastikan tugas ini ditujukan untuk hubungan pairing mentee ini
        if ($task->pairing->mentee_id !== $mentee->id) {
            throw new AuthorizationException('Tugas ini tidak ditugaskan untuk Anda.');
        }

        // Cek jika status tugas ditutup (Closed)
        if ($task->status === 'closed') {
            throw new Exception('Gagal mengumpulkan. Tugas ini sudah ditutup oleh mentor.');
        }

        // Handle Upload File jika ada
        $filePath = null;
        if ($file) {
            $filePath = $file->store('submissions/files', 'public');
        }

        // Cek jika sebelumnya mentee sudah pernah mengumpulkan (Re-upload/Update data)
        $submission = Submission::where('task_id', $task->id)
                                ->where('mentee_id', $mentee->id)
                                ->first();

        if ($submission) {
            // Hapus file lama jika mentee mengunggah file baru
            if ($filePath && $submission->file_path) {
                Storage::disk('public')->delete($submission->file_path);
            }

            $submission->update([
                'file_path' => $filePath ?? $submission->file_path,
                'answer'    => $data['answer'] ?? $submission->answer,
                'status'    => 'submitted' // reset status jika sebelumnya diperbaiki
            ]);
        } else {
            // Buat record baru
            $submission = Submission::create([
                'task_id'   => $task->id,
                'mentee_id' => $mentee->id,
                'file_path' => $filePath,
                'answer'    => $data['answer'] ?? null,
                'status'    => 'submitted'
            ]);
        }

        // TRIGGER NOTIFIKASI: Beritahu Mentor bahwa Mentee telah mengumpulkan tugas
        $mentor = $task->pairing->mentor;
        $this->notificationService->sendNotification(
            $mentor,
            "Submission Baru: {$mentee->name}",
            "{$mentee->name} telah mengumpulkan tugas '{$task->title}'. Silakan periksa.",
            'new_submission',
            $submission
        );

        return $submission;
    }

    /**
     * PROSES 2: Mentor Menilai & Memberi Feedback
     */
    public function reviewSubmission(int $id, array $data, User $mentor): Submission
    {
        $submission = Submission::with(['task', 'mentee'])->find($id);

        if (!$submission) {
            throw new NotFoundHttpException('Data submission tidak ditemukan.');
        }

        // Pastikan yang menilai adalah mentor pemilik tugas tersebut
        if ($submission->task->mentor_id !== $mentor->id) {
            throw new AuthorizationException('Anda tidak memiliki otoritas untuk menilai submission ini.');
        }

        // Update data penilaian
        $submission->update([
            'grade'       => $data['grade'],
            'feedback'    => $data['feedback'],
            'status'      => $data['status'], // 'reviewed' atau 'completed'
            'reviewed_by' => $mentor->id,
            'reviewed_at' => now()
        ]);

        // TRIGGER NOTIFIKASI: Beritahu Mentee bahwa tugasnya sudah dinilai
        $mentee = $submission->mentee;
        $this->notificationService->sendNotification(
            $mentee,
            "Tugas Anda Telah Dinilai",
            "Tugas '{$submission->task->title}' telah diperiksa oleh Mentor. Nilai Anda: {$data['grade']}.",
            'submission_reviewed',
            $submission
        );

        return $submission;
    }
}