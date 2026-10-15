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

    /*
    |--------------------------------------------------------------------------
    | Contact
    |--------------------------------------------------------------------------
    |
    | `recipient`: where inquiry mails go; no mail is sent while it is empty
    | (inquiries are always stored and visible in the admin).
    | `send_confirmation`: also mail the couple a copy of their message.
    | `people`: contact cards on the contact page, e.g.
    |   ['name' => 'Jana', 'role' => 'Kvetinárka', 'phone' => '+421 900 000 000', 'email' => 'jana@euflorea.sk']
    |
    */

    'contact' => [
        'recipient' => env('SITE_CONTACT_RECIPIENT'),
        'send_confirmation' => (bool) env('SITE_CONTACT_SEND_CONFIRMATION', false),
        'people' => [],
    ],

];
