<?php

namespace App\Data\Site;

use App\Enums\AlbumType;
use App\Models\Album;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An album as a card in the public gallery.
 */
#[TypeScript]
class AlbumCardData extends Data
{
    public function __construct(
        public string $title,
        public string $slug,
        public AlbumType $type,
        public string $typeLabel,
        public ?string $meta,
        public ?ImageData $cover,
    ) {}

    /**
     * Build from an album with `coverPhoto.media` and `photos.media` loaded.
     */
    public static function fromAlbum(Album $album): self
    {
        $cover = $album->displayCover();

        return new self(
            title: $album->title,
            slug: $album->slug,
            type: $album->type,
            typeLabel: $album->type->label(),
            meta: $album->metaLine(),
            cover: $cover ? ImageData::fromPhoto($cover) : null,
        );
    }
}
