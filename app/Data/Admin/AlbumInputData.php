<?php

namespace App\Data\Admin;

use App\Enums\AlbumType;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Validated album form input.
 */
#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
class AlbumInputData extends Data
{
    public function __construct(
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

    /**
     * Attributes for `Album::fill()`; the carousel flag is applied separately.
     *
     * @return array<string, mixed>
     */
    public function toAttributes(): array
    {
        return [
            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,
            'wedding_date' => $this->weddingDate,
            'location' => $this->location,
            'description' => $this->description,
            'is_published' => $this->isPublished,
            'cover_photo_id' => $this->coverPhotoId,
        ];
    }
}
