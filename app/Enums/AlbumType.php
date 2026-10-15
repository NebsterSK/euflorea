<?php

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum AlbumType: string
{
    case Wedding = 'wedding';
    case Editorial = 'editorial';

    /**
     * The Slovak label shown on the site and in the admin.
     */
    public function label(): string
    {
        return match ($this) {
            self::Wedding => 'Svadba',
            self::Editorial => 'Editorial',
        };
    }
}
