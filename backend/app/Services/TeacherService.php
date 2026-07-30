<?php

namespace App\Services;

use App\Models\Teacher;
use App\Repositories\TeacherRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TeacherService
{
    public function __construct(
        private readonly TeacherRepositoryInterface $teacherRepository
    ) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->teacherRepository->getAll($filters);
    }

    public function getById(int $id): Teacher
    {
        return $this->teacherRepository->getById($id);
    }

    public function create(array $data): Teacher
    {
        return $this->teacherRepository->create($data);
    }

    public function update(int $id, array $data): Teacher
    {
        return $this->teacherRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->teacherRepository->delete($id);
    }
}
