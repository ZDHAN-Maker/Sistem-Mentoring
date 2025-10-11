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

    public function destroy($id)
    {
        $this->userService->deleteUser($id);

        return response()->json(['message' => 'User deleted successfully']);
    }
}
