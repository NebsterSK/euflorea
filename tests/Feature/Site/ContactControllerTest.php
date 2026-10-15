<?php

use App\Mail\InquiryConfirmation;
use App\Mail\InquiryReceived;
use App\Models\Inquiry;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * A valid contact form submission.
 *
 * @return array<string, mixed>
 */
function inquiryPayload(array $overrides = []): array
{
    return [
        'name' => 'Lucia Nováková',
        'email' => 'lucia@example.com',
        'phone' => '+421 900 123 456',
        'wedding_date' => now()->addMonths(6)->format('Y-m-d'),
        'venue' => 'Kaštieľ Mojmírovce',
        'guests' => '60-100',
        'services' => ['svadobne-kytice', 'vyzdoba-obradu'],
        'message' => 'Chceli by sme lúčne kvety a veľa zelene.',
        'consent' => '1',
        'website' => '',
        ...$overrides,
    ];
}

test('the contact page offers the guest and service options', function () {
    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/contact')
            ->has('guestOptions', 5)
            ->has('serviceOptions', 4));
});

test('a valid inquiry is stored and mailed to the studio', function () {
    Mail::fake();
    config(['site.contact.recipient' => 'studio@euflorea.sk']);

    $this->from(route('contact'))
        ->post(route('contact.send'), inquiryPayload())
        ->assertRedirect(route('contact'))
        ->assertSessionHasNoErrors();

    $inquiry = Inquiry::query()->sole();

    expect($inquiry->name)->toBe('Lucia Nováková')
        ->and($inquiry->services)->toBe(['svadobne-kytice', 'vyzdoba-obradu'])
        ->and($inquiry->handled_at)->toBeNull();

    Mail::assertQueued(InquiryReceived::class, fn (InquiryReceived $mail) => $mail->hasTo('studio@euflorea.sk')
        && $mail->hasReplyTo('lucia@example.com'));
    Mail::assertNotQueued(InquiryConfirmation::class);
});

test('no mail is sent while no recipient is configured, but the inquiry is kept', function () {
    Mail::fake();
    config(['site.contact.recipient' => null]);

    $this->post(route('contact.send'), inquiryPayload());

    expect(Inquiry::query()->count())->toBe(1);
    Mail::assertNothingQueued();
});

test('the couple gets a copy when confirmations are enabled', function () {
    Mail::fake();
    config(['site.contact.send_confirmation' => true]);

    $this->post(route('contact.send'), inquiryPayload());

    Mail::assertQueued(InquiryConfirmation::class, fn ($mail) => $mail->hasTo('lucia@example.com'));
});

test('an unknown wedding date is allowed when the couple says so', function () {
    $this->post(route('contact.send'), inquiryPayload([
        'wedding_date' => null,
        'date_unknown' => '1',
    ]))->assertSessionHasNoErrors();

    expect(Inquiry::query()->sole())
        ->wedding_date->toBeNull()
        ->date_unknown->toBeTrue();
});

test('the inquiry needs name, email, date, message and consent', function () {
    $this->post(route('contact.send'), [])
        ->assertSessionHasErrors([
            'name' => 'Vyplňte pole meno a priezvisko.',
            'email',
            'wedding_date' => 'Vyberte dátum svadby alebo zaškrtnite, že ho ešte neviete.',
            'message',
            'consent' => 'Bez súhlasu so spracovaním osobných údajov vám nemôžeme odpovedať.',
        ]);

    expect(Inquiry::query()->count())->toBe(0);
});

test('a wedding date in the past is rejected', function () {
    $this->post(route('contact.send'), inquiryPayload(['wedding_date' => now()->subDay()->format('Y-m-d')]))
        ->assertSessionHasErrors(['wedding_date' => 'Dátum svadby nemôže byť v minulosti.']);
});

test('services and guest counts outside the lists are rejected', function () {
    $this->post(route('contact.send'), inquiryPayload([
        'guests' => '1000',
        'services' => ['ohnostroj'],
    ]))->assertSessionHasErrors(['guests', 'services.0']);
});

test('a filled honeypot looks successful but stores and sends nothing', function () {
    Mail::fake();
    config(['site.contact.recipient' => 'studio@euflorea.sk']);

    $this->post(route('contact.send'), inquiryPayload(['website' => 'https://spam.example']))
        ->assertSessionHasNoErrors();

    expect(Inquiry::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});

test('the sixth inquiry within an hour from one address is refused with a message', function () {
    foreach (range(1, 5) as $attempt) {
        $this->post(route('contact.send'), inquiryPayload())->assertSessionHasNoErrors();
    }

    $this->post(route('contact.send'), inquiryPayload())->assertSessionHasErrors('form');

    expect(Inquiry::query()->count())->toBe(5);
});
