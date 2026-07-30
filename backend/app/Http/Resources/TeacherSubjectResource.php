<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherSubjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'teacher_id' => $this->teacher_id,
            'subject_id' => $this->subject_id,
            'class_id' => $this->class_id,
            'teacher' => new UserResource($this->whenLoaded('teacher')),
            'subject' => new SubjectResource($this->whenLoaded('subject')),
            'class' => new ClassResource($this->whenLoaded('class')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
