<?php

use App\Enums\AlbumType;
use App\Models\Album;
use App\Models\Photo;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from the admin to the login page', function () {
    $album = Album::factory()->create();

    $this->get(route('dashboard'))->assertRedirect(route('login'));
    $this->get(route('admin.albums.index'))->assertRedirect(route('login'));
    $this->post(route('admin.albums.store'))->assertRedirect(route('login'));
    $this->delete(route('admin.albums.destroy', $album))->assertRedirect(route('login'));

    expect(Album::query()->count())->toBe(1);
});

test('any signed-in user can manage albums because the admin has no roles', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.albums.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/albums/index'));
});

test('the album list filters by title and type', function () {
    Album::factory()->create(['title' => 'Anna a Jakub']);
    Album::factory()->editorial()->create(['title' => 'Wild West']);
    Album::factory()->create(['title' => 'Barbora a Peter']);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.albums.index', ['filter' => ['search' => 'anna']]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('albums', 1)
            ->where('albums.0.title', 'Anna a Jakub'));

    $this->actingAs(User::factory()->create())
        ->get(route('admin.albums.index', ['filter' => ['type' => 'editorial']]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('albums', 1)
            ->where('albums.0.title', 'Wild West'));
});

test('creating an album derives the slug from the title and opens the editor', function () {
    $response = $this->actingAs(User::factory()->create())
        ->post(route('admin.albums.store'), [
            'title' => 'Kristína a Michal',
            'type' => 'wedding',
            'wedding_date' => '2025-06-14',
            'location' => 'Mojmírovce',
            'is_published' => '1',
        ]);

    $album = Album::query()->sole();

    $response->assertRedirect(route('admin.albums.edit', $album));
    expect($album->slug)->toBe('kristina-a-michal')
        ->and($album->type)->toBe(AlbumType::Wedding)
        ->and($album->is_published)->toBeTrue()
        ->and($album->wedding_date->format('Y-m-d'))->toBe('2025-06-14');
});

test('creating an album requires a title and a unique slug', function () {
    Album::factory()->create(['slug' => 'anna-a-jakub']);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.albums.store'), ['title' => 'Anna a Jakub', 'type' => 'wedding'])
        ->assertSessionHasErrors('slug');

    $this->actingAs(User::factory()->create())
        ->post(route('admin.albums.store'), ['type' => 'wedding'])
        ->assertSessionHasErrors('title');

    expect(Album::query()->count())->toBe(1);
});

test('only one album can be the homepage carousel', function () {
    $previous = Album::factory()->homepageCarousel()->create();
    $album = Album::factory()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.albums.update', $album), [
            'title' => $album->title,
            'slug' => $album->slug,
            'type' => 'wedding',
            'is_published' => '1',
            'is_homepage_carousel' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect($album->refresh()->is_homepage_carousel)->toBeTrue()
        ->and($previous->refresh()->is_homepage_carousel)->toBeFalse();
});

test('the cover must be a photo of the same album', function () {
    $album = Album::factory()->create();
    $foreignPhoto = Photo::factory()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.albums.cover', $album), ['photo_id' => $foreignPhoto->id])
        ->assertSessionHasErrors('photo_id');

    $ownPhoto = Photo::factory()->for($album)->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.albums.cover', $album), ['photo_id' => $ownPhoto->id])
        ->assertSessionHasNoErrors();

    expect($album->refresh()->cover_photo_id)->toBe($ownPhoto->id);
});

test('publishing toggles the album visibility', function () {
    $album = Album::factory()->draft()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.albums.publish', $album), ['value' => true]);

    expect($album->refresh()->is_published)->toBeTrue();
});

test('moving an album swaps it with its neighbour', function () {
    $first = Album::factory()->create(['sort_order' => 1]);
    $second = Album::factory()->create(['sort_order' => 2]);
    $third = Album::factory()->create(['sort_order' => 3]);

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.albums.move', $third), ['direction' => 'up']);

    expect(Album::query()->orderBy('sort_order')->pluck('id')->all())
        ->toBe([$first->id, $third->id, $second->id]);
});

test('deleting an album deletes its photos', function () {
    $album = Album::factory()->create();
    Photo::factory()->for($album)->count(2)->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.albums.destroy', $album))
        ->assertRedirect(route('admin.albums.index'));

    expect(Album::query()->count())->toBe(0)
        ->and(Photo::query()->count())->toBe(0);
});
