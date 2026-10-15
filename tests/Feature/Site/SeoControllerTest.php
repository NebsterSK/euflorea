<?php

use App\Models\Album;

test('robots.txt blocks crawlers outside production', function () {
    $this->get(route('robots'))
        ->assertOk()
        ->assertSeeText('Disallow: /')
        ->assertDontSeeText('Sitemap:');
});

test('robots.txt points to the sitemap in production', function () {
    app()->detectEnvironment(fn () => 'production');

    $this->get(route('robots'))
        ->assertOk()
        ->assertSeeText('Disallow: /admin')
        ->assertSeeText('Sitemap: '.route('sitemap'));
});

test('the sitemap lists the public pages and only published albums', function () {
    $published = Album::factory()->create();
    $draft = Album::factory()->draft()->create();
    $carousel = Album::factory()->homepageCarousel()->create();

    $this->get(route('sitemap'))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee('<loc>'.route('gallery.show', $published->slug).'</loc>', false)
        ->assertSee('<loc>'.route('contact').'</loc>', false)
        ->assertDontSee(route('gallery.show', $draft->slug), false)
        ->assertDontSee(route('gallery.show', $carousel->slug), false);
});
