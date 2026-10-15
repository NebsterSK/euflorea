<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\Config;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Facades\Head;

class PrivacyController extends Controller
{
    /**
     * Show the privacy policy with the operator details from config.
     *
     * @param  array{name: ?string, address: ?string, company_id: ?string, email: ?string}  $operator
     */
    public function __invoke(#[Config('site.operator')] array $operator): Response
    {
        Head::title('Ochrana osobných údajov')
            ->description('Ako Euflorea spracúva osobné údaje z kontaktného formulára.');

        return Inertia::render('site/privacy', [
            'operator' => $operator,
            'updatedAt' => '15.10.2026',
        ]);
    }
}
