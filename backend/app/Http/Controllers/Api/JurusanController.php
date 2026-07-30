<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJurusanRequest;
use App\Http\Resources\JurusanResource;
use App\Services\JurusanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JurusanController extends Controller
{
    public function __construct(
        private readonly JurusanService $jurusanService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['search', 'is_active', 'per_page']);
        return JurusanResource::collection($this->jurusanService->getAll($filters));
    }

    public function active(): JsonResponse
    {
        $jurusans = $this->jurusanService->getActive();

        return response()->json([
            'data' => JurusanResource::collection($jurusans),
        ]);
    }

    public function store(StoreJurusanRequest $request): JsonResponse
    {
        $jurusan = $this->jurusanService->create($request->validated());

        return response()->json([
            'message' => 'Jurusan berhasil dibuat.',
            'data' => new JurusanResource($jurusan),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $jurusan = $this->jurusanService->getById($id);

        return response()->json([
            'data' => new JurusanResource($jurusan),
        ]);
    }

    public function update(StoreJurusanRequest $request, int $id): JsonResponse
    {
        $jurusan = $this->jurusanService->update($id, $request->validated());

        return response()->json([
            'message' => 'Jurusan berhasil diperbarui.',
            'data' => new JurusanResource($jurusan),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->jurusanService->delete($id);

        return response()->json([
            'message' => 'Jurusan berhasil dihapus.',
        ]);
    }
}
