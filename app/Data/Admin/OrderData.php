<?php

namespace App\Data\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A new order of photo ids.
 */
#[TypeScript]
class OrderData extends Data
{
    /**
     * @param  list<int>  $ids
     */
    public function __construct(
        public array $ids,
    ) {}
}
