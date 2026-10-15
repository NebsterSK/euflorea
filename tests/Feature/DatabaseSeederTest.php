<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('the seeder creates the admin user', function () {
    $this->seed();

    $admin = User::firstWhere('email', 'admin@example.com');

    expect($admin)->not->toBeNull()
        ->and($admin->name)->toBe('Admin')
        ->and($admin->email_verified_at)->not->toBeNull()
        ->and(Hash::check('password', $admin->password))->toBeTrue()
        ->and($admin->hasRole('admin'))->toBeTrue();
});
