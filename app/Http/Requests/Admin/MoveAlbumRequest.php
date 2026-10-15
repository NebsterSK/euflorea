<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\MoveData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MoveAlbumRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'direction' => ['required', Rule::in(['up', 'down'])],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): MoveData
    {
        return MoveData::from($this->validated());
    }
}
