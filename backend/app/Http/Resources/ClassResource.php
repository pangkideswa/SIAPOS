<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'major' => $this->major,
            'grade_level' => $this->grade_level,
            'homeroom_teacher_id' => $this->homeroom_teacher_id,
            'homeroom_teacher' => new UserResource($this->whenLoaded('homeroomTeacher')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
