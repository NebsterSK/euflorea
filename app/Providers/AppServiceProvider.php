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
use Inertia\ExceptionResponse;
use Inertia\Inertia;
use Laravel\Head\ErrorPages;
use Laravel\Head\Facades\Head;
use Laravel\Head\HeadBuilder;

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
        $this->configureHead();
        $this->configureErrorPages();

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
     * Site-wide document head: titles as "Page · Euflorea", Open Graph from the
     * page title and description, the logo card as the default share image,
     * icons, and no indexing outside production. Page tags are server-rendered
     * for crawlers and link previews; the client only updates the title.
     */
    protected function configureHead(): void
    {
        Head::defaults(fn (HeadBuilder $head) => $head
            ->title('Euflorea · Svadobný a kvetinový styling', suffix: ' · Euflorea')
            ->description('Euflorea, svadobný a kvetinový styling. Navrhujeme a realizujeme svadobné kytice, výzdobu obradu, stolovanie aj styling celého priestoru.')
            ->canonical()
            ->og(type: 'website', siteName: 'Euflorea', locale: 'sk_SK')
            ->ogImage(asset('og-image.jpg'), alt: 'Euflorea, svadobný a kvetinový styling', width: 1200, height: 630)
            ->twitter('summary_large_image')
            ->when(! $this->app->isProduction(), fn (HeadBuilder $builder) => $builder->hiddenFromRobots()));

        Head::errors(fn (ErrorPages $pages) => $pages
            ->defaults(fn (HeadBuilder $head) => $head->hiddenFromRobots())
            ->status(403, title: 'Sem nemáte prístup')
            ->status(404, title: 'Stránka neexistuje')
            ->status(500, title: 'Niečo sa pokazilo')
            ->status(503, title: 'Práve robíme údržbu'));

        // Server-owned tags that Inertia must never swap out on navigation.
        Head::inertiaGlobals(fn (HeadBuilder $head) => $head
            ->colorScheme('light')
            ->themeColor('#FAF6F2')
            ->favicon('/favicon.ico', sizes: 'any')
            ->icon('/favicon.svg', type: 'image/svg+xml')
            ->appleTouchIcon('/apple-touch-icon.png'));
    }

    /**
     * Branded error pages. 404 and 403 always; server errors only when debug
     * is off, so local development keeps the detailed exception page.
     */
    protected function configureErrorPages(): void
    {
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            $status = $response->statusCode();
            $isServerError = in_array($status, [500, 503], true);

            if (! in_array($status, [403, 404, 500, 503], true) || ($isServerError && config('app.debug'))) {
                return null;
            }

            Head::status($status);

            return $response->render('site/error', ['status' => $status])->withSharedData();
        });
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
