<?php

namespace App\Repositories\Eloquent;

use App\Models\Student;
use App\Repositories\StudentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StudentRepository implements StudentRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Student::with('jurusan');

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('kelas', 'like', "%{$search}%");
            });
        }

        if (isset($filters['jurusan_id']) && $filters['jurusan_id']) {
            $query->where('jurusan_id', $filters['jurusan_id']);
        }

        if (isset($filters['kelas']) && $filters['kelas']) {
            $query->where('kelas', $filters['kelas']);
        }

        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('nama_lengkap')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function getById(int $id): Student
    {
        return Student::with('jurusan')->findOrFail($id);
    }

    public function create(array $data): Student
    {
        return Student::create($data);
    }

    public function update(int $id, array $data): Student
    {
        $student = Student::findOrFail($id);
        $student->update($data);
        return $student;
    }

    public function delete(int $id): bool
    {
        $student = Student::findOrFail($id);
        return $student->delete();
    }
}
