<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The photo chosen as an album cover.
 */
#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
class CoverData extends Data
{
    public function __construct(
        public int $photoId,
    ) {}
}
