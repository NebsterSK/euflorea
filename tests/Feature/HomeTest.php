<?php

use App\Actions\Albums\AddPhotoToAlbum;
use App\Models\Album;
use App\Models\Photo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('the homepage carousel shows the ready photos of the carousel album', function () {
    Storage::fake('originals');
    Storage::fake('public');

    $carousel = Album::factory()->homepageCarousel()->draft()->create();
    $image = UploadedFile::fake()->image('1.jpg', 600, 900);
    $photo = app(AddPhotoToAlbum::class)->handle($carousel, $image->getRealPath(), '1.jpg', 'Obrad pod holým nebom');
    Photo::factory()->for($carousel)->create();

    $this->get(route('index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/home')
            ->has('slides', 1)
            ->where('slides.0.id', $photo->id)
            ->where('slides.0.alt', 'Obrad pod holým nebom'));
});
