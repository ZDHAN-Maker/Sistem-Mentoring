<?php

namespace App\Http\Controllers;

use App\Models\LearningPath;
use App\Services\LearningPathService;
use Illuminate\Http\Request;

class LearningPathController extends Controller
{
    protected $service;

    public function __construct(LearningPathService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json([
            'paths' => $this->service->getAllPaths()
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => $this->service->getPathDetail($id)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'thumbnail' => 'nullable',
        ]);

        return response()->json([
            'message' => 'Learning Path created',
            'data' => $this->service->createPath($validated)
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'thumbnail' => 'nullable',
            'is_published' => 'nullable|boolean',
        ]);

        $path = LearningPath::findOrFail($id);

        return response()->json([
            'message' => 'Learning Path updated',
            'data' => $this->service->updatePath($path, $validated)
        ]);
    }

    public function destroy($id)
    {
        $path = LearningPath::findOrFail($id);

        $this->service->deletePath($path);

        return response()->json(['message' => 'Path deleted']);
    }

    public function assignMentor($id, Request $request)
    {
        $validated = $request->validate([
            'mentor_id' => 'required|exists:users,id'
        ]);

        $path = LearningPath::findOrFail($id);

        return response()->json([
            'message' => 'Mentor assigned',
            'data' => $this->service->assignMentor($path, $validated['mentor_id'])
        ]);
    }

    public function removeMentor($id, $mentorId)
    {
        $path = LearningPath::findOrFail($id);

        return response()->json([
            'message' => 'Mentor removed',
            'data' => $this->service->removeMentor($path, $mentorId)
        ]);
    }

    public function replaceMentor($id, Request $request)
    {
        $validated = $request->validate([
            'old_mentor_id' => 'required|exists:users,id',
            'new_mentor_id' => 'required|exists:users,id',
        ]);

        $path = LearningPath::findOrFail($id);

        return response()->json([
            'message' => 'Mentor replaced',
            'data' => $this->service->replaceMentor(
                $path,
                $validated['old_mentor_id'],
                $validated['new_mentor_id']
            )
        ]);
    }

    public function assignMentee($id, Request $request)
    {
        $validated = $request->validate([
            'mentee_id' => 'required|exists:users,id'
        ]);

        $path = LearningPath::findOrFail($id);

        return response()->json([
            'message' => 'Mentee assigned',
            'data' => $this->service->assignMentee($path, $validated['mentee_id'])
        ]);
    }

    // Mentee

    public function myLearningPaths()
    {
        return response()->json([
            'data' => $this->service->getMyLearningPaths()
        ]);
    }
}
