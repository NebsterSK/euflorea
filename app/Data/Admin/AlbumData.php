<?php

namespace App\Data\Admin;

use App\Enums\AlbumType;
use App\Models\Album;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An album as edited in the admin form.
 */
#[TypeScript]
class AlbumData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public string $slug,
        public AlbumType $type,
        public ?string $weddingDate,
        public ?string $location,
        public ?string $description,
        public bool $isPublished,
        public bool $isHomepageCarousel,
        public ?int $coverPhotoId,
    ) {}

    public static function fromAlbum(Album $album): self
    {
        return new self(
            id: $album->id,
            title: $album->title,
            slug: $album->slug,
            type: $album->type,
            weddingDate: $album->wedding_date?->format('Y-m-d'),
            location: $album->location,
            description: $album->description,
            isPublished: $album->is_published,
            isHomepageCarousel: $album->is_homepage_carousel,
            coverPhotoId: $album->cover_photo_id,
        );
    }
}
