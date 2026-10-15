<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Album list filters.
 */
#[TypeScript]
class AlbumFilterData extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?string $type = null,
    ) {}
}
