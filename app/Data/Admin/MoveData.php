<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Move an album one place up or down.
 */
#[TypeScript]
class MoveData extends Data
{
    public function __construct(
        public string $direction,
    ) {}
}
