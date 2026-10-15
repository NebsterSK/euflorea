<?php

namespace App\Http\Requests\Admin;

use App\Data\Admin\PhotoUploadData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:25600'],
        ];
    }

    /**
     * Get the validated data.
     */
    public function toData(): PhotoUploadData
    {
        return PhotoUploadData::from(['photo' => $this->file('photo')]);
    }
}
