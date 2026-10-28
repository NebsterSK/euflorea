<?php

namespace App\Actions\Albums;

use App\Models\Album;
use App\Models\Photo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Imagick;
use RuntimeException;

/**
 * The single entry point for new photos (admin uploads and the initial
 * import). It cleans the source before anything is stored: applies EXIF
 * orientation, converts to sRGB, strips metadata (GPS) while keeping the
 * colour profile, caps the long edge and saves a high-quality JPEG. The media
 * library then keeps that as the private original and builds the WebP variants.
 */
class AddPhotoToAlbum
{
    /**
     * Longest edge kept for the stored original.
     */
    public const int MaxEdge = 3000;

    /**
     * Largest accepted source, guarding against decompression bombs.
     */
    public const int MaxSourcePixels = 100_000_000;

    public const int MaxSourceEdge = 20_000;

    /**
     * Add the image at `$sourcePath` to the album as its last photo.
     */
    public function handle(Album $album, string $sourcePath, string $originalName, ?string $alt = null): Photo
    {
        $cleanPath = $this->cleanImage($sourcePath);

        try {
            return DB::transaction(function () use ($album, $cleanPath, $originalName, $alt): Photo {
                [$width, $height] = getimagesize($cleanPath) ?: [0, 0];

                $photo = $album->photos()->create([
                    'original_name' => Str::limit($originalName, 250, ''),
                    'width' => $width,
                    'height' => $height,
                    'alt' => $alt,
                    'sort_order' => (int) Photo::query()->where('album_id', $album->id)->max('sort_order') + 1,
                ]);

                $photo->addMedia($cleanPath)
                    ->usingFileName(Str::slug($album->slug.'-'.$photo->id).'.jpg')
                    ->toMediaCollection(Photo::Collection);

                return $photo;
            });
        } finally {
            if (is_file($cleanPath)) {
                unlink($cleanPath);
            }
        }
    }

    /**
     * Write a cleaned JPEG copy of the source to a temporary file.
     */
    protected function cleanImage(string $sourcePath): string
    {
        $this->assertReasonableGeometry($sourcePath);

        $image = new Imagick($sourcePath);
        $image->setIteratorIndex(0);
        $image->autoOrient();

        $iccProfile = $image->getImageProfiles('icc', true)['icc'] ?? null;
        $image->stripImage();

        if ($iccProfile !== null) {
            $image->profileImage('icc', $iccProfile);
        }

        $image->transformImageColorspace(Imagick::COLORSPACE_SRGB);

        if (max($image->getImageWidth(), $image->getImageHeight()) > self::MaxEdge) {
            $image->resizeImage(self::MaxEdge, self::MaxEdge, Imagick::FILTER_LANCZOS, 1, true);
        }

        $image->setImageFormat('jpeg');
        $image->setImageCompressionQuality(95);
        $image->setOption('jpeg:sampling-factor', '4:4:4');

        $cleanPath = tempnam(sys_get_temp_dir(), 'photo-');

        if ($cleanPath === false || ! $image->writeImage('jpeg:'.$cleanPath)) {
            if ($cleanPath !== false && is_file($cleanPath)) {
                unlink($cleanPath);
            }

            throw new RuntimeException('Could not write the cleaned image.');
        }

        $image->clear();

        return $cleanPath;
    }

    /**
     * Read only the image header and reject absurd dimensions before decoding.
     */
    protected function assertReasonableGeometry(string $sourcePath): void
    {
        $probe = new Imagick;
        $probe->pingImage($sourcePath);
        $width = $probe->getImageWidth();
        $height = $probe->getImageHeight();
        $probe->clear();

        if (max($width, $height) > self::MaxSourceEdge || $width * $height > self::MaxSourcePixels) {
            throw new RuntimeException('The image dimensions are too large.');
        }
    }
}
