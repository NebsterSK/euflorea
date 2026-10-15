<?php

namespace App\Data\Site;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Validated contact form input.
 */
#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
class InquiryInputData extends Data
{
    /**
     * @param  list<string>  $services
     */
    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone,
        public ?string $weddingDate,
        public bool $dateUnknown,
        public ?string $venue,
        public ?string $guests,
        public array $services,
        public string $message,
        public bool $isSpam,
        public ?string $ip,
        public ?string $userAgent,
    ) {}
}
