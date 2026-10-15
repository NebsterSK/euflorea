<?php

namespace App\Data\Admin;

use App\Enums\AlbumType;
use App\Models\Album;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of the admin album list.
 */
#[TypeScript]
class AlbumRowData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public string $slug,
        public AlbumType $type,
        public string $typeLabel,
        public ?string $weddingDate,
        public ?string $location,
        public bool $isPublished,
        public bool $isHomepageCarousel,
        public int $photosCount,
        public ?string $coverThumb,
    ) {}

    /**
     * Build from an album with `photos_count` and `coverPhoto.media` + `photos.media` loaded.
     */
    public static function fromAlbum(Album $album): self
    {
        return new self(
            id: $album->id,
            title: $album->title,
            slug: $album->slug,
            type: $album->type,
            typeLabel: $album->type->label(),
            weddingDate: $album->wedding_date?->format('d.m.Y'),
            location: $album->location,
            isPublished: $album->is_published,
            isHomepageCarousel: $album->is_homepage_carousel,
            photosCount: (int) $album->photos_count,
            coverThumb: $album->displayCover()?->image()?->getUrl('thumb'),
        );
    }
}
