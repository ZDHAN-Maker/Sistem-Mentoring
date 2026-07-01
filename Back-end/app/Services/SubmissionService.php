<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\Task;
use App\Models\User;
use App\Services\NotificationService;
use App\Events\SubmissionSubmitted;
use App\Events\SubmissionReviewed;
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
     * PROSES 1: Mentee mengumpulkan tugas (Submit)
     */
    public function createSubmission(array $data, $file, User $mentee): Submission
    {
        // Eager load relasi pairing untuk validasi keamanan dan pengiriman event
        $task = Task::with('pairing.mentor')->find($data['task_id']);

        if (!$task) {
            throw new NotFoundHttpException('Tugas tidak ditemukan.');
        }

        if ($task->pairing->mentee_id !== $mentee->id) {
            throw new AuthorizationException('Tugas ini tidak ditugaskan untuk Anda.');
        }

        if ($task->status === 'closed') {
            throw new Exception('Gagal mengumpulkan. Tugas ini sudah ditutup oleh mentor.');
        }

        $filePath = $file ? $file->store('submissions/files', 'public') : null;

        $submission = Submission::where('task_id', $task->id)
            ->where('mentee_id', $mentee->id)
            ->first();

        if ($submission) {
            if ($filePath && $submission->file_path) {
                Storage::disk('public')->delete($submission->file_path);
            }

            $submission->update([
                'file_path' => $filePath ?? $submission->file_path,
                'answer'    => $data['answer'] ?? $submission->answer,
                'status'    => 'submitted'
            ]);
        } {
            $submission = Submission::create([
                'task_id'   => $task->id,
                'mentee_id' => $mentee->id,
                'file_path' => $filePath,
                'answer'    => $data['answer'] ?? null,
                'status'    => 'submitted'
            ]);
        }

        // PICU EVENT: Beritahu mentor via background job antrean database/redis
        event(new SubmissionSubmitted($submission->load(['task.pairing.mentor', 'mentee'])));

        return $submission;
    }

    /**
     * PROSES 2: Mentor menilai tugas (Review)
     */
    public function reviewSubmission(int $id, array $data, User $mentor): Submission
    {
        $submission = Submission::with(['task.pairing', 'mentee'])->find($id);

        if (!$submission) {
            throw new NotFoundHttpException('Data submission tidak ditemukan.');
        }

        if ($submission->task->mentor_id !== $mentor->id) {
            throw new AuthorizationException('Anda tidak memiliki otoritas untuk menilai submission ini.');
        }

        $submission->update([
            'grade'       => $data['grade'],
            'feedback'    => $data['feedback'],
            'status'      => $data['status'], // 'reviewed' atau 'completed'
            'reviewed_by' => $mentor->id,
            'reviewed_at' => now()
        ]);

        // PICU EVENT: Beritahu mentee bahwa nilainya sudah keluar
        event(new SubmissionReviewed($submission));

        return $submission;
    }
}
