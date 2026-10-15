<?php

use App\Models\Album;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('originals');
    Storage::fake('public');
});

/**
 * Build a small photo folder and manifest in a temporary directory.
 */
function photoImportFixture(): array
{
    $root = sys_get_temp_dir().'/photo-import-'.uniqid();

    foreach (['uvod/1.jpg', 'svadby/anna_a_jakub/2.jpg', 'svadby/anna_a_jakub/10.jpg'] as $path) {
        File::ensureDirectoryExists(dirname("{$root}/{$path}"));
        $image = UploadedFile::fake()->image(basename($path), 300, 400);
        File::copy($image->getRealPath(), "{$root}/{$path}");
    }

    $manifest = "{$root}/manifest.json";
    File::put($manifest, json_encode([
        'carousel' => [
            'title' => 'Úvodná stránka',
            'slug' => 'uvodna-stranka',
            'folder' => 'uvod',
            'photos' => [['file' => '1.jpg', 'alt' => 'Obrad pod holým nebom', 'focal_x' => 50, 'focal_y' => 40]],
        ],
        'albums' => [
            ['title' => 'Anna a Jakub', 'slug' => 'anna-a-jakub', 'type' => 'wedding', 'folder' => 'svadby/anna_a_jakub'],
        ],
    ]));

    return [$root, $manifest];
}

test('the import creates published albums in natural file order and the carousel album', function () {
    [$root, $manifest] = photoImportFixture();

    $this->artisan('photos:import', ['path' => $root, '--manifest' => $manifest])->assertSuccessful();

    $album = Album::query()->where('slug', 'anna-a-jakub')->with('photos')->sole();
    $carousel = Album::query()->where('slug', 'uvodna-stranka')->with('photos')->sole();

    expect($album->is_published)->toBeTrue()
        ->and($album->photos->pluck('original_name')->all())->toBe(['2.jpg', '10.jpg'])
        ->and($album->cover_photo_id)->toBe($album->photos->first()->id)
        ->and($carousel->is_homepage_carousel)->toBeTrue()
        ->and($carousel->photos->first()->alt)->toBe('Obrad pod holým nebom')
        ->and($carousel->photos->first()->focal_y)->toBe(40);

    File::deleteDirectory($root);
});

test('running the import twice skips albums that already exist', function () {
    [$root, $manifest] = photoImportFixture();

    $this->artisan('photos:import', ['path' => $root, '--manifest' => $manifest])->assertSuccessful();
    $this->artisan('photos:import', ['path' => $root, '--manifest' => $manifest])->assertSuccessful();

    expect(Album::query()->count())->toBe(2)
        ->and(Album::query()->where('slug', 'anna-a-jakub')->sole()->photos()->count())->toBe(2);

    File::deleteDirectory($root);
});
