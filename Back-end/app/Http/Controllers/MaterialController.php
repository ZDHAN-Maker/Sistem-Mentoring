<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialRequest;
use App\Models\Material;
use App\Models\Pairing;
use App\Services\MaterialService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MaterialController extends Controller
{
    protected $materialService;

    public function __construct(MaterialService $materialService)
    {
        $this->materialService = $materialService;
    }

    /**
     * GET: Menampilkan daftar materi
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->hasRole('Mentor')) {
            // Mentor melihat semua materi yang dia buat
            $materials = Material::where('mentor_id', $user->id)
                ->with('pairing:id,mentee_id') // Optional: Lihat spesifik pairing
                ->latest()
                ->get();
        } else if ($user->hasRole('Mentee')) {
            // Mentee melihat materi dari pairing miliknya (materi spesifik ATAU materi general dari mentornya)
            $mentorIds = Pairing::where('mentee_id', $user->id)->pluck('mentor_id');
            $pairingIds = Pairing::where('mentee_id', $user->id)->pluck('id');

            $materials = Material::where('status', 'published')
                ->where(function ($query) use ($mentorIds, $pairingIds) {
                    $query->whereIn('pairing_id', $pairingIds) // Materi spesifik untuk mentee ini
                          ->orWhere(function ($q) use ($mentorIds) {
                              $q->whereNull('pairing_id')->whereIn('mentor_id', $mentorIds); // Materi umum dari mentornya
                          });
                })->latest()->get();
        } else {
            return response()->json(['message' => 'Role tidak valid.'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $materials
        ], 200);
    }

    /**
     * POST: Mentor membuat materi baru
     */
    public function store(StoreMaterialRequest $request)
    {
        try {
            $user = Auth::user();
            $file = $request->file('file'); // Ambil file jika ada

            $material = $this->materialService->createMaterial($request->validated(), $user, $file);

            return response()->json([
                'status' => 'success',
                'message' => 'Materi berhasil diunggah.',
                'data' => $material
            ], 201);

        } catch (Exception $e) {
            $statusCode = $e->getCode() === 403 ? 403 : 400;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * POST: Mentor mengubah materi (Menggunakan POST karena upload file di PHP via PUT sering bermasalah)
     */
    public function update(StoreMaterialRequest $request, Material $material)
    {
        try {
            $user = Auth::user();
            $file = $request->file('file');

            $updatedMaterial = $this->materialService->updateMaterial($material, $request->validated(), $user, $file);

            return response()->json([
                'status' => 'success',
                'message' => 'Materi berhasil diperbarui.',
                'data' => $updatedMaterial
            ], 200);

        } catch (Exception $e) {
            $statusCode = $e->getCode() === 403 ? 403 : 400;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * DELETE: Mentor menghapus materi
     */
    public function destroy(Material $material)
    {
        try {
            $user = Auth::user();
            $this->materialService->deleteMaterial($material, $user);

            return response()->json([
                'status' => 'success',
                'message' => 'Materi berhasil dihapus.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 403);
        }
    }
}