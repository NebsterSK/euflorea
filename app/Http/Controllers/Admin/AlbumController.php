<?php

namespace App\Http\Controllers\Admin;

use App\Data\Admin\AlbumData;
use App\Data\Admin\AlbumRowData;
use App\Data\Admin\PhotoData;
use App\Enums\AlbumType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IndexAlbumsRequest;
use App\Http\Requests\Admin\MoveAlbumRequest;
use App\Http\Requests\Admin\StoreAlbumRequest;
use App\Http\Requests\Admin\ToggleRequest;
use App\Http\Requests\Admin\UpdateAlbumRequest;
use App\Http\Requests\Admin\UpdateCoverRequest;
use App\Models\Album;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class AlbumController extends Controller
{
    /**
     * List albums with search, type filter and sorting.
     */
    public function index(IndexAlbumsRequest $request): Response
    {
        $query = $request->toData();

        $albums = QueryBuilder::for(Album::query()->withCount('photos')->with(['coverPhoto.media', 'photos.media']))
            ->allowedFilters(
                AllowedFilter::partial('search', 'title'),
                AllowedFilter::exact('type'),
            )
            ->allowedSorts(
                AllowedSort::field('sort_order'),
                AllowedSort::field('title'),
                AllowedSort::field('wedding_date'),
                AllowedSort::field('created_at'),
            )
            ->defaultSort('sort_order', 'id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/albums/index', [
            'albums' => AlbumRowData::collect($albums->getCollection()),
            'meta' => [
                'currentPage' => $albums->currentPage(),
                'lastPage' => $albums->lastPage(),
                'total' => $albums->total(),
                'from' => $albums->firstItem(),
                'to' => $albums->lastItem(),
            ],
            'typeOptions' => array_map(
                fn (AlbumType $type): array => ['value' => $type->value, 'label' => $type->label()],
                AlbumType::cases(),
            ),
            'filters' => $query->filter,
            'sort' => $query->sort,
        ]);
    }

    /**
     * Show the new album form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/albums/create', [
            'typeOptions' => array_map(
                fn (AlbumType $type): array => ['value' => $type->value, 'label' => $type->label()],
                AlbumType::cases(),
            ),
        ]);
    }

    /**
     * Create an album and continue to its photos.
     */
    public function store(StoreAlbumRequest $request): RedirectResponse
    {
        $data = $request->toData();

        try {
            $album = DB::transaction(function () use ($data): Album {
                $album = Album::query()->create([
                    ...$data->toAttributes(),
                    'cover_photo_id' => null,
                    'sort_order' => (int) Album::query()->max('sort_order') + 1,
                ]);

                if ($data->isHomepageCarousel) {
                    $album->makeHomepageCarousel();
                }

                return $album;
            });
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Album sa nepodarilo vytvoriť.');
        }

        $this->flashSuccess('Album bol vytvorený. Teraz doň nahrajte fotky.');

        return to_route('admin.albums.edit', $album);
    }

    /**
     * Show the album form with its photos.
     */
    public function edit(Album $album): Response
    {
        $album->load('photos.media');

        return Inertia::render('admin/albums/edit', [
            'album' => AlbumData::fromAlbum($album),
            'photos' => PhotoData::collect($album->photos->map(fn ($photo) => PhotoData::fromPhoto($photo))),
            'typeOptions' => array_map(
                fn (AlbumType $type): array => ['value' => $type->value, 'label' => $type->label()],
                AlbumType::cases(),
            ),
        ]);
    }

    /**
     * Save the album details.
     */
    public function update(UpdateAlbumRequest $request, Album $album): RedirectResponse
    {
        $data = $request->toData();

        try {
            DB::transaction(function () use ($album, $data): void {
                $album->update($data->toAttributes());

                if ($data->isHomepageCarousel) {
                    $album->makeHomepageCarousel();
                } elseif ($album->is_homepage_carousel) {
                    $album->update(['is_homepage_carousel' => false]);
                }
            });
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Album sa nepodarilo uložiť.');
        }

        $this->flashSuccess('Album bol uložený.');

        return back();
    }

    /**
     * Delete the album with its photos and files.
     */
    public function destroy(Album $album): RedirectResponse
    {
        try {
            DB::transaction(function () use ($album): void {
                $album->update(['cover_photo_id' => null]);
                $album->load('photos.media');
                $album->photos->each->delete();
                $album->delete();
            });
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Album sa nepodarilo zmazať.');
        }

        $this->flashSuccess('Album bol zmazaný.');

        return to_route('admin.albums.index');
    }

    /**
     * Move the album one place up or down in the gallery order.
     */
    public function move(MoveAlbumRequest $request, Album $album): RedirectResponse
    {
        $data = $request->toData();

        try {
            DB::transaction(function () use ($album, $data): void {
                $ids = Album::query()->orderBy('sort_order')->orderBy('id')->pluck('id')->all();
                $position = array_search($album->id, $ids, true);
                $target = $data->direction === 'up' ? $position - 1 : $position + 1;

                if ($position === false || ! isset($ids[$target])) {
                    return;
                }

                [$ids[$position], $ids[$target]] = [$ids[$target], $ids[$position]];

                foreach ($ids as $order => $id) {
                    Album::query()->whereKey($id)->update(['sort_order' => $order + 1]);
                }
            });
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Poradie sa nepodarilo zmeniť.');
        }

        return back();
    }

    /**
     * Publish or hide the album.
     */
    public function publish(ToggleRequest $request, Album $album): RedirectResponse
    {
        $data = $request->toData();

        try {
            $album->update(['is_published' => $data->value]);
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Zmenu sa nepodarilo uložiť.');
        }

        $this->flashSuccess($data->value ? 'Album je zverejnený.' : 'Album je skrytý.');

        return back();
    }

    /**
     * Set the album cover.
     */
    public function cover(UpdateCoverRequest $request, Album $album): RedirectResponse
    {
        $data = $request->toData();

        try {
            $album->update(['cover_photo_id' => $data->photoId]);
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Obálku sa nepodarilo nastaviť.');
        }

        $this->flashSuccess('Obálka albumu bola nastavená.');

        return back();
    }
}
