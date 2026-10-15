<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\CoverData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCoverRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo_id' => ['required', 'integer', Rule::exists('photos', 'id')->where('album_id', $this->route('album')?->id ?? 0)],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): CoverData
    {
        return CoverData::from($this->validated());
    }
}
