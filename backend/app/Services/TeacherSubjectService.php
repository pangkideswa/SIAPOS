<?php

namespace App\Services;

use App\Models\TeacherSubject;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use InvalidArgumentException;

class TeacherSubjectService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = TeacherSubject::with(['teacher', 'subject', 'class']);

        if (isset($filters['teacher_id']) && $filters['teacher_id']) {
            $query->where('teacher_id', $filters['teacher_id']);
        }

        if (isset($filters['subject_id']) && $filters['subject_id']) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if (isset($filters['class_id']) && $filters['class_id']) {
            $query->where('class_id', $filters['class_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): TeacherSubject
    {
        try {
            return TeacherSubject::create($data);
        } catch (QueryException $e) {
            if (str_contains($e->getMessage(), 'Duplicate entry')) {
                throw new InvalidArgumentException('Penugasan guru untuk mata pelajaran dan kelas ini sudah ada.');
            }
            throw $e;
        }
    }

    public function delete(int $id): bool
    {
        $teacherSubject = TeacherSubject::findOrFail($id);
        return $teacherSubject->delete();
    }
}
