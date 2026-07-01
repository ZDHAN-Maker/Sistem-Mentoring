<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Data role yang akan dimasukkan ke kolom 'name' sesuai $fillable di model
        $roles = [
            ['name' => 'Admin'],
            ['name' => 'Mentor'],
            ['name' => 'Mentee'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate($role);
        }
    }
}
