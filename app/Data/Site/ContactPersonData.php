<?php

namespace App\Data\Site;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A person on the contact page (from `config/site.php`).
 */
#[TypeScript]
class ContactPersonData extends Data
{
    public function __construct(
        public string $name,
        public ?string $role = null,
        public ?string $phone = null,
        public ?string $email = null,
    ) {}
}
