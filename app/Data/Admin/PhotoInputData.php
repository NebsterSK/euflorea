<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Validated photo details from the admin.
 */
#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
class PhotoInputData extends Data
{
    public function __construct(
        public ?string $alt,
        public int $focalX,
        public int $focalY,
    ) {}
}
