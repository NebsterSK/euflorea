<?php

use App\Models\Album;
use App\Models\Photo;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('originals');
    Storage::fake('public');
});

test('the seeder creates the admin user', function () {
    $this->seed();

    $admin = User::firstWhere('email', 'admin@example.com');

    expect($admin)->not->toBeNull()
        ->and($admin->name)->toBe('Admin')
        ->and($admin->email_verified_at)->not->toBeNull()
        ->and(Hash::check('password', $admin->password))->toBeTrue()
        ->and($admin->hasRole('admin'))->toBeTrue();
});

test('the seeder creates a carousel album and gallery albums with ready photos', function () {
    $this->seed();

    $carousel = Album::firstWhere('is_homepage_carousel', true);
    $galleryAlbums = Album::query()->visibleInGallery()->with('coverPhoto.media')->get();

    expect($carousel->photos)->toHaveCount(5)
        ->and($carousel->photos->every(fn (Photo $photo): bool => $photo->isReady()))->toBeTrue()
        ->and($galleryAlbums)->toHaveCount(3)
        ->and($galleryAlbums->every(fn (Album $album): bool => $album->coverPhoto?->isReady() === true))->toBeTrue();
});

test('the seeder skips the demo albums in production', function () {
    app()->detectEnvironment(fn (): string => 'production');

    $this->seed();

    expect(Album::count())->toBe(0);
});
