<?php

use App\Http\Controllers\Site\ContactController;
use App\Http\Controllers\Site\GalleryController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\PrivacyController;
use App\Http\Controllers\Site\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('index');
Route::get('galeria', [GalleryController::class, 'index'])->name('gallery.index');
Route::get('galeria/{slug}', [GalleryController::class, 'show'])->name('gallery.show');
Route::get('kontakt', [ContactController::class, 'show'])->name('contact');
Route::post('kontakt', [ContactController::class, 'send'])->middleware('throttle:contact')->name('contact.send');
Route::get('ochrana-osobnych-udajov', PrivacyController::class)->name('privacy');
Route::get('robots.txt', [SeoController::class, 'robots'])->name('robots');
Route::get('sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
