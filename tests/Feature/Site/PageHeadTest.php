<?php

use App\Models\Album;
use Inertia\Testing\AssertableInertia as Assert;

test('album pages render their title and description into the document head for crawlers', function () {
    $album = Album::factory()->create([
        'title' => 'Anna a Jakub',
        'description' => 'Lúčne kvety pod holým nebom.',
    ]);

    $this->get(route('gallery.show', $album->slug))
        ->assertSee('<title data-inertia="title">Anna a Jakub · Euflorea</title>', false)
        ->assertSee('content="Lúčne kvety pod holým nebom."', false)
        ->assertSee('property="og:title" content="Anna a Jakub · Euflorea"', false);
});

test('the homepage describes the studio as a florist in structured data', function () {
    $this->get(route('index'))
        ->assertSee('"@type":"Florist"', false)
        ->assertSee('rel="icon" href="/favicon.svg"', false);
});

test('pages are hidden from search engines outside production', function () {
    $this->get(route('index'))->assertSee('name="robots" content="none"', false);
});

test('the privacy page names the configured operator', function () {
    config(['site.operator.name' => 'Euflorea s.r.o.']);

    $this->get(route('privacy'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/privacy')
            ->where('operator.name', 'Euflorea s.r.o.'));
});

test('unknown pages show the branded 404 page', function () {
    $this->get('/neexistujuca-stranka')
        ->assertNotFound()
        ->assertSee('<title data-inertia="title">Stránka neexistuje · Euflorea</title>', false)
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/error')
            ->where('status', 404));
});
