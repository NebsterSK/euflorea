<?php

use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

arch('form requests extend FormRequest and are suffixed with Request')
    ->expect('App\Http\Requests')
    ->classes()
    ->toExtend(FormRequest::class)
    ->toHaveSuffix('Request');

arch('form requests carrying a payload map it to a Data object')
    ->expect('App\Http\Requests')
    ->classes()
    ->toHaveMethod('toData')
    ->ignoring([
        ProfileDeleteRequest::class,
        TwoFactorAuthenticationRequest::class,
    ]);

arch('controllers do not take the raw request')
    ->expect('App\Http\Controllers')
    ->not->toUse(Request::class);

arch('data objects extend Data and are exported to TypeScript')
    ->expect('App\Data')
    ->classes()
    ->toExtend(Data::class)
    ->toHaveAttribute(TypeScript::class)
    ->toHaveSuffix('Data');

arch('models have factories and declare their fillable attributes')
    ->expect('App\Models')
    ->classes()
    ->toUseTrait(HasFactory::class)
    ->toHaveAttribute(Fillable::class);
