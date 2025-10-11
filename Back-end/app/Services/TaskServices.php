<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Submission;
use Illuminate\Support\Facades\Storage;

class TaskService
{
    /**
     * Create new task (mentor)
     */
    public function createTask($mentorId, array $data)
    {
        $videoPath = null;

        if (isset($data['video_file'])) {
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
     * Get all tasks
     */
    public function getAllTasks()
    {
        return Task::with('mentor')->get();
    }

    /**
     * Get task detail (with submissions)
     */
    public function getTaskById($id)
    {
        return Task::with(['mentor', 'submissions.mentee'])->findOrFail($id);
    }

    /**
     * Update task (mentor)
     */
    public function updateTask($id, array $data)
    {
        $task = Task::findOrFail($id);

        if (isset($data['title'])) {
            $task->title = $data['title'];
        }

        if (isset($data['description'])) {
            $task->description = $data['description'];
        }

        if (isset($data['deadline'])) {
            $task->deadline = $data['deadline'];
        }

        if (isset($data['video_file'])) {
            if ($task->video_path && Storage::disk('public')->exists($task->video_path)) {
                Storage::disk('public')->delete($task->video_path);
            }
            $task->video_path = $data['video_file']->store('tasks/videos', 'public');
        }

        $task->save();

        return $task;
    }

    /**
     * Delete task
     */
    public function deleteTask($id)
    {
        $task = Task::findOrFail($id);

        if ($task->video_path && Storage::disk('public')->exists($task->video_path)) {
            Storage::disk('public')->delete($task->video_path);
        }

        return $task->delete();
    }

    /**
     * Submit task (mentee)
     */
    public function submitTask($taskId, $menteeId, array $data)
    {
        $submissionFile = null;

        if (isset($data['file'])) {
            $submissionFile = $data['file']->store('submissions', 'public');
        }

        return Submission::create([
            'task_id'   => $taskId,
            'mentee_id' => $menteeId,
            'file_path' => $submissionFile,
            'answer'    => $data['answer'] ?? null,
            'status'    => 'submitted',
        ]);
    }

    /**
     * Review submission (mentor memberi nilai/feedback)
     */
    public function reviewSubmission($submissionId, array $data)
    {
        $submission = Submission::findOrFail($submissionId);

        if (isset($data['status'])) {
            $submission->status = $data['status'];
        }

        if (isset($data['grade'])) {
            $submission->grade = $data['grade'];
        }

        $submission->save();

        return $submission;
    }
}
