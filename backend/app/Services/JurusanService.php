<?php

namespace App\Services;

use App\Models\Jurusan;
use App\Repositories\JurusanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class JurusanService
{
    public function __construct(
        private readonly JurusanRepositoryInterface $jurusanRepository
    ) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->jurusanRepository->getAll($filters);
    }

    public function getActive(): Collection
    {
        return $this->jurusanRepository->getActive();
    }

    public function getById(int $id): Jurusan
    {
        return $this->jurusanRepository->getById($id);
    }

    public function create(array $data): Jurusan
    {
        return $this->jurusanRepository->create($data);
    }

    public function update(int $id, array $data): Jurusan
    {
        return $this->jurusanRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->jurusanRepository->delete($id);
    }
}
