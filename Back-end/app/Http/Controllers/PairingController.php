<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePairingRequest;
use App\Services\PairingService;
use App\Models\Pairing;
use Illuminate\Http\Request;
use Exception;

class PairingController extends Controller
{
    protected $pairingService;

    public function __construct(PairingService $pairingService)
    {
        $this->pairingService = $pairingService;
    }

    /**
     * Menampilkan daftar semua pairing (opsional, untuk dashboard admin)
     */
    public function index()
    {
        // Mengambil semua data pairing beserta relasi mentor dan mentee-nya
        $pairings = Pairing::with(['mentor:id,name,email', 'mentee:id,name,email'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $pairings
        ], 200);
    }

    /**
     * Memasangkan Mentor dan Mentee (Create Pairing)
     */
    public function store(StorePairingRequest $request)
    {
        try {
            $pairing = $this->pairingService->createPairing($request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Pairing berhasil dibuat. Hubungan mentoring resmi terbentuk.',
                'data' => $pairing->load(['mentor:id,name', 'mentee:id,name']) // Load data relasi untuk respons
            ], 201); // 201 Created

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat pairing: ' . $e->getMessage()
            ], 400); // 400 Bad Request
        }
    }

    /**
     * Mengakhiri sesi mentoring
     */
    public function complete(Pairing $pairing)
    {
        try {
            $completedPairing = $this->pairingService->endPairing($pairing);

            return response()->json([
                'status' => 'success',
                'message' => 'Sesi mentoring berhasil diakhiri.',
                'data' => $completedPairing
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengakhiri pairing: ' . $e->getMessage()
            ], 400);
        }
    }
}