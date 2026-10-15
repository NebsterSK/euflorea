<?php

namespace App\Data\Admin;

use App\Enums\GuestCount;
use App\Enums\Service;
use App\Models\Inquiry;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One contact form submission in the admin.
 */
#[TypeScript]
class InquiryData extends Data
{
    /**
     * @param  list<string>  $services
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $phone,
        public ?string $weddingDate,
        public bool $dateUnknown,
        public ?string $venue,
        public ?string $guests,
        public array $services,
        public string $message,
        public bool $isHandled,
        public string $createdAt,
    ) {}

    public static function fromInquiry(Inquiry $inquiry): self
    {
        return new self(
            id: $inquiry->id,
            name: $inquiry->name,
            email: $inquiry->email,
            phone: $inquiry->phone,
            weddingDate: $inquiry->wedding_date?->format('d.m.Y'),
            dateUnknown: $inquiry->date_unknown,
            venue: $inquiry->venue,
            guests: $inquiry->guests ? GuestCount::tryFrom($inquiry->guests)?->label() : null,
            services: array_values(array_filter(array_map(
                fn (string $service): ?string => Service::tryFrom($service)?->label(),
                $inquiry->services ?? [],
            ))),
            message: $inquiry->message,
            isHandled: $inquiry->handled_at !== null,
            createdAt: $inquiry->created_at->format('d.m.Y H:i'),
        );
    }
}
