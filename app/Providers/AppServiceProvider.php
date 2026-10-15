<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureModels();
        $this->configureRateLimiting();

        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands($this->app->isProduction());

        Password::defaults(fn (): ?Password => $this->app->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Contact form: 5 submissions per hour per IP. Over the limit the visitor
     * goes back to the form with a message instead of a bare 429 page.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('contact', fn (Request $request) => Limit::perHour(5)
            ->by($request->ip())
            ->response(fn () => back()->withInput()->withErrors([
                'form' => 'Poslali ste nám veľa správ naraz. Skúste to prosím o hodinu alebo nám napíšte na Instagrame.',
            ])));
    }

    /**
     * Make Eloquent strict outside production; in production, log lazy loading instead of throwing.
     */
    protected function configureModels(): void
    {
        Model::shouldBeStrict(! $this->app->isProduction());

        if ($this->app->isProduction()) {
            Model::preventLazyLoading();

            Model::handleLazyLoadingViolationUsing(function (Model $model, string $relation): void {
                Log::warning('Lazy loading violation.', [
                    'model' => $model::class,
                    'relation' => $relation,
                ]);
            });
        }
    }
}
