<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProgressRequest;
use App\Models\MaterialProgress;
use App\Models\Material;
use App\Services\MaterialProgressService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MaterialProgressController extends Controller
{
    protected $progressService;

    public function __construct(MaterialProgressService $progressService)
    {
        $this->progressService = $progressService;
    }

    /**
     * GET: Melihat laporan progress.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->hasRole('Mentee')) {
            // Mentee melihat seluruh progress belajarnya sendiri
            $progress = MaterialProgress::where('mentee_id', $user->id)
                ->with('material:id,title,type')
                ->latest('updated_at')
                ->get();
                
        } elseif ($user->hasRole('Mentor')) {
            // Mentor melihat progress dari materi-materi yang DIA buat
            $progress = MaterialProgress::whereHas('material', function ($query) use ($user) {
                    $query->where('mentor_id', $user->id);
                })
                ->with(['material:id,title', 'mentee:id,name,email'])
                ->latest('updated_at')
                ->get();
        } else {
            return response()->json(['message' => 'Role tidak diizinkan.'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $progress
        ], 200);
    }

    /**
     * POST: Mentee mengirimkan/memperbarui data progress belajarnya
     */
    public function upsert(UpdateProgressRequest $request)
    {
        try {
            $user = Auth::user();
            $progress = $this->progressService->upsertProgress($request->validated(), $user);

            return response()->json([
                'status' => 'success',
                'message' => 'Progress belajar berhasil diperbarui.',
                'data' => $progress
            ], 200); // 200 OK karena ini bisa berupa pembuatan baru atau pembaruan

        } catch (Exception $e) {
            $statusCode = $e->getCode() === 403 ? 403 : 400;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }
}