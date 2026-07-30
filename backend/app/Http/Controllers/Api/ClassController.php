<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClassRequest;
use App\Http\Resources\ClassResource;
use App\Services\ClassService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClassController extends Controller
{
    public function __construct(
        private readonly ClassService $classService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['search', 'grade_level', 'per_page']);
        return ClassResource::collection($this->classService->getAll($filters));
    }

    public function store(StoreClassRequest $request): JsonResponse
    {
        $class = $this->classService->create($request->validated());

        return response()->json([
            'message' => 'Kelas berhasil dibuat.',
            'data' => new ClassResource($class->load('homeroomTeacher')),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $class = $this->classService->getById($id);

        return response()->json([
            'data' => new ClassResource($class),
        ]);
    }

    public function update(StoreClassRequest $request, int $id): JsonResponse
    {
        $class = $this->classService->update($id, $request->validated());

        return response()->json([
            'message' => 'Kelas berhasil diperbarui.',
            'data' => new ClassResource($class->load('homeroomTeacher')),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->classService->delete($id);

        return response()->json([
            'message' => 'Kelas berhasil dihapus.',
        ]);
    }
}
