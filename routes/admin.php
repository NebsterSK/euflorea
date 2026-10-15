<?php

use App\Http\Controllers\Admin\AlbumController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\PhotoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');

    Route::name('admin.')->group(function () {
        Route::resource('albums', AlbumController::class)->except('show');
        Route::patch('albums/{album}/move', [AlbumController::class, 'move'])->name('albums.move');
        Route::patch('albums/{album}/publish', [AlbumController::class, 'publish'])->name('albums.publish');
        Route::patch('albums/{album}/cover', [AlbumController::class, 'cover'])->name('albums.cover');

        Route::post('albums/{album}/photos', [PhotoController::class, 'store'])->name('photos.store');
        Route::patch('albums/{album}/photos/order', [PhotoController::class, 'reorder'])->name('photos.reorder');
        Route::patch('photos/{photo}', [PhotoController::class, 'update'])->name('photos.update');
        Route::delete('photos/{photo}', [PhotoController::class, 'destroy'])->name('photos.destroy');

        Route::get('inquiries', [InquiryController::class, 'index'])->name('inquiries.index');
        Route::patch('inquiries/{inquiry}', [InquiryController::class, 'update'])->name('inquiries.update');
    });
});
