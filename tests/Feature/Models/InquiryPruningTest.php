<?php

use App\Models\Inquiry;
use Illuminate\Support\Facades\Artisan;

it('prunes inquiries untouched for over two years and keeps recent ones', function () {
    $old = Inquiry::factory()->create(['created_at' => now()->subYears(3), 'updated_at' => now()->subYears(3)]);
    $recent = Inquiry::factory()->create(['created_at' => now()->subYear(), 'updated_at' => now()->subYear()]);

    Artisan::call('model:prune', ['--model' => Inquiry::class]);

    expect(Inquiry::find($old->id))->toBeNull()
        ->and(Inquiry::find($recent->id))->not->toBeNull();
});
