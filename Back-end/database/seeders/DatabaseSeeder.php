<?php

namespace Database\Seeders;

<<<<<<< HEAD
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Mentor User',
            'email' => 'mentor@example.com',
            'password' => Hash::make('password'),
            'role' => 'mentor',
        ]);

        User::create([
            'name' => 'Mentee User',
            'email' => 'mentee@example.com',
            'password' => Hash::make('password'),
            'role' => 'mentee',
        ]);
    }
}

=======
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
>>>>>>> da5b1b2f05de3209f3089bd604b326bb32316d7b
