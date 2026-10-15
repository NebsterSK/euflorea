<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\AlbumInputData;
use App\Enums\AlbumType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreAlbumRequest extends FormRequest
{
    /**
     * Derive the slug from the title when it is left empty.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input('title'))),
            'is_published' => $this->boolean('is_published'),
            'is_homepage_carousel' => $this->boolean('is_homepage_carousel'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:160', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('albums', 'slug')->ignore($this->route('album'))],
            'type' => ['required', Rule::enum(AlbumType::class)],
            'wedding_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_published' => ['boolean'],
            'is_homepage_carousel' => ['boolean'],
            'cover_photo_id' => ['nullable', 'integer', Rule::exists('photos', 'id')->where('album_id', $this->route('album')?->id ?? 0)],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): AlbumInputData
    {
        return AlbumInputData::from($this->validated());
    }
}
