<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Album list query: filters, sort and page.
 */
#[TypeScript]
class IndexAlbumsData extends Data
{
    public function __construct(
        public AlbumFilterData $filter,
        public ?string $sort,
        public int $page = 1,
    ) {}
}
