<?php

namespace App\Services;

use App\Models\User;
use App\Models\Schedule;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\ProgressReport;
use App\Models\MaterialProgress;
use App\Models\Material;
use Illuminate\Support\Facades\Storage;
use App\Models\Pairing;
use Illuminate\Validation\ValidationException;

class MentorService
{
    /**
     * Ambil semua user yang berperan sebagai mentor.
     */
    public function getAllMentors()
    {
        return User::where('role', 'mentor')->get();
    }

    /**
     * Ambil detail mentor berdasarkan ID (hanya role mentor).
     */
    public function getMentorById($id)
    {
        return User::where('role', 'mentor')->findOrFail($id);
    }

    /**
     * Ambil semua mentee aktif yang dipair dengan mentor.
     */
    public function getMentorMentees($mentorId)
    {
        return Pairing::with('mentee:id,name,email')
            ->where('mentor_id', $mentorId)
            ->where('status', 'active')
            ->get();
    }

    /**
     * Ambil semua jadwal mentoring milik mentor.
     */
    public function getMentorSchedules($mentorId)
    {
        return Schedule::whereHas('pairing', function ($query) use ($mentorId) {
            $query->where('mentor_id', $mentorId);
        })->get();
    }

    /**
     * Membuat pairing mentor ↔ mentee baru.
     */
    public function createPairing(array $data)
    {
        $exists = Pairing::where('mentor_id', $data['mentor_id'])
            ->where('mentee_id', $data['mentee_id'])
            ->where('status', 'active')
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'pairing' => 'Pairing mentor dan mentee sudah ada.'
            ]);
        }

        return Pairing::create([
            'mentor_id' => $data['mentor_id'],
            'mentee_id' => $data['mentee_id'],
            'status'    => 'active',
        ]);
    }

    /**
     * Membuat jadwal mentoring.
     */
    public function scheduleMentoring(array $data)
    {
        return Schedule::create([
            'pairing_id' => $data['pairing_id'],
            'start_time' => $data['start_time'],
            'end_time'   => $data['end_time'] ?? null,
            'status'     => 'planned',
        ]);
    }

    /**
     * Mentor memberikan tugas ke mentee.
     */
    public function giveTask($mentorId, array $data, Request $request)
    {
        $pairing = Pairing::where('id', $data['pairing_id'])
            ->where('mentor_id', $mentorId)
            ->firstOrFail();

        $taskData = [
            'pairing_id' => $pairing->id,
            'mentor_id'  => $mentorId,
            'mentee_id'  => $pairing->mentee_id,
            'judul'      => $data['judul'],
            'deskripsi'  => $data['deskripsi'] ?? null,
            'type'       => $data['type'],
            'status'     => 'submitted',
        ];

        // Upload file jika tipe tugas adalah "file"
        if ($data['type'] === 'file' && $request->hasFile('file_path')) {
            $taskData['file_path'] = $request->file('file_path')->store('tasks', 'public');
        }

        // Jika tipe "video" atau "link", simpan URL
        if (in_array($data['type'], ['video', 'link'])) {
            $taskData['file_path'] = $data['link_url'];
        }

        return Task::create($taskData);
    }

    /**
     * Mentor memberikan feedback pada laporan progress.
     */
    public function giveFeedback($mentorId, $reportId, $feedback)
    {
        $report = ProgressReport::whereHas('pairing', function ($query) use ($mentorId) {
            $query->where('mentor_id', $mentorId);
        })
            ->with('pairing.mentee')
            ->findOrFail($reportId);

        $report->update([
            'feedback' => $feedback,
        ]);

        return $report;
    }

    /**
     * Upload materi baru oleh mentor + generate progress otomatis untuk semua mentee yang dipair.
     */
    public function uploadMaterial($mentorId, array $data, Request $request)
    {
        $filePath = null;

        // Upload video materi
        if ($request->hasFile('video')) {
            $filePath = $request->file('video')->store('materials', 'public');
        }

        // Buat material baru
        $material = Material::create([
            'mentor_id'  => $mentorId,
            'title'      => $data['title'],
            'video_path' => $filePath,
        ]);

        // Ambil semua pairing aktif mentor
        $pairings = Pairing::where('mentor_id', $mentorId)
            ->where('status', 'active')
            ->get();

        // Generate progress untuk semua mentee
        foreach ($pairings as $pairing) {
            MaterialProgress::firstOrCreate(
                [
                    'material_id' => $material->id,
                    'mentee_id'   => $pairing->mentee_id,
                ],
                [
                    'watch_duration' => 0,
                    'is_completed'   => false,
                ]
            );
        }

        return $material;
    }

    /**
     * Ambil progress materi untuk semua mentee di pairing tertentu.
     */
    public function getMentorMaterialProgress($mentorId, $pairingId)
    {
        return MaterialProgress::whereHas('material', function ($query) use ($mentorId) {
            $query->where('mentor_id', $mentorId);
        })
            ->whereHas('mentee.pairings', function ($query) use ($pairingId) {
                $query->where('pairings.id', $pairingId)
                    ->where('pairings.status', 'active');
            })
            ->with([
                'material:id,title',
                'mentee:id,name'
            ])
            ->get();
    }

    /**
     * Dashboard mentor otomatis.
     */
    public function getMentorDashboard($mentorId)
    {
        $mentor = User::findOrFail($mentorId);

        // Ambil semua pairing mentor
        $pairingIds = Pairing::where('mentor_id', $mentorId)->pluck('id');

        return [
            'mentor' => [
                'id'    => $mentor->id,
                'name'  => $mentor->name,
                'email' => $mentor->email,
            ],
            'program' => 'Program Default',
            'totalMentee'      => $pairingIds->count(),
            'totalSession'     => Schedule::whereIn('pairing_id', $pairingIds)->count(),
            'completedSession' => ProgressReport::whereIn('pairing_id', $pairingIds)->count(),
            'progress' => function () use ($pairingIds) {
                $total = Schedule::whereIn('pairing_id', $pairingIds)->count();
                $done  = ProgressReport::whereIn('pairing_id', $pairingIds)->count();
                return $total > 0 ? round(($done / $total) * 100) : 0;
            },
        ];
    }

    /**
     * Ambil pairing aktif milik mentor beserta jadwalnya.
     */
    public function getMentorPairings($mentorId)
    {
        return Pairing::with([
            'mentee:id,name',
            'schedules:id,pairing_id,start_time,end_time,status'
        ])
            ->where('mentor_id', $mentorId)
            ->where('status', 'active')
            ->get();
    }

    /**
     * Update jadwal mentoring.
     */
    public function updateSchedule($mentorId, $scheduleId, array $data)
    {
        $schedule = Schedule::where('id', $scheduleId)
            ->whereHas('pairing', function ($query) use ($mentorId) {
                $query->where('mentor_id', $mentorId);
            })
            ->firstOrFail();

        $schedule->update([
            'start_time' => $data['start_time'] ?? $schedule->start_time,
            'end_time'   => $data['end_time'] ?? $schedule->end_time,
            'status'     => $data['status'] ?? $schedule->status,
        ]);

        return $schedule;
    }

    /**
     * Hapus jadwal mentoring.
     */
    public function deleteSchedule($mentorId, $scheduleId)
    {
        $schedule = Schedule::where('id', $scheduleId)
            ->whereHas('pairing', function ($query) use ($mentorId) {
                $query->where('mentor_id', $mentorId)
                    ->where('status', 'active');
            })
            ->firstOrFail();

        $schedule->delete();
        return true;
    }

    /**
     * Ambil semua progress report dari mentee mentor.
     */
    public function getMyMenteesReports($mentorId)
    {
        return ProgressReport::whereHas('pairing', function ($query) use ($mentorId) {
            $query->where('mentor_id', $mentorId);
        })
            ->with([
                'pairing.mentee:id,name,email',
                'pairing.mentor:id,name'
            ])
            ->latest()
            ->get();
    }
}
