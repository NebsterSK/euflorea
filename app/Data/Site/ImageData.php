<?php

namespace App\Data\Site;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A responsive WebP image ready for `<img src srcset>`, with its focal point.
 */
#[TypeScript]
class ImageData extends Data
{
    public function __construct(
        public string $src,
        public string $srcset,
        public int $width,
        public int $height,
        public string $alt,
        public int $focalX,
        public int $focalY,
    ) {}
}
