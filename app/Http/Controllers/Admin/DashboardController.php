<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Inquiry;
use App\Models\Photo;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin overview.
     */
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'albums' => Album::query()->where('is_homepage_carousel', false)->count(),
                'published' => Album::query()->visibleInGallery()->count(),
                'photos' => Photo::query()->count(),
                'openInquiries' => Inquiry::query()->whereNull('handled_at')->count(),
            ],
            'carouselAlbumId' => Album::query()->where('is_homepage_carousel', true)->value('id'),
        ]);
    }
}
