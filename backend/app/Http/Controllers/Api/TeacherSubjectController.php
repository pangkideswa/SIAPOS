<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherSubjectRequest;
use App\Http\Resources\TeacherSubjectResource;
use App\Services\TeacherSubjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class TeacherSubjectController extends Controller
{
    public function __construct(
        private readonly TeacherSubjectService $teacherSubjectService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['teacher_id', 'subject_id', 'class_id', 'per_page']);
        return TeacherSubjectResource::collection($this->teacherSubjectService->getAll($filters));
    }

    public function store(StoreTeacherSubjectRequest $request): JsonResponse
    {
        try {
            $teacherSubject = $this->teacherSubjectService->create($request->validated());
        } catch (\InvalidArgumentException $e) {
            throw ValidationException::withMessages([
                'teacher_id' => [$e->getMessage()],
            ]);
        }

        return response()->json([
            'message' => 'Penugasan guru berhasil dibuat.',
            'data' => new TeacherSubjectResource(
                $teacherSubject->load(['teacher', 'subject', 'class'])
            ),
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->teacherSubjectService->delete($id);

        return response()->json([
            'message' => 'Penugasan guru berhasil dihapus.',
        ]);
    }
}
