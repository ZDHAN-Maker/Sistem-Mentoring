<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScheduleRequest;
use App\Services\ScheduleService;
use Illuminate\Http\JsonResponse;

class ScheduleController extends Controller
{
    protected $service;

    public function __construct(ScheduleService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();

        $schedules = $this->service->getAllForUser($user);

        return response()->json([
            'message' => 'List of schedules',
            'data' => $schedules
        ]);
    }

    public function store(ScheduleRequest $request): JsonResponse
    {
        $schedule = $this->service->create($request->validated());

        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => $schedule
        ], 201);
    }

    public function show($id): JsonResponse
    {
        return response()->json([
            'data' => $this->service->getById($id)
        ]);
    }

    public function update(ScheduleRequest $request, $id): JsonResponse
    {
        $schedule = $this->service->update($id, $request->validated());

        return response()->json([
            'message' => 'Schedule updated successfully',
            'data' => $schedule
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Schedule deleted successfully'
        ]);
    }
}
