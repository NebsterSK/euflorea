<?php

namespace App\Enums;

enum GuestCount: string
{
    case UpTo30 = 'do-30';
    case From30To60 = '30-60';
    case From60To100 = '60-100';
    case From100To150 = '100-150';
    case Over150 = 'viac-ako-150';

    /**
     * The Slovak label shown in the contact form.
     */
    public function label(): string
    {
        return match ($this) {
            self::UpTo30 => 'do 30',
            self::From30To60 => '30 až 60',
            self::From60To100 => '60 až 100',
            self::From100To150 => '100 až 150',
            self::Over150 => 'viac ako 150',
        };
    }
}
