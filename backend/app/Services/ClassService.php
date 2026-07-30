<?php

namespace App\Services;

use App\Models\ClassModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClassService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = ClassModel::with('homeroomTeacher');

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('major', 'like', "%{$search}%")
                    ->orWhere('grade_level', 'like', "%{$search}%");
            });
        }

        if (isset($filters['grade_level']) && $filters['grade_level']) {
            $query->where('grade_level', $filters['grade_level']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($filters['per_page'] ?? 15);
    }

    public function getById(int $id): ClassModel
    {
        return ClassModel::with('homeroomTeacher')->findOrFail($id);
    }

    public function create(array $data): ClassModel
    {
        return ClassModel::create($data);
    }

    public function update(int $id, array $data): ClassModel
    {
        $class = ClassModel::findOrFail($id);
        $class->update($data);
        return $class;
    }

    public function delete(int $id): bool
    {
        $class = ClassModel::findOrFail($id);
        return $class->delete();
    }
}
