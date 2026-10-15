<?php

namespace App\Data\Site;

use App\Enums\AlbumType;
use App\Models\Album;
use App\Models\Photo;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One album page: header and its ready photos.
 */
#[TypeScript]
class AlbumPageData extends Data
{
    /**
     * @param  list<ImageData>  $photos
     */
    public function __construct(
        public string $title,
        public string $slug,
        public AlbumType $type,
        public string $typeLabel,
        public ?string $meta,
        public ?string $description,
        public array $photos,
    ) {}

    /**
     * Build from an album with `photos.media` loaded.
     */
    public static function fromAlbum(Album $album): self
    {
        return new self(
            title: $album->title,
            slug: $album->slug,
            type: $album->type,
            typeLabel: $album->type->label(),
            meta: $album->metaLine(),
            description: $album->description,
            photos: $album->photos
                ->filter(fn (Photo $photo): bool => $photo->isReady())
                ->map(fn (Photo $photo): ImageData => ImageData::fromPhoto($photo))
                ->values()
                ->all(),
        );
    }
}
