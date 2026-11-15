<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class SubscriptionPlanController extends Controller
{
    /**
     * GET /api/subscription-plans
     * Publik & Admin: menampilkan daftar paket
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = SubscriptionPlan::orderBy('sort_order', 'asc')->orderBy('numeric_price', 'asc');

            // Jika bukan admin atau request publik, hanya tampilkan yang is_active = true
            if (!$request->user() || !$request->user()->hasRole('Admin')) {
                $query->where('is_active', true);
            }

            $plans = $query->get();

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar paket langganan berhasil diambil.',
                'data'    => $plans
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memuat paket langganan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/subscription-plans
     * Admin: membuat paket baru
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:100',
            'price'         => 'required|string|max:100',
            'numeric_price' => 'nullable|integer|min:0',
            'period'        => 'nullable|string|max:50',
            'icon'          => 'nullable|string|max:20',
            'features'      => 'nullable|array',
            'features.*.text' => 'required|string',
            'features.*.available' => 'required|boolean',
            'button_text'   => 'nullable|string|max:100',
            'is_popular'    => 'nullable|boolean',
            'is_active'     => 'nullable|boolean',
            'sort_order'    => 'nullable|integer',
        ]);

        try {
            $plan = SubscriptionPlan::create([
                'title'         => $validated['title'],
                'price'         => $validated['price'],
                'numeric_price' => $validated['numeric_price'] ?? 0,
                'period'        => $validated['period'] ?? 'bulan',
                'icon'          => $validated['icon'] ?? '📦',
                'features'      => $validated['features'] ?? [],
                'button_text'   => $validated['button_text'] ?? 'Pilih Paket',
                'button_style'  => 'bg-[#b38867] hover:bg-[#a27355]',
                'card_style'    => !empty($validated['is_popular']) ? 'bg-white border-2 border-[#b38867] shadow-xl' : 'bg-white border border-gray-200',
                'is_popular'    => $validated['is_popular'] ?? false,
                'is_active'     => $validated['is_active'] ?? true,
                'sort_order'    => $validated['sort_order'] ?? 0,
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Paket langganan berhasil ditambahkan.',
                'data'    => $plan
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal membuat paket: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * PUT /api/subscription-plans/{id}
     * Admin: mengedit paket
     */
    public function update(Request $request, $id): JsonResponse
    {
        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'title'         => 'sometimes|required|string|max:100',
            'price'         => 'sometimes|required|string|max:100',
            'numeric_price' => 'nullable|integer|min:0',
            'period'        => 'nullable|string|max:50',
            'icon'          => 'nullable|string|max:20',
            'features'      => 'nullable|array',
            'button_text'   => 'nullable|string|max:100',
            'is_popular'    => 'nullable|boolean',
            'is_active'     => 'nullable|boolean',
            'sort_order'    => 'nullable|integer',
        ]);

        try {
            $plan->update($validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Paket langganan berhasil diperbarui.',
                'data'    => $plan
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui paket: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/subscription-plans/{id}
     * Admin: menghapus paket
     */
    public function destroy($id): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::findOrFail($id);
            $plan->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Paket langganan berhasil dihapus.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menghapus paket: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * PATCH /api/subscription-plans/{id}/toggle-active
     * Admin: mengaktifkan / menonaktifkan status paket
     */
    public function toggleActive($id): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::findOrFail($id);
            $plan->is_active = !$plan->is_active;
            $plan->save();

            return response()->json([
                'status'  => 'success',
                'message' => 'Status paket berhasil diubah.',
                'data'    => $plan
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengubah status: ' . $e->getMessage()
            ], 400);
        }
    }
}
