<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Services\TeacherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TeacherController extends Controller
{
    public function __construct(
        private readonly TeacherService $teacherService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only([
            'search',
            'jenis_kelamin',
            'status_kepegawaian',
            'pendidikan_terakhir',
            'per_page',
        ]);

        return TeacherResource::collection($this->teacherService->getAll($filters));
    }

    public function store(StoreTeacherRequest $request): JsonResponse
    {
        $teacher = $this->teacherService->create($request->validated());

        return response()->json([
            'message' => 'Data guru berhasil ditambahkan.',
            'data' => new TeacherResource($teacher),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $teacher = $this->teacherService->getById($id);

        return response()->json([
            'data' => new TeacherResource($teacher),
        ]);
    }

    public function update(StoreTeacherRequest $request, int $id): JsonResponse
    {
        $teacher = $this->teacherService->update($id, $request->validated());

        return response()->json([
            'message' => 'Data guru berhasil diperbarui.',
            'data' => new TeacherResource($teacher),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->teacherService->delete($id);

        return response()->json([
            'message' => 'Data guru berhasil dihapus.',
        ]);
    }
}
