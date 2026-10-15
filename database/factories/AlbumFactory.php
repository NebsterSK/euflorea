<?php

namespace Database\Factories;

use App\Enums\AlbumType;
use App\Models\Album;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Album>
 */
class AlbumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->firstNameFemale().' a '.fake()->firstNameMale();

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 99999),
            'type' => AlbumType::Wedding,
            'wedding_date' => fake()->dateTimeBetween('-3 years', 'now'),
            'location' => fake()->city(),
            'description' => null,
            'is_published' => true,
            'is_homepage_carousel' => false,
            'sort_order' => 0,
        ];
    }

    /**
     * A draft album, hidden from the gallery.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => ['is_published' => false]);
    }

    /**
     * A styled editorial shoot.
     */
    public function editorial(): static
    {
        return $this->state(fn (array $attributes) => ['type' => AlbumType::Editorial]);
    }

    /**
     * The homepage carousel album.
     */
    public function homepageCarousel(): static
    {
        return $this->state(fn (array $attributes) => ['is_homepage_carousel' => true]);
    }
}
