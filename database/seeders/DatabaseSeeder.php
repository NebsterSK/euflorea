<?php

namespace Database\Seeders;

use App\Actions\Albums\AddPhotoToAlbum;
use App\Models\Album;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Imagick;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    /**
     * Gradient pairs for the dummy photos, in the site's soft floral tones.
     *
     * @var list<array{string, string}>
     */
    protected const array Gradients = [
        ['#f4e4dc', '#c98b7a'],
        ['#eef0e4', '#8a9a74'],
        ['#f6efe6', '#b89a7c'],
        ['#ece4ee', '#9c7f9e'],
        ['#e6ecef', '#7f97a3'],
    ];

    public function run(): void
    {
        $adminId = DB::table('users')->insertGetId([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $adminRoleId = DB::table('roles')->insertGetId([
            'name' => 'admin',
            'guard_name' => 'web',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('model_has_roles')->insert([
            'role_id' => $adminRoleId,
            'model_type' => 'App\Models\User',
            'model_id' => $adminId,
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        if (! app()->isProduction()) {
            $this->seedDemoAlbums();
        }
    }

    /**
     * The homepage carousel album and a few gallery albums, each with
     * generated gradient photos.
     */
    protected function seedDemoAlbums(): void
    {
        $carousel = Album::factory()->homepageCarousel()->draft()->create([
            'title' => 'Úvodná stránka',
            'slug' => 'uvodna-stranka',
        ]);
        $this->addDummyPhotos($carousel, count: 5, width: 1800, height: 1200);

        $galleryAlbums = [
            Album::factory()->create(['sort_order' => 1]),
            Album::factory()->create(['sort_order' => 2]),
            Album::factory()->editorial()->create(['title' => 'Jarná záhrada', 'slug' => 'jarna-zahrada', 'sort_order' => 3]),
        ];

        foreach ($galleryAlbums as $album) {
            $this->addDummyPhotos($album, count: 4, width: 1200, height: 1800);
        }
    }

    /**
     * Generate `$count` gradient images and add them to the album; the first
     * becomes the cover.
     */
    protected function addDummyPhotos(Album $album, int $count, int $width, int $height): void
    {
        $addPhoto = app(AddPhotoToAlbum::class);

        foreach (range(1, $count) as $index) {
            [$fromColor, $toColor] = self::Gradients[($album->id + $index) % count(self::Gradients)];

            $image = new Imagick;
            $image->newPseudoImage($width, $height, "gradient:{$fromColor}-{$toColor}");
            $image->setImageFormat('jpeg');

            $sourcePath = tempnam(sys_get_temp_dir(), 'seed-photo-');
            $image->writeImage('jpeg:'.$sourcePath);
            $image->clear();

            try {
                $photo = $addPhoto->handle($album, $sourcePath, "{$album->slug}-{$index}.jpg", "{$album->title} – fotka {$index}");
            } finally {
                unlink($sourcePath);
            }

            if ($index === 1) {
                $album->update(['cover_photo_id' => $photo->id]);
            }
        }
    }
}
