<?php

namespace App\Repositories;

use App\Models\Jurusan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface JurusanRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator;

    public function getActive(): \Illuminate\Support\Collection;

    public function getById(int $id): Jurusan;

    public function create(array $data): Jurusan;

    public function update(int $id, array $data): Jurusan;

    public function delete(int $id): bool;
}
