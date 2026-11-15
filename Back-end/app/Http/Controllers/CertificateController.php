<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /**
     * GET /api/certificates
     * Mendapatkan daftar sertifikat milik user yang login (Mentee) atau semua sertifikat (Admin)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Certificate::with(['mentee', 'mentor']);

        if ($user->hasRole('Mentee')) {
            $query->where('user_id', $user->id);
        } elseif ($user->hasRole('Mentor')) {
            $query->where('mentor_id', $user->id);
        }

        $certificates = $query->latest('issue_date')->get();

        return response()->json([
            'status' => 'success',
            'data'   => $certificates,
        ]);
    }

    /**
     * GET /api/certificates/{code}
     * Detail sertifikat
     */
    public function show(string $code): JsonResponse
    {
        $certificate = Certificate::with(['mentee', 'mentor'])
            ->where('certificate_code', $code)
            ->first();

        if (!$certificate) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Sertifikat dengan nomor registrasi tersebut tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $certificate,
        ]);
    }

    /**
     * GET /api/public/verify-certificate/{code}
     * Endpoint publik verifikasi sertifikat (tidak memerlukan login)
     */
    public function verify(string $code): JsonResponse
    {
        $certificate = Certificate::with([
            'mentee:id,name,email',
            'mentor:id,name'
        ])
        ->where('certificate_code', trim($code))
        ->first();

        if (!$certificate) {
            return response()->json([
                'status'   => 'not_found',
                'verified' => false,
                'message'  => 'Nomor sertifikat tidak terdaftar dalam pangkalan data verifikasi Aeterna Mentoring.',
            ], 404);
        }

        return response()->json([
            'status'   => 'verified',
            'verified' => true,
            'message'  => 'Sertifikat sah, resmi, dan terverifikasi di pangkalan data Aeterna.',
            'data'     => [
                'certificate_code' => $certificate->certificate_code,
                'recipient_name'   => $certificate->mentee->name ?? 'Peserta Terdaftar',
                'title'            => $certificate->title,
                'program_track'    => $certificate->program_track,
                'skkni_reference'  => $certificate->skkni_reference,
                'grade'            => $certificate->grade,
                'competencies'     => $certificate->competencies ?? [],
                'issue_date'       => $certificate->issue_date->format('d F Y'),
                'status'           => $certificate->status,
                'mentor_name'      => $certificate->mentor->name ?? 'Senior Mentor Aeterna',
            ],
        ]);
    }

    /**
     * POST /api/certificates
     * Penerbitan sertifikat baru oleh Admin atau Mentor
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id'       => 'required|exists:users,id',
            'title'         => 'required|string|max:255',
            'program_track' => 'required|string|max:255',
            'grade'         => 'nullable|string',
            'competencies'  => 'nullable|array',
        ]);

        $code = 'CERT-SKKNI-' . date('Y') . '-AET-' . strtoupper(Str::random(6));

        $certificate = Certificate::create([
            'certificate_code' => $code,
            'user_id'          => $request->user_id,
            'mentor_id'        => $request->user()->id,
            'title'            => $request->title,
            'program_track'    => $request->program_track,
            'skkni_reference'  => $request->skkni_reference ?? 'SKKNI No. 282 Tahun 2016 Bidang Pemrograman Web',
            'grade'            => $request->grade ?? 'Sangat Baik (A)',
            'competencies'     => $request->competencies ?? [
                'Penerapan Standar Arsitektur Web & RESTful API',
                'Manajemen Basis Data Relasional & Transaksi',
                'Implementasi Pengamanan Otentikasi & Autorisasi User'
            ],
            'issue_date'       => now()->toDateString(),
            'status'           => 'active',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Sertifikat resmi berhasil diterbitkan.',
            'data'    => $certificate,
        ], 201);
    }
}
