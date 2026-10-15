<?php

namespace App\Http\Controllers\Site;

use App\Data\Site\AlbumCardData;
use App\Data\Site\AlbumLinkData;
use App\Data\Site\AlbumPageData;
use App\Http\Controllers\Controller;
use App\Models\Album;
use Inertia\Inertia;
use Inertia\Response;

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
            ->with(['coverPhoto.media', 'photos.media'])
            ->get();

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

        return Inertia::render('site/gallery/show', [
            'album' => AlbumPageData::fromAlbum($album),
            'next' => $next ? new AlbumLinkData($next->title, $next->slug) : null,
        ]);
    }
}
