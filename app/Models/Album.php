<?php

namespace App\Models;

use App\Enums\AlbumType;
use Database\Factories\AlbumFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property AlbumType $type
 * @property \Carbon\CarbonImmutable|null $wedding_date
 * @property string|null $location
 * @property string|null $description
 * @property int|null $cover_photo_id
 * @property bool $is_published
 * @property bool $is_homepage_carousel
 * @property int $sort_order
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Photo|null $coverPhoto
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Photo> $photos
 * @property-read int|null $photos_count
 * @method static \Database\Factories\AlbumFactory factory($count = null, $state = [])
 * @method static Builder<static>|Album galleryOrder()
 * @method static Builder<static>|Album newModelQuery()
 * @method static Builder<static>|Album newQuery()
 * @method static Builder<static>|Album query()
 * @method static Builder<static>|Album visibleInGallery()
 * @method static Builder<static>|Album whereCoverPhotoId($value)
 * @method static Builder<static>|Album whereCreatedAt($value)
 * @method static Builder<static>|Album whereDescription($value)
 * @method static Builder<static>|Album whereId($value)
 * @method static Builder<static>|Album whereIsHomepageCarousel($value)
 * @method static Builder<static>|Album whereIsPublished($value)
 * @method static Builder<static>|Album whereLocation($value)
 * @method static Builder<static>|Album whereSlug($value)
 * @method static Builder<static>|Album whereSortOrder($value)
 * @method static Builder<static>|Album whereTitle($value)
 * @method static Builder<static>|Album whereType($value)
 * @method static Builder<static>|Album whereUpdatedAt($value)
 * @method static Builder<static>|Album whereWeddingDate($value)
 * @mixin \Eloquent
 */
#[Fillable([
    'title',
    'slug',
    'type',
    'wedding_date',
    'location',
    'description',
    'cover_photo_id',
    'is_published',
    'is_homepage_carousel',
    'sort_order',
])]
class Album extends Model
{
    /** @use HasFactory<AlbumFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => AlbumType::class,
            'wedding_date' => 'date',
            'is_published' => 'boolean',
            'is_homepage_carousel' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * The album's photos in their display order.
     *
     * @return HasMany<Photo, $this>
     */
    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('sort_order')->orderBy('id');
    }

    /**
     * The photo shown on the album card.
     *
     * @return BelongsTo<Photo, $this>
     */
    public function coverPhoto(): BelongsTo
    {
        return $this->belongsTo(Photo::class, 'cover_photo_id');
    }

    /**
     * Albums listed in the public gallery: published, never the homepage carousel.
     */
    #[Scope]
    protected function visibleInGallery(Builder $query): void
    {
        $query->where('is_published', true)->where('is_homepage_carousel', false);
    }

    /**
     * The public gallery order.
     */
    #[Scope]
    protected function galleryOrder(Builder $query): void
    {
        $query->orderBy('sort_order')->orderByDesc('wedding_date')->orderByDesc('id');
    }

    /**
     * The cover shown on cards: the chosen cover if ready, else the first ready
     * photo. Needs `coverPhoto.media` and `photos.media` loaded.
     */
    public function displayCover(): ?Photo
    {
        if ($this->coverPhoto?->isReady()) {
            return $this->coverPhoto;
        }

        return $this->photos->first(fn (Photo $photo): bool => $photo->isReady());
    }

    /**
     * The small meta line under titles, e.g. "jún 2025 · Bratislava".
     */
    public function metaLine(): ?string
    {
        $parts = array_filter([
            $this->wedding_date?->locale('sk')->isoFormat('MMMM YYYY'),
            $this->location,
        ]);

        return $parts === [] ? null : implode(' · ', $parts);
    }

    /**
     * Make this album the only homepage carousel album.
     */
    public function makeHomepageCarousel(): void
    {
        DB::transaction(function (): void {
            static::query()->whereKeyNot($this->getKey())->update(['is_homepage_carousel' => false]);

            $this->forceFill(['is_homepage_carousel' => true])->save();
        });
    }
}
