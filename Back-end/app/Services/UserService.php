<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserService
{
    /**
     * Get all users
     */
    public function getAllUsers()
    {
        return User::all();
    }

    /**
     * Get user by id
     */
    public function getUserById($id)
    {
        return User::findOrFail($id);
    }

    /**
     * Update user profile
     */
    public function updateProfile($id, array $data)
    {
        $user = User::findOrFail($id);

        // Update field yang diperbolehkan
        $user->name  = $data['name'] ?? $user->name;
        $user->email = $data['email'] ?? $user->email;

        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return $user;
    }

    /**
     * Change password
     */
    public function changePassword($id, $oldPassword, $newPassword)
    {
        $user = User::findOrFail($id);

        if (!Hash::check($oldPassword, $user->password)) {
            throw ValidationException::withMessages([
                'password' => 'Old password is incorrect.'
            ]);
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        return $user;
    }

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        return $user->delete();
    }

    public function getAuthenticatedUser($request)
    {
        return $request->user();
    }
}
