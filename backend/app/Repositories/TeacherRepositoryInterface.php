<?php

namespace App\Repositories;

use App\Models\Teacher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TeacherRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator;

    public function getById(int $id): Teacher;

    public function create(array $data): Teacher;

    public function update(int $id, array $data): Teacher;

    public function delete(int $id): bool;
}
