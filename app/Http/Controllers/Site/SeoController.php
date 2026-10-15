<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /**
     * robots.txt: open in production, closed everywhere else.
     */
    public function robots(): Response
    {
        $lines = app()->isProduction()
            ? ['User-agent: *', 'Disallow: /admin', '', 'Sitemap: '.route('sitemap')]
            : ['User-agent: *', 'Disallow: /'];

        return response(implode("\n", $lines)."\n", 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    /**
     * sitemap.xml with the public pages and every published album.
     */
    public function sitemap(): Response
    {
        $albums = Album::query()->visibleInGallery()->galleryOrder()->get(['slug', 'updated_at']);

        $urls = [
            ['loc' => route('index'), 'lastmod' => $albums->max('updated_at')],
            ['loc' => route('gallery.index'), 'lastmod' => $albums->max('updated_at')],
            ...$albums->map(fn (Album $album): array => [
                'loc' => route('gallery.show', $album->slug),
                'lastmod' => $album->updated_at,
            ]),
            ['loc' => route('contact'), 'lastmod' => null],
            ['loc' => route('privacy'), 'lastmod' => null],
        ];

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
