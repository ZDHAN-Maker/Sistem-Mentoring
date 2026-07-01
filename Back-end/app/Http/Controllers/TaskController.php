<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Exception;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['pairing_id', 'status', 'per_page']);
            $tasks = $this->taskService->getTasksByUser($request->user(), $filters);

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar tugas berhasil diambil.',
                'data'    => $tasks->items(),
                'meta'    => [
                    'current_page' => $tasks->currentPage(),
                    'last_page'    => $tasks->lastPage(),
                    'per_page'     => $tasks->perPage(),
                    'total'        => $tasks->total(),
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan sistem.'], 500);
        }
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        try {
            $task = $this->taskService->createTask($request->validated(), $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Tugas berhasil dibuat.',
                'data'    => $task
            ], 201);
        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal membuat tugas.'], 400);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $task = $this->taskService->getTaskById($id, $request->user());

            return response()->json([
                'status'  => 'success',
                'data'    => $task
            ], 200);
        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        }
    }

    public function update(UpdateTaskRequest $request, int $id): JsonResponse
    {
        try {
            $task = $this->taskService->updateTask($id, $request->validated(), $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Tugas berhasil diperbarui.',
                'data'    => $task
            ], 200);
        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->taskService->deleteTask($id, $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Tugas berhasil dihapus.'
            ], 200);
        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        }
    }
}