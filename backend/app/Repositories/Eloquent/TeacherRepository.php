<?php

namespace App\Repositories\Eloquent;

use App\Models\Teacher;
use App\Repositories\TeacherRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TeacherRepository implements TeacherRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Teacher::query();

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%")
                    ->orWhere('nuptk', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        if (isset($filters['jenis_kelamin']) && $filters['jenis_kelamin']) {
            $query->where('jenis_kelamin', $filters['jenis_kelamin']);
        }

        if (isset($filters['status_kepegawaian']) && $filters['status_kepegawaian']) {
            $query->where('status_kepegawaian', $filters['status_kepegawaian']);
        }

        if (isset($filters['pendidikan_terakhir']) && $filters['pendidikan_terakhir']) {
            $query->where('pendidikan_terakhir', $filters['pendidikan_terakhir']);
        }

        return $query->orderBy('nama_lengkap')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function getById(int $id): Teacher
    {
        return Teacher::findOrFail($id);
    }

    public function create(array $data): Teacher
    {
        return Teacher::create($data);
    }

    public function update(int $id, array $data): Teacher
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->update($data);
        return $teacher;
    }

    public function delete(int $id): bool
    {
        $teacher = Teacher::findOrFail($id);
        return $teacher->delete();
    }
}
