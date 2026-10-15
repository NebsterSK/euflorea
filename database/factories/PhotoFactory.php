<?php

namespace Database\Factories;

use App\Models\Album;
use App\Models\Photo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Photo>
 */
class PhotoFactory extends Factory
{
    /**
     * Define the model's default state. No media is attached; use
     * `AddPhotoToAlbum` when a test needs real files.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'album_id' => Album::factory(),
            'original_name' => fake()->word().'.jpg',
            'width' => 2000,
            'height' => 3000,
            'alt' => fake()->sentence(4),
            'focal_x' => 50,
            'focal_y' => 50,
            'sort_order' => 0,
        ];
    }
}
