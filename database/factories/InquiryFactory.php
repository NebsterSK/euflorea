<?php

namespace Database\Factories;

use App\Enums\GuestCount;
use App\Enums\Service;
use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'wedding_date' => fake()->dateTimeBetween('+1 month', '+1 year'),
            'date_unknown' => false,
            'venue' => fake()->city(),
            'guests' => GuestCount::From60To100->value,
            'services' => [Service::Bouquets->value, Service::Ceremony->value],
            'message' => fake()->paragraph(),
            'handled_at' => null,
            'ip' => fake()->ipv4(),
            'user_agent' => 'Mozilla/5.0',
        ];
    }

    /**
     * An inquiry the studio has already dealt with.
     */
    public function handled(): static
    {
        return $this->state(fn (array $attributes) => ['handled_at' => now()]);
    }
}
