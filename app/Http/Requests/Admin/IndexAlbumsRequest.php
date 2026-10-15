<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\IndexAlbumsData;
use App\Enums\AlbumType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexAlbumsRequest extends FormRequest
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
            'filter.type' => ['nullable', Rule::enum(AlbumType::class)],
            'sort' => ['nullable', Rule::in(['sort_order', 'title', '-title', 'wedding_date', '-wedding_date', 'created_at', '-created_at'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): IndexAlbumsData
    {
        return IndexAlbumsData::from([
            'filter' => $this->validated('filter') ?? [],
            'sort' => $this->validated('sort'),
            'page' => (int) ($this->validated('page') ?? 1),
        ]);
    }
}
