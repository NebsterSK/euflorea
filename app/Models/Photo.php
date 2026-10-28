<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\PhotoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property int $album_id
 * @property string|null $original_name
 * @property int $width
 * @property int $height
 * @property string|null $alt
 * @property int $focal_x
 * @property int $focal_y
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Album $album
 * @property-read MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 *
 * @method static \Database\Factories\PhotoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereAlbumId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereAlt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereFocalX($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereFocalY($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereOriginalName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Photo whereWidth($value)
 *
 * @mixin \Eloquent
 */
#[Fillable([
    'album_id',
    'original_name',
    'width',
    'height',
    'alt',
    'focal_x',
    'focal_y',
    'sort_order',
])]
class Photo extends Model implements HasMedia
{
    /** @use HasFactory<PhotoFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * The media collection holding the (cleaned) original.
     */
    public const string Collection = 'image';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'width' => 'integer',
            'height' => 'integer',
            'focal_x' => 'integer',
            'focal_y' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Album, $this>
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * The original lives on the private `originals` disk; only WebP
     * conversions are public.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::Collection)
            ->singleFile()
            ->useDisk('originals')
            ->storeConversionsOnDisk('public');
    }

    /**
     * `web`: responsive WebP variants for the site. `thumb`: small WebP for the admin.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('web')
            ->performOnCollections(self::Collection)
            ->withResponsiveImages()
            ->nonOptimized()
            ->fit(Fit::Max, 2400, 2400)
            ->format('webp')
            ->quality(90);

        $this->addMediaConversion('thumb')
            ->performOnCollections(self::Collection)
            ->nonOptimized()
            ->fit(Fit::Max, 640, 640)
            ->format('webp')
            ->quality(78);
    }

    /**
     * The original media item, if one was attached.
     */
    public function image(): ?Media
    {
        return $this->getFirstMedia(self::Collection);
    }

    /**
     * Whether the public WebP variants exist yet (conversions run on the queue).
     */
    public function isReady(): bool
    {
        return (bool) $this->image()?->hasGeneratedConversion('web');
    }
}
