<?php

use App\Http\Controllers\Site\ContactController;
use App\Http\Controllers\Site\GalleryController;
use App\Http\Controllers\Site\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('index');
Route::get('galeria', [GalleryController::class, 'index'])->name('gallery.index');
Route::get('galeria/{slug}', [GalleryController::class, 'show'])->name('gallery.show');
Route::get('kontakt', [ContactController::class, 'show'])->name('contact');
Route::post('kontakt', [ContactController::class, 'send'])->middleware('throttle:contact')->name('contact.send');
Route::inertia('ochrana-osobnych-udajov', 'site/privacy')->name('privacy');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
