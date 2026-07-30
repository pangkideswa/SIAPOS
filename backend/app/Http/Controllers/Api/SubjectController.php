<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Services\SubjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubjectController extends Controller
{
    public function __construct(
        private readonly SubjectService $subjectService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['search', 'is_active', 'per_page']);
        return SubjectResource::collection($this->subjectService->getAll($filters));
    }

    public function store(StoreSubjectRequest $request): JsonResponse
    {
        $subject = $this->subjectService->create($request->validated());

        return response()->json([
            'message' => 'Mata pelajaran berhasil dibuat.',
            'data' => new SubjectResource($subject),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $subject = $this->subjectService->getById($id);

        return response()->json([
            'data' => new SubjectResource($subject),
        ]);
    }

    public function update(StoreSubjectRequest $request, int $id): JsonResponse
    {
        $subject = $this->subjectService->update($id, $request->validated());

        return response()->json([
            'message' => 'Mata pelajaran berhasil diperbarui.',
            'data' => new SubjectResource($subject),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->subjectService->delete($id);

        return response()->json([
            'message' => 'Mata pelajaran berhasil dihapus.',
        ]);
    }
}
