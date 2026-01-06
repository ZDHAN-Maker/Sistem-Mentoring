<?php

namespace App\Http\Controllers;

use App\Models\LearningActivity;
use App\Services\LearningActivityService;
use Illuminate\Http\Request;

class LearningActivityController extends Controller
{
    protected LearningActivityService $learningActivityService;

    public function __construct(LearningActivityService $learningActivityService)
    {
        $this->learningActivityService = $learningActivityService;
    }

    public function index()
    {
        // ADMIN / MENTOR
        return response()->json([
            'data' => LearningActivity::ordered()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        return response()->json([
            'data' => LearningActivity::create($validated)
        ], 201);
    }

    public function assignMentor(Request $request, $id)
    {
        $validated = $request->validate([
            'mentor_id' => 'required|exists:users,id',
        ]);

        $activity = LearningActivity::findOrFail($id);

        $activity->mentors()->syncWithoutDetaching([$validated['mentor_id']]);

        return response()->json(['message' => 'Mentor assigned']);
    }

    public function indexForMentee()
    {
        $menteeId = auth()->id();

        $activities = LearningActivity::whereHas('materials', function ($q) use ($menteeId) {
            $q->where('status', 'published')
                ->whereHas('mentor.mentorPairings', function ($p) use ($menteeId) {
                    $p->where('mentee_id', $menteeId)
                        ->where('status', 'active');
                });
        })
            ->with(['materials' => function ($q) use ($menteeId) {
                $q->where('status', 'published')
                    ->whereHas('mentor.mentorPairings', function ($p) use ($menteeId) {
                        $p->where('mentee_id', $menteeId)
                            ->where('status', 'active');
                    });
            }])
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $activities
        ]);
    }
}
