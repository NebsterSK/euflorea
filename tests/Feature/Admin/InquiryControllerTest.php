<?php

use App\Models\Inquiry;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot read inquiries', function () {
    $this->get(route('admin.inquiries.index'))->assertRedirect(route('login'));
});

test('signed-in users see inquiries filtered by status', function () {
    Inquiry::factory()->create(['name' => 'Otvorená Nová']);
    Inquiry::factory()->handled()->create(['name' => 'Vybavená Stará']);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.inquiries.index', ['filter' => ['status' => 'open']]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/inquiries/index')
            ->has('inquiries', 1)
            ->where('inquiries.0.name', 'Otvorená Nová'));
});

test('an inquiry can be marked handled and reopened', function () {
    $inquiry = Inquiry::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)->patch(route('admin.inquiries.update', $inquiry), ['value' => true]);
    expect($inquiry->refresh()->handled_at)->not->toBeNull();

    $this->actingAs($user)->patch(route('admin.inquiries.update', $inquiry), ['value' => false]);
    expect($inquiry->refresh()->handled_at)->toBeNull();
});
