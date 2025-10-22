<?php

namespace App\Services;

use App\Models\User;
use App\Models\ProgressReport;
use App\Models\Task;
use Illuminate\Http\Request;

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
     * Ambil detail mentee tertentu
     */
    public function getMenteeById($id)
    {
        $mentee = User::where('role', 'mentee')->find($id);
        if (!$mentee) {
            throw new \Exception("Mentee not found");
        }
        return $mentee;
    }

    /**
     * Ambil semua report dari mentee
     */
    public function getMenteeReports($menteeId)
    {
        return ProgressReport::where('mentee_id', $menteeId)->get();
    }

    /**
     * Ambil semua tugas mentee
     */
    public function getMenteeTasks($menteeId)
    {
        return Task::where('mentee_id', $menteeId)->get();
    }

    /**
     * Mentee mengupload tugas baru
     */
    public function uploadTask(Request $request, $menteeId)
    {
        // Validasi request
        $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'judul'      => 'required|string',
            'deskripsi'  => 'nullable|string',
            'file_path'  => 'nullable|file|mimes:pdf,docx,jpg,png|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file_path') && $request->file('file_path')->isValid()) {
            $file = $request->file('file_path');
            $filePath = $file->store('tasks', 'public');
        }

        $task = Task::create([
            'mentee_id'  => $menteeId,
            'pairing_id' => $request->pairing_id,
            'judul'      => $request->judul,
            'deskripsi'  => $request->deskripsi,
            'file_path'  => $filePath,
        ]);

        return $task;
    }
}
