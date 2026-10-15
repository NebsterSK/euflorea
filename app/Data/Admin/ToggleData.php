<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A single on/off switch (published album, handled inquiry).
 */
#[TypeScript]
class ToggleData extends Data
{
    public function __construct(
        public bool $value,
    ) {}
}
