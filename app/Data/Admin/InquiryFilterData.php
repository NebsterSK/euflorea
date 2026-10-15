<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Inquiry list filters.
 */
#[TypeScript]
class InquiryFilterData extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?string $status = null,
    ) {}
}
