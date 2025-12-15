<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    // Mentor boleh mengelola task HANYA jika task itu milik pairing yang ia bimbing
    public function update(User $user, Task $task): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role !== 'mentor') return false;

        return $task->pairing && $task->pairing->mentor_id === $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        return $this->update($user, $task);
    }

    public function view(User $user, Task $task): bool
    {
        if ($user->role === 'admin') return true;
        // Mentor pemilik pairing ATAU mentee pemilik pairing boleh melihat
        return $task->pairing && in_array($user->id, [
            $task->pairing->mentor_id,
            $task->pairing->mentee_id
        ], true);
    }

    public function create(User $user): bool
    {
        // Mentor boleh membuat task, validasi pairing dilakukan di service/controller (lihat bawah)
        return $user->role === 'mentor' || $user->role === 'admin';
    }
}
