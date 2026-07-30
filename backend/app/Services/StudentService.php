<?php

namespace App\Services;

use App\Models\Student;
use App\Repositories\StudentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StudentService
{
    public function __construct(
        private readonly StudentRepositoryInterface $studentRepository
    ) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->studentRepository->getAll($filters);
    }

    public function getById(int $id): Student
    {
        return $this->studentRepository->getById($id);
    }

    public function create(array $data): Student
    {
        return $this->studentRepository->create($data);
    }

    public function update(int $id, array $data): Student
    {
        return $this->studentRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->studentRepository->delete($id);
    }
}
