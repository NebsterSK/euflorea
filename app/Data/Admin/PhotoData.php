<?php

namespace App\Data\Admin;

use App\Models\Photo;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A photo tile in the admin album editor.
 */
#[TypeScript]
class PhotoData extends Data
{
    public function __construct(
        public int $id,
        public ?string $thumb,
        public ?string $alt,
        public int $focalX,
        public int $focalY,
        public int $width,
        public int $height,
        public bool $isReady,
        public ?string $originalName,
    ) {}

    /**
     * Build from a photo with `media` loaded.
     */
    public static function fromPhoto(Photo $photo): self
    {
        $media = $photo->image();

        return new self(
            id: $photo->id,
            thumb: $media?->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : null,
            alt: $photo->alt,
            focalX: $photo->focal_x,
            focalY: $photo->focal_y,
            width: $photo->width,
            height: $photo->height,
            isReady: $photo->isReady(),
            originalName: $photo->original_name,
        );
    }
}
