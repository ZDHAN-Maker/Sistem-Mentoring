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
     * Menampilkan daftar semua pairing (untuk dashboard admin)
     */
    public function index()
    {
        // Mengambil semua data pairing beserta relasi mentor, mentee, subscription plan, dan statistik aktivitas
        $pairings = Pairing::with([
            'mentor:id,name,email,phone,avatar',
            'mentor.learningActivities:id,title',
            'mentee:id,name,email,phone,avatar',
            'mentee.learningActivities:id,title',
            'subscriptionPlan'
        ])
        ->withCount(['schedules', 'tasks', 'progressReports'])
        ->latest()
        ->get();

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
                'data' => $pairing->load(['mentor:id,name', 'mentee:id,name'])
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat pairing: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Mengakhiri sesi mentoring dengan opsi evaluasi dan sertifikat
     */
    public function complete(Request $request, Pairing $pairing)
    {
        try {
            $data = $request->only(['completion_status', 'completion_notes', 'certificate_eligible']);
            $completedPairing = $this->pairingService->endPairing($pairing, $data);

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

    /**
     * Memperpanjang masa langganan / durasi pairing
     */
    public function extend(Request $request, Pairing $pairing)
    {
        $validated = $request->validate([
            'additional_months'    => 'required|integer|min:1|max:36',
            'subscription_plan_id' => 'nullable|exists:subscription_plans,id',
            'subscription_name'    => 'nullable|string|max:255',
            'notes'                => 'nullable|string|max:500',
        ]);

        try {
            $extendedPairing = $this->pairingService->extendPairing($pairing, $validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Masa langganan pairing berhasil diperpanjang +' . $validated['additional_months'] . ' bulan.',
                'data'    => $extendedPairing->load(['mentor:id,name,email,phone', 'mentee:id,name,email,phone', 'subscriptionPlan'])
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperpanjang masa langganan: ' . $e->getMessage()
            ], 400);
        }
    }
}