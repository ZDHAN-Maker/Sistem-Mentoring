<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index()
    {
        return response()->json($this->taskService->getAllTasks());
    }

    public function show($id)
    {
        return response()->json($this->taskService->getTaskById($id));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_file'  => 'nullable|file|mimes:mp4,mov,avi,wmv|max:51200',
            'deadline'    => 'nullable|date',
        ]);

        $mentorId = Auth::id();
        $task = $this->taskService->createTask($mentorId, $request->all());

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'video_file'  => 'nullable|file|mimes:mp4,mov,avi,wmv|max:51200',
            'deadline'    => 'nullable|date',
        ]);

        $task = $this->taskService->updateTask($id, $request->all());

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task
        ]);
    }

    public function destroy($id)
    {
        $this->taskService->deleteTask($id);

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function submit(Request $request, $taskId)
    {
        $request->validate([
            'answer' => 'nullable|string',
            'file'   => 'nullable|file|max:20480', // max 20MB
        ]);

        $menteeId = Auth::id();
        $submission = $this->taskService->submitTask($taskId, $menteeId, $request->all());

        return response()->json([
            'message' => 'Task submitted successfully',
            'submission' => $submission
        ]);
    }

    public function review(Request $request, $submissionId)
    {
        $request->validate([
            'status' => 'nullable|string',
            'grade'  => 'nullable|integer|min:0|max:100',
        ]);

        $submission = $this->taskService->reviewSubmission($submissionId, $request->all());

        return response()->json([
            'message' => 'Submission reviewed successfully',
            'submission' => $submission
        ]);
    }
}
