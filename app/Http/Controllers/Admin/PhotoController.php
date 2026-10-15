<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Albums\AddPhotoToAlbum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderPhotosRequest;
use App\Http\Requests\Admin\StorePhotoRequest;
use App\Http\Requests\Admin\UpdatePhotoRequest;
use App\Models\Album;
use App\Models\Photo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class PhotoController extends Controller
{
    /**
     * Upload one photo into the album (the editor sends files one by one).
     */
    public function store(StorePhotoRequest $request, Album $album, AddPhotoToAlbum $addPhoto): RedirectResponse
    {
        $data = $request->toData();

        try {
            $photo = $addPhoto->handle($album, $data->photo->getRealPath(), $data->photo->getClientOriginalName());

            if ($album->cover_photo_id === null) {
                $album->update(['cover_photo_id' => $photo->id]);
            }
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Fotku '.$data->photo->getClientOriginalName().' sa nepodarilo nahrať.');
        }

        return back();
    }

    /**
     * Save the alt text and focal point.
     */
    public function update(UpdatePhotoRequest $request, Photo $photo): RedirectResponse
    {
        $data = $request->toData();

        try {
            $photo->update([
                'alt' => $data->alt,
                'focal_x' => $data->focalX,
                'focal_y' => $data->focalY,
            ]);
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Fotku sa nepodarilo uložiť.');
        }

        $this->flashSuccess('Fotka bola uložená.');

        return back();
    }

    /**
     * Delete the photo and its files.
     */
    public function destroy(Photo $photo): RedirectResponse
    {
        try {
            $photo->delete();
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Fotku sa nepodarilo zmazať.');
        }

        $this->flashSuccess('Fotka bola zmazaná.');

        return back();
    }

    /**
     * Save a new photo order for the album.
     */
    public function reorder(ReorderPhotosRequest $request, Album $album): RedirectResponse
    {
        $data = $request->toData();

        try {
            DB::transaction(function () use ($album, $data): void {
                $albumPhotoIds = $album->photos()->pluck('id')->all();
                $ordered = array_values(array_intersect($data->ids, $albumPhotoIds));
                $missing = array_values(array_diff($albumPhotoIds, $ordered));

                foreach ([...$ordered, ...$missing] as $order => $id) {
                    Photo::query()->whereKey($id)->update(['sort_order' => $order + 1]);
                }
            });
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Poradie sa nepodarilo uložiť.');
        }

        return back();
    }
}
