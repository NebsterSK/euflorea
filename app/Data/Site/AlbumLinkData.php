<?php

namespace App\Data\Site;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A link to another album (the "Ďalšia svadba" link).
 */
#[TypeScript]
class AlbumLinkData extends Data
{
    public function __construct(
        public string $title,
        public string $slug,
    ) {}
}
