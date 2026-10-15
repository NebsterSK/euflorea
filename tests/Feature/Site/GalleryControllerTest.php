<?php

use App\Models\Album;
use Inertia\Testing\AssertableInertia as Assert;

test('the gallery lists published albums in their order and hides drafts and the carousel', function () {
    Album::factory()->create(['title' => 'Druhý', 'sort_order' => 2]);
    Album::factory()->create(['title' => 'Prvý', 'sort_order' => 1]);
    Album::factory()->draft()->create(['title' => 'Koncept']);
    Album::factory()->homepageCarousel()->create(['title' => 'Karusel']);

    $this->get(route('gallery.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/gallery/index')
            ->has('albums', 2)
            ->where('albums.0.title', 'Prvý')
            ->where('albums.1.title', 'Druhý'));
});

test('an album page links to the next album and wraps around to the first', function () {
    $first = Album::factory()->create(['sort_order' => 1]);
    $last = Album::factory()->create(['sort_order' => 2]);

    $this->get(route('gallery.show', $first->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/gallery/show')
            ->where('album.title', $first->title)
            ->where('next.slug', $last->slug));

    $this->get(route('gallery.show', $last->slug))
        ->assertInertia(fn (Assert $page) => $page->where('next.slug', $first->slug));
});

test('draft, carousel and unknown albums return 404', function (string $slug) {
    Album::factory()->draft()->create(['slug' => 'koncept']);
    Album::factory()->homepageCarousel()->create(['slug' => 'uvodna-stranka']);

    $this->get(route('gallery.show', $slug))->assertNotFound();
})->with([
    'draft' => 'koncept',
    'homepage carousel' => 'uvodna-stranka',
    'unknown' => 'neexistuje',
]);
