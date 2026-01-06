<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\Task;
use Illuminate\Http\Request;

class SubmissionService
{
    public function submitTask($menteeId, $taskId, Request $request)
    {
        $task = Task::where('id', $taskId)
            ->where('mentee_id', $menteeId)
            ->firstOrFail();

        $data = $request->validate([
            'file'   => 'nullable|file|max:10240',
            'answer' => 'nullable|string'
        ]);

        if (!$request->hasFile('file') && empty($data['answer'])) {
            throw new \Exception("File atau jawaban harus diisi.");
        }

        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('submissions', 'public');
        }

        return Submission::create([
            'task_id'   => $task->id,
            'mentee_id' => $menteeId,
            'file_path' => $filePath,
            'answer'    => $data['answer'] ?? null,
            'status'    => 'submitted',
        ]);
    }


    public function listSubmissionsForMentor($mentorId, $pairingId = null)
    {
        return Submission::whereHas('task', function ($q) use ($mentorId, $pairingId) {
            $q->where('mentor_id', $mentorId)
              ->when($pairingId, fn($qr) => $qr->where('pairing_id', $pairingId));
        })
        ->with(['task', 'mentee'])
        ->orderBy('created_at', 'desc')
        ->get();
    }


    public function gradeSubmission($mentorId, $submissionId, array $data)
    {
        $submission = Submission::where('id', $submissionId)
            ->whereHas('task', fn($q) => $q->where('mentor_id', $mentorId))
            ->firstOrFail();

        $submission->update([
            'grade'  => $data['grade'],
            'status' => $data['status']
        ]);

        return $submission;
    }
}
