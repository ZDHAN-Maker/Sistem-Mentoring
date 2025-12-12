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

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'thumbnail' => 'nullable',
        ]);

        $path = $this->service->createPath($request->only([
            'title', 'description', 'thumbnail'
        ]));

        return response()->json([
            'message' => 'Learning Path created',
            'data' => $path
        ]);
    }

    public function update(Request $request, $id)
    {
        $path = LearningPath::findOrFail($id);

        $request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'thumbnail' => 'nullable',
            'is_published' => 'nullable|boolean',
        ]);

        $updated = $this->service->updatePath($path, $request->only([
            'title', 'description', 'thumbnail', 'is_published'
        ]));

        return response()->json([
            'message' => 'Learning Path updated',
            'data' => $updated
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
        $request->validate([
            'mentor_id' => 'required|exists:users,id'
        ]);

        $path = LearningPath::findOrFail($id);

        $this->service->assignMentor($path, $request->mentor_id);

        return response()->json(['message' => 'Mentor assigned']);
    }

    public function assignMentee($id, Request $request)
    {
        $request->validate([
            'mentee_id' => 'required|exists:users,id'
        ]);

        $path = LearningPath::findOrFail($id);

        $this->service->assignMentee($path, $request->mentee_id);

        return response()->json(['message' => 'Mentee assigned']);
    }
}
