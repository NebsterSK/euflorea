<?php

namespace App\Http\Requests\Site;

use App\Data\Site\InquiryInputData;
use App\Enums\GuestCount;
use App\Enums\Service;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactRequest extends FormRequest
{
    /**
     * Normalise checkboxes before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'date_unknown' => $this->boolean('date_unknown'),
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
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'max:255', app()->isProduction() ? 'email:rfc,dns' : 'email:rfc'],
            'phone' => ['nullable', 'string', 'max:30'],
            'date_unknown' => ['boolean'],
            'wedding_date' => ['nullable', 'required_unless:date_unknown,true', 'date', 'after_or_equal:today'],
            'venue' => ['nullable', 'string', 'max:160'],
            'guests' => ['nullable', Rule::enum(GuestCount::class)],
            'services' => ['nullable', 'array'],
            'services.*' => [Rule::enum(Service::class)],
            'message' => ['required', 'string', 'max:3000'],
            'consent' => ['accepted'],
            'fax_number_confirm' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Messages that read better than the generic ones.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'wedding_date.required_unless' => 'Vyberte dátum svadby alebo zaškrtnite, že ho ešte neviete.',
            'wedding_date.after_or_equal' => 'Dátum svadby nemôže byť v minulosti.',
            'consent.accepted' => 'Bez súhlasu so spracovaním osobných údajov vám nemôžeme odpovedať.',
        ];
    }

    /**
     * Get the validated inquiry data. A filled honeypot marks the request as spam.
     */
    public function toData(): InquiryInputData
    {
        $validated = $this->validated();

        return InquiryInputData::from([
            ...$validated,
            'wedding_date' => $validated['date_unknown'] ? null : ($validated['wedding_date'] ?? null),
            'services' => array_values(array_unique($validated['services'] ?? [])),
            'is_spam' => filled($validated['fax_number_confirm'] ?? null),
            'ip' => $this->ip(),
            'user_agent' => substr((string) $this->userAgent(), 0, 255),
        ]);
    }
}
