<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Ambil data dashboard sesuai role user yang login
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $stats = $this->dashboardService->getAdminStats();
        } elseif ($user->role === 'mentor') {
            $stats = $this->dashboardService->getMentorStats($user->id);
        } else { // mentee
            $stats = $this->dashboardService->getMenteeStats($user->id);
        }

        return response()->json([
            'role'  => $user->role,
            'stats' => $stats,
        ]);
    }
}
