<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\PhotoInputData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePhotoRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'alt' => ['nullable', 'string', 'max:255'],
            'focal_x' => ['required', 'integer', 'between:0,100'],
            'focal_y' => ['required', 'integer', 'between:0,100'],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): PhotoInputData
    {
        return PhotoInputData::from($this->validated());
    }
}
