<?php

use App\Models\User;
use App\Providers\AppServiceProvider;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Illuminate\Database\Eloquent\MissingAttributeException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\LazyLoadingViolationException;
use Illuminate\Support\Facades\Log;

afterEach(function () {
    $this->app['env'] = 'testing';

    (new AppServiceProvider($this->app))->boot();

    Model::handleLazyLoadingViolationUsing(null);
});

test('lazy loading throws outside production', function () {
    User::factory()->count(2)->create();

    expect(fn () => User::all()->each(fn (User $user) => $user->roles))
        ->toThrow(LazyLoadingViolationException::class);
});

test('accessing an attribute that was not selected throws outside production', function () {
    User::factory()->create();

    expect(fn () => User::query()->select('id')->first()->name)
        ->toThrow(MissingAttributeException::class);
});

test('mass assigning a non fillable attribute throws outside production', function () {
    expect(fn () => new User(['remember_token' => 'token']))
        ->toThrow(MassAssignmentException::class);
});

test('lazy loading is logged instead of thrown in production', function () {
    $this->app['env'] = 'production';

    (new AppServiceProvider($this->app))->boot();

    Log::spy();

    User::factory()->count(2)->create();

    User::all()->each(fn (User $user) => $user->roles);

    Log::shouldHaveReceived('warning')
        ->with('Lazy loading violation.', ['model' => User::class, 'relation' => 'roles'])
        ->twice();
});
