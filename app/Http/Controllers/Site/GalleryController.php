<?php

namespace App\Http\Controllers\Site;

use App\Data\Site\AlbumCardData;
use App\Data\Site\AlbumLinkData;
use App\Data\Site\AlbumPageData;
use App\Http\Controllers\Controller;
use App\Models\Album;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Facades\Head;

class GalleryController extends Controller
{
    /**
     * List the published albums.
     */
    public function index(): Response
    {
        $albums = Album::query()
            ->visibleInGallery()
            ->galleryOrder()
            ->with([
                'coverPhoto.media',
                // Only the fallback cover is needed for the cards.
                'photos' => fn ($query) => $query->limit(1),
                'photos.media',
            ])
            ->get();

        Head::title('Galéria')
            ->description('Galéria svadieb a štylizovaných fotení Euflorea: svadobné kytice, výzdoba obradu, stolovanie a styling priestoru.');

        return Inertia::render('site/gallery/index', [
            'albums' => AlbumCardData::collect($albums),
        ]);
    }

    /**
     * Show one published album with a link to the next one.
     */
    public function show(string $slug): Response
    {
        $album = Album::query()
            ->visibleInGallery()
            ->where('slug', $slug)
            ->with('photos.media')
            ->firstOrFail();

        $orderedIds = Album::query()->visibleInGallery()->galleryOrder()->pluck('id')->all();
        $position = array_search($album->id, $orderedIds, true);
        $nextId = $orderedIds[($position + 1) % count($orderedIds)] ?? null;
        $next = $nextId !== null && $nextId !== $album->id
            ? Album::query()->find($nextId, ['title', 'slug'])
            : null;

        $page = AlbumPageData::fromAlbum($album);

        Head::title($album->title)
            ->description($album->description ?: "{$album->type->label()} {$album->title}: kvety a výzdoba od Euflorea.")
            ->when($page->photos !== [], fn ($head) => $head->ogImage($page->photos[0]->src, alt: $page->photos[0]->alt));

        return Inertia::render('site/gallery/show', [
            'album' => $page,
            'next' => $next ? new AlbumLinkData($next->title, $next->slug) : null,
        ]);
    }
}
