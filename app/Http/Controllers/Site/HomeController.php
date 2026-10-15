<?php

namespace App\Http\Controllers\Site;

use App\Data\Site\ImageData;
use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Photo;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Facades\Head;

class HomeController extends Controller
{
    /**
     * Show the homepage with the photos of the homepage carousel album.
     */
    public function __invoke(): Response
    {
        $carousel = Album::query()
            ->where('is_homepage_carousel', true)
            ->with('photos.media')
            ->first();

        $slides = $carousel?->photos
            ->filter(fn (Photo $photo): bool => $photo->isReady())
            ->map(fn (Photo $photo): ImageData => ImageData::fromPhoto($photo))
            ->values()
            ->all() ?? [];

        Head::schema([
            '@context' => 'https://schema.org',
            '@type' => 'Florist',
            'name' => 'Euflorea',
            'description' => 'Svadobný a kvetinový styling: svadobné kytice, výzdoba obradu, stolovanie a styling priestoru.',
            'url' => route('index'),
            'image' => asset('og-image.jpg'),
            'areaServed' => 'SK',
            'sameAs' => array_values(array_filter([
                config('site.instagram.url'),
                config('site.facebook.url'),
            ])),
        ]);

        return Inertia::render('site/home', [
            'slides' => $slides,
        ]);
    }
}
