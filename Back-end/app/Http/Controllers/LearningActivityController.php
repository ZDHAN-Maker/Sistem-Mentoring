<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLearningActivityRequest;
use App\Http\Requests\SyncExpertiseRequest;
use App\Models\LearningActivity;
use App\Models\User;
use App\Services\LearningActivityService;
use Exception;
use Illuminate\Http\Request;

class LearningActivityController extends Controller
{
    protected $activityService;

    public function __construct(LearningActivityService $activityService)
    {
        $this->activityService = $activityService;
    }

    /**
     * GET: Menampilkan semua daftar bidang keahlian
     */
    public function index()
    {
        $activities = LearningActivity::all();

        return response()->json([
            'status' => 'success',
            'data' => $activities
        ], 200);
    }

    /**
     * POST: Menambah bidang keahlian baru (Biasanya oleh Admin)
     */
    public function store(StoreLearningActivityRequest $request)
    {
        $activity = $this->activityService->createActivity($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Bidang keahlian berhasil ditambahkan.',
            'data' => $activity
        ], 201);
    }

    /**
     * PUT/PATCH: Mengubah detail bidang keahlian
     */
    public function update(StoreLearningActivityRequest $request, LearningActivity $learningActivity)
    {
        $updatedActivity = $this->activityService->updateActivity($learningActivity, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Bidang keahlian berhasil diperbarui.',
            'data' => $updatedActivity
        ], 200);
    }

    /**
     * DELETE: Menghapus bidang keahlian
     */
    public function destroy(LearningActivity $learningActivity)
    {
        $this->activityService->deleteActivity($learningActivity);

        return response()->json([
            'status' => 'success',
            'message' => 'Bidang keahlian berhasil dihapus.'
        ], 200); // Bisa juga menggunakan 204 No Content (tanpa body response)
    }

    /**
     * POST: Menetapkan keahlian ke Mentor tertentu
     */
    public function syncMentorActivities(SyncExpertiseRequest $request, User $mentor)
    {
        try {
            $changes = $this->activityService->syncMentorActivities($mentor, $request->learning_activity_ids);

            return response()->json([
                'status' => 'success',
                'message' => 'Bidang keahlian mentor berhasil diperbarui.',
                // Load relasi agar data ter-update langsung terlihat di response
                'data' => $mentor->load('learningActivities:id,title')
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui keahlian: ' . $e->getMessage()
            ], 400);
        }
    }
}
