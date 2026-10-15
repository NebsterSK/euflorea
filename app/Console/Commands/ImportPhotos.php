<?php

namespace App\Console\Commands;

use App\Actions\Albums\AddPhotoToAlbum;
use App\Enums\AlbumType;
use App\Models\Album;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Throwable;

/**
 * One-time import of the initial albums and the homepage carousel from a
 * folder of photos, described by `database/data/initial-albums.json`.
 * Idempotent: albums whose slug already exists are skipped.
 */
#[Signature('photos:import {path : Folder with uvod/, svadby/… and editorials/…} {--manifest= : Alternative manifest JSON}')]
#[Description('Import the initial albums and homepage carousel through the media pipeline')]
class ImportPhotos extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(AddPhotoToAlbum $addPhoto): int
    {
        $root = rtrim((string) $this->argument('path'), '/');
        $manifestPath = $this->option('manifest') ?: database_path('data/initial-albums.json');

        if (! is_dir($root)) {
            $this->error("Folder not found: {$root}");

            return self::FAILURE;
        }

        /** @var array{carousel: array{title: string, slug: string, folder: string, photos: list<array{file: string, alt: string, focal_x: int, focal_y: int}>}, albums: list<array{title: string, slug: string, type: string, folder: string, description?: string}>} $manifest */
        $manifest = json_decode(File::get($manifestPath), true, flags: JSON_THROW_ON_ERROR);

        $nextSortOrder = (int) Album::query()->max('sort_order') + 1;

        foreach ($manifest['albums'] as $definition) {
            $files = $this->imagesIn("{$root}/{$definition['folder']}");

            $this->importAlbum($addPhoto, [
                'title' => $definition['title'],
                'slug' => $definition['slug'],
                'type' => AlbumType::from($definition['type']),
                'description' => $definition['description'] ?? null,
                'is_published' => true,
                'sort_order' => $nextSortOrder++,
            ], array_map(fn (string $file): array => [
                'path' => $file,
                'alt' => null,
            ], $files));
        }

        $carousel = $manifest['carousel'];
        $carouselAlbum = $this->importAlbum($addPhoto, [
            'title' => $carousel['title'],
            'slug' => $carousel['slug'],
            'type' => AlbumType::Wedding,
            'is_published' => false,
            'sort_order' => 0,
        ], array_map(fn (array $photo): array => [
            'path' => "{$root}/{$carousel['folder']}/{$photo['file']}",
            'alt' => $photo['alt'],
            'focal_x' => $photo['focal_x'],
            'focal_y' => $photo['focal_y'],
        ], $carousel['photos']));

        $carouselAlbum?->makeHomepageCarousel();

        $this->info('Import finished.');

        return self::SUCCESS;
    }

    /**
     * Create the album and add its photos, unless the slug already exists.
     *
     * @param  array<string, mixed>  $attributes
     * @param  list<array{path: string, alt: ?string, focal_x?: int, focal_y?: int}>  $photos
     */
    protected function importAlbum(AddPhotoToAlbum $addPhoto, array $attributes, array $photos): ?Album
    {
        if (Album::query()->where('slug', $attributes['slug'])->exists()) {
            $this->line("Skipped <comment>{$attributes['title']}</comment>: already imported.");

            return null;
        }

        $album = Album::query()->create($attributes);
        $this->line("Importing <info>{$album->title}</info> ({$this->countLabel($photos)})");

        foreach ($photos as $position => $source) {
            if (! is_file($source['path'])) {
                $this->warn("  missing {$source['path']}");

                continue;
            }

            try {
                $photo = $addPhoto->handle($album, $source['path'], basename($source['path']), $source['alt']);
                $photo->update([
                    'alt' => $source['alt'] ?? $this->defaultAlt($album, $position + 1, count($photos)),
                    'focal_x' => $source['focal_x'] ?? 50,
                    'focal_y' => $source['focal_y'] ?? 50,
                ]);

                if ($album->cover_photo_id === null) {
                    $album->update(['cover_photo_id' => $photo->id]);
                }

                $this->line('  '.basename($source['path']));
            } catch (Throwable $exception) {
                $this->error('  failed '.basename($source['path']).': '.$exception->getMessage());
            }
        }

        return $album;
    }

    /**
     * Image files of a folder in natural order (1, 2, … 10).
     *
     * @return list<string>
     */
    protected function imagesIn(string $folder): array
    {
        if (! is_dir($folder)) {
            $this->warn("Folder not found: {$folder}");

            return [];
        }

        $files = array_values(array_filter(
            File::files($folder),
            fn ($file): bool => in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'webp'], true),
        ));

        $paths = array_map(fn ($file): string => $file->getPathname(), $files);
        natsort($paths);

        return array_values($paths);
    }

    /**
     * Fallback alt text until the studio writes a real description.
     */
    protected function defaultAlt(Album $album, int $number, int $total): string
    {
        $prefix = $album->type === AlbumType::Wedding ? 'Svadba' : 'Editorial';

        return "{$prefix} {$album->title}, fotka {$number} z {$total}";
    }

    /**
     * @param  list<mixed>  $photos
     */
    protected function countLabel(array $photos): string
    {
        return count($photos).' '.(count($photos) === 1 ? 'photo' : 'photos');
    }
}
