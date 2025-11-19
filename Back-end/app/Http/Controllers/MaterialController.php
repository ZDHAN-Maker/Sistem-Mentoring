<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Services\MaterialService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class MaterialController extends Controller
{
    protected $materialService;

    public function __construct(MaterialService $materialService)
    {
        $this->materialService = $materialService;
    }

    public function index()
    {
        $materials = $this->materialService->getMaterialsByMentor(auth()->id());
        
        return response()->json([
            'success' => true,
            'data' => $materials
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video' => 'required|file|mimes:mp4,avi,mov,wmv|max:512000', // max 500MB
            'schedule_id' => 'nullable|exists:schedules,id',
            'status' => 'nullable|in:draft,published',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $material = $this->materialService->createMaterial(
                $request->all(),
                $request->file('video')
            );

            return response()->json([
                'success' => true,
                'message' => 'Material uploaded successfully',
                'data' => $material
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload material: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Material $material)
    {
        // Check authorization
        if ($material->mentor_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $material->load(['schedule', 'progress'])
        ]);
    }

    public function update(Request $request, Material $material)
    {
        // Check authorization
        if ($material->mentor_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'video' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:512000',
            'schedule_id' => 'nullable|exists:schedules,id',
            'status' => 'nullable|in:draft,published',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $material = $this->materialService->updateMaterial(
                $material,
                $request->all(),
                $request->file('video')
            );

            return response()->json([
                'success' => true,
                'message' => 'Material updated successfully',
                'data' => $material
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update material: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Material $material)
    {
        // Check authorization
        if ($material->mentor_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $this->materialService->deleteMaterial($material);

            return response()->json([
                'success' => true,
                'message' => 'Material deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete material: ' . $e->getMessage()
            ], 500);
        }
    }

    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'materials' => 'required|array',
            'materials.*.id' => 'required|exists:materials,id',
            'materials.*.order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->materialService->reorderMaterials($request->materials);

            return response()->json([
                'success' => true,
                'message' => 'Materials reordered successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder materials: ' . $e->getMessage()
            ], 500);
        }
    }
}
