<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * GET /api/dashboard
     * Endpoint tunggal cerdas untuk memuat data kartu dashboard secara dinamis
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $data = [];
            $activeRole = 'Unknown';

            // Seleksi data berdasarkan Role Prioritas pengguna
            if ($user->hasRole('Admin')) {
                $activeRole = 'Admin';
                $data = $this->dashboardService->getAdminDashboardStats();
            } elseif ($user->hasRole('Mentor')) {
                $activeRole = 'Mentor';
                $data = $this->dashboardService->getMentorDashboardStats($user);
            } elseif ($user->hasRole('Mentee')) {
                $activeRole = 'Mentee';
                $data = $this->dashboardService->getMenteeDashboardStats($user);
            } else {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Role Anda tidak terdaftar di sistem dashboard.'
                ], 403);
            }

            return response()->json([
                'status'  => 'success',
                'message' => "Data dashboard untuk role {$activeRole} berhasil dimuat.",
                'role'    => $activeRole,
                'cards'   => $data
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memuat data dashboard, terjadi kesalahan sistem.',
                'debug'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}