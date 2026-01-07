<?php

namespace App\Services;

use App\Models\User;
use App\Models\LearningPath;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LearningPathService
{
    /**
     * Mengambil semua Learning Path beserta jumlah mentor & mentee.
     */
    public function getAllPaths()
    {
        return LearningPath::with(['mentors', 'mentees'])
            ->withCount(['mentors', 'mentees'])
            ->get();
    }

    /**
     * Mengambil detail lengkap satu Learning Path berdasarkan ID.
     */
    public function getPathDetail($id)
    {
        return LearningPath::with(['mentors', 'mentees', 'activities'])
            ->withCount(['mentors', 'mentees'])
            ->findOrFail($id);
    }

    /**
     * Membuat Learning Path baru.
     */
    public function createPath(array $data)
    {
        return LearningPath::create($data);
    }

    /**
     * Mengupdate atribut Learning Path.
     */
    public function updatePath(LearningPath $path, array $data)
    {
        $path->update($data);
        return $path->refresh();
    }

    /**
     * Menghapus Learning Path.
     */
    public function deletePath(LearningPath $path)
    {
        return $path->delete();
    }

    /* ===================== MENTOR ===================== */

    /**
     * Menambahkan mentor ke Learning Path.
     */
    public function assignMentor(LearningPath $path, int $mentorId)
    {
        $mentor = User::where('id', $mentorId)
            ->where('role', 'mentor')
            ->first();

        if (!$mentor) {
            throw ValidationException::withMessages([
                'mentor_id' => 'User is not a mentor'
            ]);
        }

        if ($path->mentors()->whereKey($mentorId)->exists()) {
            return ['message' => 'Mentor already assigned'];
        }

        $path->mentors()->attach($mentorId);

        return $path->load('mentors')->mentors;
    }

    /**
     * Menghapus mentor dari Learning Path.
     */
    public function removeMentor(LearningPath $path, int $mentorId)
    {
        if (!$path->mentors()->whereKey($mentorId)->exists()) {
            return ['message' => 'Mentor not found in this path'];
        }

        $path->mentors()->detach($mentorId);

        return $path->load('mentors')->mentors;
    }

    /**
     * Mengganti mentor lama dengan yang baru.
     */
    public function replaceMentor(LearningPath $path, int $oldId, int $newId)
    {
        if (!$path->mentors()->whereKey($oldId)->exists()) {
            throw ValidationException::withMessages([
                'old_mentor_id' => 'Old mentor not found in this path'
            ]);
        }

        $newMentor = User::where('id', $newId)
            ->where('role', 'mentor')
            ->first();

        if (!$newMentor) {
            throw ValidationException::withMessages([
                'new_mentor_id' => 'User is not a mentor'
            ]);
        }

        // Tambah mentor baru tanpa menghapus mentor lain
        $path->mentors()->syncWithoutDetaching([$newId]);
        // Hapus mentor lama
        $path->mentors()->detach($oldId);

        return $path->load('mentors')->mentors;
    }

    /* ===================== MENTEE ===================== */

    /**
     * Menambahkan mentee ke Learning Path.
     */
    public function assignMentee(LearningPath $path, int $menteeId)
    {
        $mentee = User::where('id', $menteeId)
            ->where('role', 'mentee')
            ->first();

        if (!$mentee) {
            throw ValidationException::withMessages([
                'mentee_id' => 'User is not a mentee'
            ]);
        }

        if ($path->mentees()->whereKey($menteeId)->exists()) {
            return ['message' => 'Mentee already assigned'];
        }

        $path->mentees()->attach($menteeId);

        return $path->load('mentees')->mentees;
    }

    /**
     * Mengambil semua Learning Path yang dimiliki oleh mentee yang sedang login.
     */
    public function getMyLearningPaths()
    {
        $user = Auth::user();

        if ($user->role !== 'mentee') {
            abort(403, 'Unauthorized');
        }

        return $user->learningPaths()
            ->with(['mentors'])
            ->withCount(['mentors', 'mentees'])
            ->get();
    }
}
