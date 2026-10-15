<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Inquiry list query: filters, sort and page.
 */
#[TypeScript]
class IndexInquiriesData extends Data
{
    public function __construct(
        public InquiryFilterData $filter,
        public ?string $sort,
        public int $page = 1,
    ) {}
}
