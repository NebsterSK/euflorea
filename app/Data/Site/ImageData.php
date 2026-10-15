<?php

namespace App\Data\Site;

use App\Models\Photo;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A responsive WebP image ready for `<img src srcset>`, with its focal point.
 */
#[TypeScript]
class ImageData extends Data
{
    public function __construct(
        public int $id,
        public string $src,
        public string $srcset,
        public int $width,
        public int $height,
        public string $alt,
        public int $focalX,
        public int $focalY,
    ) {}

    /**
     * Build from a photo whose `web` conversion exists (load `media` first).
     */
    public static function fromPhoto(Photo $photo): self
    {
        $media = $photo->image();

        return new self(
            id: $photo->id,
            src: $media?->getUrl('web') ?? '',
            srcset: $media?->getSrcset('web') ?? '',
            width: $photo->width,
            height: $photo->height,
            alt: $photo->alt ?? '',
            focalX: $photo->focal_x,
            focalY: $photo->focal_y,
        );
    }
}
