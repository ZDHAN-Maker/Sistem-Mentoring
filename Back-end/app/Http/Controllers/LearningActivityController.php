<?php

namespace App\Http\Controllers;

use App\Models\LearningActivity;
use App\Services\LearningActivityService;
use Illuminate\Http\Request;

class LearningActivityController extends Controller
{
    protected $learningActivityService;

    public function __construct(LearningActivityService $learningActivityService)
    {
        $this->learningActivityService = $learningActivityService;
    }

    public function index()
    {
        $learningActivities = LearningActivity::all();
        return response()->json(['success' => true, 'data' => $learningActivities]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $learningActivity = $this->learningActivityService->createLearningActivity($validated);

        return response()->json(['success' => true, 'data' => $learningActivity]);
    }

    public function getMaterials($learningActivityId)
    {
        $materials = $this->learningActivityService->getMaterialsByLearningActivity($learningActivityId);

        if ($materials === null) {
            return response()->json(['success' => false, 'message' => 'Learning Activity not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $materials]);
    }

    public function assignMentor(Request $request, $learningActivityId)
    {
        $validated = $request->validate([
            'mentor_id' => 'required|exists:users,id,role,mentor',
        ]);

        $result = $this->learningActivityService->assignMentorToActivity(
            $learningActivityId,
            $validated['mentor_id']
        );

        if ($result) {
            return response()->json(['success' => true, 'message' => 'Mentor assigned successfully']);
        }

        return response()->json(['success' => false, 'message' => 'Failed to assign mentor'], 400);
    }
}
