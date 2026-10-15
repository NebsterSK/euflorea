<?php

namespace App\Data\Settings;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ProfileData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
    ) {}
}
