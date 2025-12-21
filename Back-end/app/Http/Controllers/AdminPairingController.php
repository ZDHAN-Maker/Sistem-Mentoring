<?php

namespace App\Http\Controllers;

use App\Services\AdminPairingService;
use Illuminate\Http\Request;

class AdminPairingController extends Controller
{
    protected $pairingService;

    public function __construct(AdminPairingService $pairingService)
    {
        $this->pairingService = $pairingService;
    }

    /**
     * List semua pairing
     */
    public function index()
    {
        return response()->json([
            'data' => $this->pairingService->getAllPairings()
        ]);
    }

    /**
     * Buat pairing mentor ↔ mentee
     */
    public function store(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id',
            'mentee_id' => 'required|exists:users,id',
        ]);

        $pairing = $this->pairingService->createPairing(
            $request->mentor_id,
            $request->mentee_id
        );

        return response()->json([
            'message' => 'Pairing berhasil dibuat',
            'data' => $pairing
        ], 201);
    }

    /**
     * Hapus pairing
     */
    public function destroy($id)
    {
        $this->pairingService->deletePairing($id);

        return response()->json([
            'message' => 'Pairing berhasil dihapus'
        ]);
    }
}
