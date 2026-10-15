<?php

use App\Models\Album;
use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('originals');
    Storage::fake('public');
});

test('guests cannot upload photos', function () {
    $album = Album::factory()->create();

    $this->post(route('admin.photos.store', $album), [
        'photo' => UploadedFile::fake()->image('svadba.jpg', 800, 1200),
    ])->assertRedirect(route('login'));

    expect(Photo::query()->count())->toBe(0);
});

test('an uploaded photo is stored privately with public webp variants and becomes the first cover', function () {
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.photos.store', $album), [
            'photo' => UploadedFile::fake()->image('svadba.jpg', 800, 1200),
        ])
        ->assertSessionHasNoErrors();

    $photo = Photo::query()->sole();
    $media = $photo->image();

    expect($photo->width)->toBe(800)
        ->and($photo->height)->toBe(1200)
        ->and($media->disk)->toBe('originals')
        ->and($media->conversions_disk)->toBe('public')
        ->and($photo->isReady())->toBeTrue()
        ->and($media->getPath('web'))->toEndWith('.webp')
        ->and($album->refresh()->cover_photo_id)->toBe($photo->id);

    Storage::disk('public')->assertExists($media->getPathRelativeToRoot('web'));
});

test('uploads that are not images are rejected', function () {
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.photos.store', $album), [
            'photo' => UploadedFile::fake()->create('zmluva.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors('photo');

    expect(Photo::query()->count())->toBe(0);
});

test('the alt text and focal point are saved', function () {
    $photo = Photo::factory()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.photos.update', $photo), [
            'alt' => 'Kytica z pampovej trávy',
            'focal_x' => 30,
            'focal_y' => 70,
        ])
        ->assertSessionHasNoErrors();

    expect($photo->refresh())
        ->alt->toBe('Kytica z pampovej trávy')
        ->focal_x->toBe(30)
        ->focal_y->toBe(70);
});

test('a focal point outside the photo is rejected', function () {
    $photo = Photo::factory()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.photos.update', $photo), ['focal_x' => 120, 'focal_y' => 50])
        ->assertSessionHasErrors('focal_x');
});

test('reordering ignores photos of other albums', function () {
    $album = Album::factory()->create();
    [$first, $second] = Photo::factory()->for($album)->count(2)->sequence(['sort_order' => 1], ['sort_order' => 2])->create();
    $foreign = Photo::factory()->create(['sort_order' => 5]);

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.photos.reorder', $album), ['ids' => [$second->id, $foreign->id, $first->id]]);

    expect($album->photos()->pluck('id')->all())->toBe([$second->id, $first->id])
        ->and($foreign->refresh()->sort_order)->toBe(5);
});

test('deleting the cover photo clears the album cover', function () {
    $album = Album::factory()->create();
    $photo = Photo::factory()->for($album)->create();
    $album->update(['cover_photo_id' => $photo->id]);

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.photos.destroy', $photo));

    expect(Photo::query()->count())->toBe(0)
        ->and($album->refresh()->cover_photo_id)->toBeNull();
});
