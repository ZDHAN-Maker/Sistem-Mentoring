<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $adminRole  = Role::where('name', 'Admin')->first();
        $mentorRole = Role::where('name', 'Mentor')->first();
        $menteeRole = Role::where('name', 'Mentee')->first();

        // Menggunakan updateOrCreate untuk mencari email, jika ada akan diupdate, jika tidak akan dibuat.
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'], // Kondisi pencarian
            [
                'name'      => 'Admin User',
                'password'  => Hash::make('password'),
                'is_active' => true, 
            ]
        );
        if ($adminRole) {
            // Menggunakan syncWithoutDetaching agar data relasi tidak duplikat
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        $mentor = User::updateOrCreate(
            ['email' => 'mentor@example.com'],
            [
                'name'      => 'Mentor User',
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );
        if ($mentorRole) {
            $mentor->roles()->syncWithoutDetaching([$mentorRole->id]);
        }

        $mentee = User::updateOrCreate(
            ['email' => 'mentee@example.com'],
            [
                'name'      => 'Mentee User',
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );
        if ($menteeRole) {
            $mentee->roles()->syncWithoutDetaching([$menteeRole->id]);
        }
    }
}