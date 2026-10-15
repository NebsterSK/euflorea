<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\IndexInquiriesData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexInquiriesRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'filter' => ['nullable', 'array'],
            'filter.search' => ['nullable', 'string', 'max:100'],
            'filter.status' => ['nullable', Rule::in(['open', 'handled'])],
            'sort' => ['nullable', Rule::in(['created_at', '-created_at', 'name', '-name', 'wedding_date', '-wedding_date'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): IndexInquiriesData
    {
        return IndexInquiriesData::from([
            'filter' => $this->validated('filter') ?? [],
            'sort' => $this->validated('sort'),
            'page' => (int) ($this->validated('page') ?? 1),
        ]);
    }
}
