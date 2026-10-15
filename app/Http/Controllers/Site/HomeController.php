<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Show the homepage.
     */
    public function __invoke(): Response
    {
        return Inertia::render('site/home', [
            'slides' => [],
        ]);
    }
}
