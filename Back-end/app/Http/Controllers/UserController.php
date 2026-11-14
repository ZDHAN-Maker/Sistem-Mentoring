<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        return response()->json($this->userService->getAllUsers());
    }

    public function show($id)
    {
        return response()->json($this->userService->getUserById($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->only(['name', 'email', 'password']);
        $user = $this->userService->updateProfile($id, $data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6'
        ]);

        $this->userService->changePassword($id, $request->old_password, $request->new_password);

        return response()->json(['message' => 'Password changed successfully']);
    }

    /**
     * Memperbarui profil akun user yang sedang login (semua role)
     */
    public function updateMyProfile(Request $request)
    {
        try {
            $user = $request->user();
            $data = $request->only(['name', 'email', 'bio', 'avatar']);
            $updatedUser = $this->userService->updateProfile($user->id, $data);

            return response()->json([
                'status'  => 'success',
                'message' => 'Profil berhasil diperbarui.',
                'data'    => $updatedUser->load('roles')
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui profil: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Mengubah password akun user yang sedang login (semua role)
     */
    public function changeMyPassword(Request $request)
    {
        try {
            $request->validate([
                'old_password' => 'required',
                'new_password' => 'required|min:6'
            ]);

            $this->userService->changePassword($request->user()->id, $request->old_password, $request->new_password);

            return response()->json([
                'status'  => 'success',
                'message' => 'Password berhasil diubah.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy($id)
    {
        $this->userService->deleteUser($id);

        return response()->json(['message' => 'User deleted successfully']);
    }
}
