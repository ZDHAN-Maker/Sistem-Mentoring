<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'title' => 'Paket Gratis',
                'price' => 'Rp 0 / selamanya',
                'numeric_price' => 0,
                'period' => 'selamanya',
                'icon' => '📦',
                'features' => [
                    ['text' => 'Akses materi dasar gratis', 'available' => true],
                    ['text' => 'Akses forum komunitas diskusi', 'available' => true],
                    ['text' => 'Mentoring 1-on-1 pribadi', 'available' => false],
                    ['text' => 'Review submission tugas dari mentor', 'available' => false],
                    ['text' => 'Sertifikat kelulusan resmi', 'available' => false],
                ],
                'button_text' => 'Mulai Belajar Gratis',
                'button_style' => 'bg-[#7B5E4A] hover:bg-[#6A503F]',
                'card_style' => 'bg-white border border-[#7B5E4A]/30',
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Paket Premium',
                'price' => 'Rp 79.000 / bulan',
                'numeric_price' => 79000,
                'period' => 'bulan',
                'icon' => '👑',
                'features' => [
                    ['text' => 'Akses semua modul materi premium', 'available' => true],
                    ['text' => 'Download modul & source code', 'available' => true],
                    ['text' => 'Review tugas bimbingan oleh mentor', 'available' => true],
                    ['text' => 'Sertifikat kompetensi resmi', 'available' => true],
                    ['text' => 'Mentoring 1-on-1 bulanan', 'available' => false],
                ],
                'button_text' => 'Pilih Paket Premium',
                'button_style' => 'bg-[#b38867] hover:bg-[#a27355]',
                'card_style' => 'bg-white border-2 border-[#b38867] shadow-xl',
                'is_popular' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Paket Exclusive',
                'price' => 'Rp 199.000 / bulan',
                'numeric_price' => 199000,
                'period' => 'bulan',
                'icon' => '💎',
                'features' => [
                    ['text' => 'Semua fitur paket Premium', 'available' => true],
                    ['text' => 'Mentoring 1-on-1 intensif bulanan', 'available' => true],
                    ['text' => 'Akses ke Grup Mastermind & Relasi Karier', 'available' => true],
                    ['text' => 'Portofolio review & bimbingan interview', 'available' => true],
                    ['text' => 'Sertifikat kehormatan eksklusif', 'available' => true],
                ],
                'button_text' => 'Daftar Paket Exclusive',
                'button_style' => 'bg-gray-900 hover:bg-black',
                'card_style' => 'bg-white border border-gray-300',
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['title' => $plan['title']],
                $plan
            );
        }
    }
}
