<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Resources\StudentResource;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StudentController extends Controller
{
    public function __construct(
        private readonly StudentService $studentService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only([
            'search',
            'jurusan_id',
            'kelas',
            'status',
            'per_page',
        ]);

        return StudentResource::collection($this->studentService->getAll($filters));
    }

    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = $this->studentService->create($request->validated());

        return response()->json([
            'message' => 'Data siswa berhasil ditambahkan.',
            'data' => new StudentResource($student),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $student = $this->studentService->getById($id);

        return response()->json([
            'data' => new StudentResource($student),
        ]);
    }

    public function update(StoreStudentRequest $request, int $id): JsonResponse
    {
        $student = $this->studentService->update($id, $request->validated());

        return response()->json([
            'message' => 'Data siswa berhasil diperbarui.',
            'data' => new StudentResource($student),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->studentService->delete($id);

        return response()->json([
            'message' => 'Data siswa berhasil dihapus.',
        ]);
    }
}
