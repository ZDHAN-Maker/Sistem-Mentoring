<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Submission;
use Illuminate\Support\Facades\Storage;

class TaskService
{
    /**
     * Mentor membuat task baru.
     * - Mendukung upload video (opsional)
     * - Data utama: title, description, deadline
     */
    public function createTask($mentorId, array $data)
    {
        $videoPath = null;

        // Upload video jika ada
        if (!empty($data['video_file'])) {
            $videoPath = $data['video_file']->store('tasks/videos', 'public');
        }

        return Task::create([
            'mentor_id'   => $mentorId,
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'video_path'  => $videoPath,
            'deadline'    => $data['deadline'] ?? null,
        ]);
    }

    /**
     * Ambil seluruh task (beserta mentor)
     */
    public function getAllTasks()
    {
        return Task::with('mentor')->orderBy('created_at', 'desc')->get();
    }

    /**
     * Ambil detail task
     * - Dengan data mentor
     * - Dengan daftar submission & mentee
     */
    public function getTaskById($id)
    {
        return Task::with(['mentor', 'submissions.mentee'])
            ->findOrFail($id);
    }

    /**
     * Update task oleh mentor.
     * - Mendukung update video (hapus lama → upload baru)
     */
    public function updateTask($id, array $data)
    {
        $task = Task::findOrFail($id);

        // Update field dasar
        $task->title       = $data['title']       ?? $task->title;
        $task->description = $data['description'] ?? $task->description;
        $task->deadline    = $data['deadline']    ?? $task->deadline;

        // Jika upload video baru
        if (!empty($data['video_file'])) {
            if ($task->video_path && Storage::disk('public')->exists($task->video_path)) {
                Storage::disk('public')->delete($task->video_path);
            }

            $task->video_path = $data['video_file']->store('tasks/videos', 'public');
        }

        $task->save();
        return $task;
    }

    /**
     * Hapus task
     * - Menghapus video jika ada
     */
    public function deleteTask($id)
    {
        $task = Task::findOrFail($id);

        // Hapus file video jika tersedia
        if ($task->video_path && Storage::disk('public')->exists($task->video_path)) {
            Storage::disk('public')->delete($task->video_path);
        }

        return $task->delete();
    }

    /**
     * Mentee submit task
     * - Upload file opsional
     * - Bisa kirim text answer
     */
    public function submitTask($taskId, $menteeId, array $data)
    {
        $filePath = null;

        if (!empty($data['file'])) {
            $filePath = $data['file']->store('submissions', 'public');
        }

        return Submission::create([
            'task_id'   => $taskId,
            'mentee_id' => $menteeId,
            'file_path' => $filePath,
            'answer'    => $data['answer'] ?? null,
            'status'    => 'submitted',
        ]);
    }

    /**
     * Mentor mereview submission.
     * - Bisa update status & grade
     */
    public function reviewSubmission($submissionId, array $data)
    {
        $submission = Submission::findOrFail($submissionId);

        $submission->status = $data['status'] ?? $submission->status;
        $submission->grade  = $data['grade']  ?? $submission->grade;

        $submission->save();
        return $submission;
    }
}
