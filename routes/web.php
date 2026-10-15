<?php

use App\Http\Controllers\Site\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('index');
Route::inertia('galeria', 'site/gallery/index')->name('gallery.index');
Route::inertia('kontakt', 'site/contact')->name('contact');
Route::inertia('ochrana-osobnych-udajov', 'site/privacy')->name('privacy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
