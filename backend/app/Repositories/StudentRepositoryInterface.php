<?php

namespace App\Repositories;

use App\Models\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StudentRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator;

    public function getById(int $id): Student;

    public function create(array $data): Student;

    public function update(int $id, array $data): Student;

    public function delete(int $id): bool;
}
