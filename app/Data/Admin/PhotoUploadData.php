<?php

namespace App\Data\Admin;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A validated photo upload (one file per request).
 */
#[TypeScript]
class PhotoUploadData extends Data
{
    public function __construct(
        public UploadedFile $photo,
    ) {}
}
