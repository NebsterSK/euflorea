<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Social profiles
    |--------------------------------------------------------------------------
    |
    | Shown in the header, the CTA section and on the contact page. A profile
    | without a URL is hidden everywhere instead of rendering a dead link.
    |
    */

    'instagram' => [
        'url' => env('SITE_INSTAGRAM_URL', 'https://www.instagram.com/euflorea_/'),
        'handle' => env('SITE_INSTAGRAM_HANDLE', '@euflorea_'),
    ],

    'facebook' => [
        'url' => env('SITE_FACEBOOK_URL'),
        'handle' => env('SITE_FACEBOOK_HANDLE', 'Euflorea'),
    ],

];
