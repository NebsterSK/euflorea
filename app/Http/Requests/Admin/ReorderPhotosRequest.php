<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\OrderData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReorderPhotosRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'distinct'],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): OrderData
    {
        return OrderData::from(['ids' => array_map('intval', $this->validated('ids'))]);
    }
}
