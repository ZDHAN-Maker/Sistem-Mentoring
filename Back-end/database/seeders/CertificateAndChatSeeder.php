<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Seeder;

class CertificateAndChatSeeder extends Seeder
{
    public function run(): void
    {
        $mentee = User::where('email', 'mentee@example.com')->first();
        $mentor = User::where('email', 'mentor@example.com')->first();

        if ($mentee && $mentor) {
            // 1. Seed Sertifikat Digital SKKNI
            Certificate::updateOrCreate(
                ['certificate_code' => 'CERT-SKKNI-2026-AET-89412'],
                [
                    'user_id'          => $mentee->id,
                    'mentor_id'        => $mentor->id,
                    'title'            => 'Full-Stack Web Application Engineering',
                    'program_track'    => 'Software Engineering & Enterprise Web',
                    'skkni_reference'  => 'SKKNI No. 282 Tahun 2016 Bidang Pemrograman Web & Arsitektur API',
                    'grade'            => 'Sangat Baik (Distinction - A)',
                    'competencies'     => [
                        'Penerapan Arsitektur Bersih & RESTful API Enterprise',
                        'Perancangan Skema Database Relasional PostgreSQL',
                        'Manajemen Keamanan Otentikasi Sanctum & CSRF Protection',
                        'Optimasi Kinerja Antarmuka Frontend dengan React & Tailwind'
                    ],
                    'issue_date'       => '2026-02-15',
                    'status'           => 'active',
                ]
            );

            Certificate::updateOrCreate(
                ['certificate_code' => 'CERT-SKKNI-2026-AET-37159'],
                [
                    'user_id'          => $mentee->id,
                    'mentor_id'        => $mentor->id,
                    'title'            => 'UI/UX & Product Design Specialist',
                    'program_track'    => 'Digital Product Design',
                    'skkni_reference'  => 'SKKNI No. 391 Tahun 2019 Bidang Desain Komunikasi Visual & Produk Digital',
                    'grade'            => 'Pujian (High Distinction - A+)',
                    'competencies'     => [
                        'Penyusunan Design System Berbasis Token & Komponen Reusable',
                        'Riset Pengguna (Usability Testing & User Persona Analysis)',
                        'Wireframing & High-Fidelity Interactive Prototyping',
                        'Handoff Design-to-Code Menggunakan Tailwind Standar'
                    ],
                    'issue_date'       => '2026-01-20',
                    'status'           => 'active',
                ]
            );

            // 2. Seed Percakapan Chat Interaktif
            ChatMessage::truncate();

            ChatMessage::create([
                'sender_id'   => $mentee->id,
                'receiver_id' => $mentor->id,
                'message'     => 'Halo Mas Mentor! Selamat siang, saya mau konsultasi terkait penugasan arsitektur API di modul 3.',
                'is_read'     => true,
                'created_at'  => now()->subDay(),
            ]);

            ChatMessage::create([
                'sender_id'   => $mentor->id,
                'receiver_id' => $mentee->id,
                'message'     => 'Halo! Selamat siang. Tentu, ada bagian mana yang membuatmu bingung? Apakah terkait relasi database atau otentikasi Sanctum?',
                'is_read'     => true,
                'created_at'  => now()->subDay()->addMinutes(15),
            ]);

            ChatMessage::create([
                'sender_id'   => $mentee->id,
                'receiver_id' => $mentor->id,
                'message'     => 'Terkait relasi polymorphic untuk attachment tugas mas. Apakah lebih baik pakai foreign key biasa atau polymorphic table?',
                'is_read'     => true,
                'created_at'  => now()->subHours(2),
            ]);

            ChatMessage::create([
                'sender_id'   => $mentor->id,
                'receiver_id' => $mentee->id,
                'message'     => 'Untuk kasus submission tugas dan materi terpisah, saya sangat merekomendasikan tabel polymorphic agar lebih scalable jika nanti ada modul kuis baru!',
                'is_read'     => true,
                'created_at'  => now()->subHour(),
            ]);

            ChatMessage::create([
                'sender_id'   => $mentee->id,
                'receiver_id' => $mentor->id,
                'message'     => 'Wah siap mas! Sangat jelas penjelasannya. Saya implementasikan sekarang ke proyek. Terima kasih banyak!',
                'is_read'     => false,
                'created_at'  => now()->subMinutes(15),
            ]);
        }
    }
}
