<?php

namespace App\Repositories\Eloquent;

use App\Models\Jurusan;
use App\Repositories\JurusanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class JurusanRepository implements JurusanRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Jurusan::query();

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== null) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function getActive(): Collection
    {
        return Jurusan::where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function getById(int $id): Jurusan
    {
        return Jurusan::findOrFail($id);
    }

    public function create(array $data): Jurusan
    {
        return Jurusan::create($data);
    }

    public function update(int $id, array $data): Jurusan
    {
        $jurusan = Jurusan::findOrFail($id);
        $jurusan->update($data);
        return $jurusan;
    }

    public function delete(int $id): bool
    {
        $jurusan = Jurusan::findOrFail($id);
        return $jurusan->delete();
    }
}
