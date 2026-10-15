<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\ToggleData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ToggleRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'value' => ['required', 'boolean'],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): ToggleData
    {
        return ToggleData::from(['value' => $this->boolean('value')]);
    }
}
