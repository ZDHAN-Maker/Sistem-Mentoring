<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Pairing;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TaskService
{
    protected $notificationService;

    // Inject NotificationService untuk otomatisasi notifikasi
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Mengambil daftar tugas berdasarkan role
     */
    public function getTasksByUser(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Task::with(['pairing.mentee', 'pairing.mentor']);

        if ($user->hasRole('Mentor')) {
            $query->where('mentor_id', $user->id);
        } elseif ($user->hasRole('Mentee')) {
            // Mentee hanya bisa melihat task miliknya yang tidak berstatus draft
            $query->whereHas('pairing', function ($q) use ($user) {
                $q->where('mentee_id', $user->id);
            })->whereIn('status', ['published', 'closed']);
        }

        if (!empty($filters['pairing_id'])) {
            $query->where('pairing_id', $filters['pairing_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Mengambil detail tugas
     */
    public function getTaskById(int $id, User $user): Task
    {
        $task = Task::with(['pairing.mentee', 'pairing.mentor', 'submissions'])->find($id);

        if (!$task) {
            throw new NotFoundHttpException('Tugas tidak ditemukan.');
        }

        // Validasi akses Mentor
        if ($user->hasRole('Mentor') && $task->mentor_id !== $user->id) {
            throw new AuthorizationException('Anda tidak memiliki akses ke tugas ini.');
        }

        // Validasi akses Mentee
        if ($user->hasRole('Mentee')) {
            if ($task->pairing->mentee_id !== $user->id) {
                throw new AuthorizationException('Anda tidak diizinkan melihat tugas ini.');
            }
            if ($task->status === 'draft') {
                throw new AuthorizationException('Tugas ini belum diterbitkan oleh mentor.');
            }
        }

        return $task;
    }

    /**
     * Mentor membuat tugas (mendukung satu atau banyak mentee sekaligus)
     */
    public function createTasks(array $data, User $mentor): array
    {
        $pairingIds = [];
        if (!empty($data['pairing_ids']) && is_array($data['pairing_ids'])) {
            $pairingIds = array_values(array_filter($data['pairing_ids']));
        } elseif (!empty($data['pairing_id'])) {
            $pairingIds = [$data['pairing_id']];
        }

        if (empty($pairingIds)) {
            throw new AuthorizationException('Pilih minimal satu mentee bimbingan untuk ditugaskan.');
        }

        $validPairings = Pairing::whereIn('id', $pairingIds)
            ->where('mentor_id', $mentor->id)
            ->with('mentee')
            ->get();

        if ($validPairings->isEmpty()) {
            throw new AuthorizationException('Tidak ada sesi pairing mentee yang valid milik Anda.');
        }

        $createdTasks = [];
        foreach ($validPairings as $pairing) {
            $taskData = $data;
            unset($taskData['pairing_ids']);
            $taskData['pairing_id'] = $pairing->id;
            $taskData['mentor_id']  = $mentor->id;

            $task = Task::create($taskData);

            // Jika langsung dipublish, kirim notifikasi ke Mentee
            if ($task->status === 'published' && $pairing->mentee) {
                $this->notificationService->sendNotification(
                    $pairing->mentee,
                    "Tugas Baru: {$task->title}",
                    "Mentor Anda telah mengunggah tugas baru. Tenggat waktu: " . ($task->due_date ? $task->due_date->format('d M Y') : 'Tidak ada'),
                    'new_task',
                    $task
                );
            }

            $createdTasks[] = $task;
        }

        return $createdTasks;
    }

    /**
     * Mentor membuat tugas tunggal (backward compatible)
     */
    public function createTask(array $data, User $mentor): Task
    {
        $tasks = $this->createTasks($data, $mentor);
        return $tasks[0];
    }

    /**
     * Mentor mengubah tugas
     */
    public function updateTask(int $id, array $data, User $mentor): Task
    {
        $task = Task::with('pairing.mentee')->find($id);

        if (!$task) {
            throw new NotFoundHttpException('Tugas tidak ditemukan.');
        }

        if ($task->mentor_id !== $mentor->id) {
            throw new AuthorizationException('Anda tidak memiliki hak akses untuk mengubah tugas ini.');
        }

        $oldStatus = $task->status;
        $task->update($data);

        // Jika status berubah dari draft ke published, kirim notifikasi
        if ($oldStatus === 'draft' && $task->status === 'published') {
            $this->notificationService->sendNotification(
                $task->pairing->mentee,
                "Tugas Baru Diterbitkan: {$task->title}",
                "Mentor Anda telah menerbitkan tugas yang harus dikerjakan.",
                'new_task',
                $task
            );
        }

        return $task;
    }

    /**
     * Menghapus tugas
     */
    public function deleteTask(int $id, User $mentor): void
    {
        $task = Task::find($id);

        if (!$task) {
            throw new NotFoundHttpException('Tugas tidak ditemukan.');
        }

        if ($task->mentor_id !== $mentor->id) {
            throw new AuthorizationException('Anda tidak memiliki hak akses untuk menghapus tugas ini.');
        }

        // Hapus tugas (Submissions akan otomatis terhapus jika di migration pakai cascadeOnDelete)
        $task->delete();
    }
}