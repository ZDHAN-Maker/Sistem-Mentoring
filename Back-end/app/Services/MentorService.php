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
     * Ambil semua mentor
     */
    public function getAllMentors()
    {
        return User::where('role', 'mentor')->get();
    }

    /**
     * Ambil detail mentor tertentu
     */
    public function getMentorById($id)
    {
        return User::where('role', 'mentor')->findOrFail($id);
    }

    /**
     * Ambil semua mentee milik mentor
     */
    public function getMentorMentees($mentorId)
    {
        return Pairing::with('mentee:id,name,email')
            ->where('mentor_id', $mentorId)
            ->where('status', 'active')
            ->get();
    }

    /**
     * Ambil semua jadwal mentor
     */
    public function getMentorSchedules($mentorId)
    {
        return Schedule::whereHas('pairing', function ($q) use ($mentorId) {
            $q->where('mentor_id', $mentorId);
        })->get();
    }

    /**
     * Buat pairing mentor ↔ mentee
     */
    public function createPairing(array $data)
    {
        $exists = Pairing::where('mentor_id', $data['mentor_id'])
            ->where('mentee_id', $data['mentee_id'])
            ->where('status', 'active')
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'pairing' => 'Pairing mentor dan mentee sudah ada'
            ]);
        }

        return Pairing::create([
            'mentor_id' => $data['mentor_id'],
            'mentee_id' => $data['mentee_id'],
            'status'    => 'active',
        ]);
    }


    /**
     * Buat jadwal mentoring
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
     * Berikan tugas
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

        if ($data['type'] === 'file' && $request->hasFile('file_path')) {
            $path = $request->file('file_path')->store('tasks', 'public');
            $taskData['file_path'] = $path;
        }

        if (in_array($data['type'], ['video', 'link'])) {
            $taskData['file_path'] = $data['link_url'];
        }

        return Task::create($taskData);
    }


    /**
     * Berikan feedback
     */
    public function giveFeedback($mentorId, $reportId, $feedback)
    {
        $report = ProgressReport::whereHas('pairing', function ($q) use ($mentorId) {
            $q->where('mentor_id', $mentorId);
        })
            ->with('pairing.mentee')
            ->findOrFail($reportId);

        $report->update([
            'feedback' => $feedback
        ]);

        return $report;
    }


    /**
     * Upload materi oleh mentor
     */
    public function uploadMaterial($mentorId, array $data, Request $request)
    {
        $filePath = null;

        // Upload video
        if ($request->hasFile('video')) {
            $filePath = $request->file('video')->store('materials', 'public');
        }

        // Buat material 1x saja untuk mentor
        $material = Material::create([
            'mentor_id'  => $mentorId,
            'title'      => $data['title'],
            'video_path' => $filePath,
        ]);

        // Ambil semua mentee yang dipairing dengan mentor ini
        $pairings = Pairing::where('mentor_id', $mentorId)
            ->where('status', 'active')
            ->get();

        // Buat progress otomatis untuk setiap mentee
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

    public function getMentorMaterialProgress($mentorId, $pairingId)
    {
        return MaterialProgress::whereHas('material', function ($q) use ($mentorId) {
            $q->where('mentor_id', $mentorId);
        })
            ->whereHas('mentee.pairings', function ($q) use ($pairingId) {
                $q->where('pairings.id', $pairingId)
                    ->where('pairings.status', 'active');
            })
            ->with([
                'material:id,title',
                'mentee:id,name'
            ])
            ->get();
    }



    /**
     * Dashboard otomatis
     */

    public function getMentorDashboard($mentorId)
    {
        $mentor = User::findOrFail($mentorId);

        // Ambil semua pairing mentor
        $pairingIds = Pairing::where('mentor_id', $mentorId)
            ->pluck('id');

        // Total mentee
        $totalMentee = $pairingIds->count();

        // Total sesi terjadwal
        $totalSession = Schedule::whereIn('pairing_id', $pairingIds)
            ->count();

        // Total sesi selesai (progress report)
        $completedSession = ProgressReport::whereIn('pairing_id', $pairingIds)
            ->count();

        return [
            'mentor' => [
                'id'   => $mentor->id,
                'name' => $mentor->name,
                'email' => $mentor->email,
            ],
            'program' => 'Program Default',
            'totalMentee' => $totalMentee,
            'totalSession' => $totalSession,
            'completedSession' => $completedSession,
            'progress' => $totalSession > 0
                ? round(($completedSession / $totalSession) * 100)
                : 0,
        ];
    }

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

    // Update Schedule
    public function updateSchedule($mentorId, $scheduleId, array $data)
    {
        $schedule = Schedule::where('id', $scheduleId)
            ->whereHas('pairing', function ($q) use ($mentorId) {
                $q->where('mentor_id', $mentorId);
            })
            ->firstOrFail();

        $schedule->update([
            'start_time' => $data['start_time'] ?? $schedule->start_time,
            'end_time'   => $data['end_time'] ?? $schedule->end_time,
            'status'     => $data['status'] ?? $schedule->status,
        ]);

        return $schedule;
    }

    // delete shcedule
    public function deleteSchedule($mentorId, $scheduleId)
    {
        $schedule = Schedule::where('id', $scheduleId)
            ->whereHas('pairing', function ($q) use ($mentorId) {
                $q->where('mentor_id', $mentorId)
                    ->where('status', 'active');
            })
            ->with('pairing')
            ->firstOrFail();
        $schedule->delete();

        return true;
    }

    public function getMyMenteesReports($mentorId)
    {
        return ProgressReport::whereHas('pairing', function ($q) use ($mentorId) {
            $q->where('mentor_id', $mentorId);
        })
            ->with([
                'pairing.mentee:id,name,email',
                'pairing.mentor:id,name'
            ])
            ->latest()
            ->get();
    }
}
