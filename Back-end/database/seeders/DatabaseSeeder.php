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
        // 1. Jalankan RoleSeeder terlebih dahulu agar data 'Admin', 'Mentor', 'Mentee' tercipta
        $this->call(RoleSeeder::class);

        // 2. Ambil instance masing-masing Role dari database (Gunakan Huruf Kapital sesuai Seeder)
        $adminRole  = Role::where('name', 'Admin')->first();
        $mentorRole = Role::where('name', 'Mentor')->first();
        $menteeRole = Role::where('name', 'Mentee')->first();

        // 3. Buat Admin User & Pasangkan Relasi
        $admin = User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_active' => true, // Tambahkan ini karena di AuthService Anda set true
        ]);
        if ($adminRole) {
            $admin->roles()->attach($adminRole->id);
        }

        // 4. Buat Mentor User & Pasangkan Relasi
        $mentor = User::create([
            'name'     => 'Mentor User',
            'email'    => 'mentor@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        if ($mentorRole) {
            $mentor->roles()->attach($mentorRole->id);
        }

        // 5. Buat Mentee User & Pasangkan Relasi
        $mentee = User::create([
            'name'     => 'Mentee User',
            'email'    => 'mentee@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        if ($menteeRole) {
            $mentee->roles()->attach($menteeRole->id);
        }
    }
}
