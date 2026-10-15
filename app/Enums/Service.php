<?php

namespace App\Enums;

enum Service: string
{
    case Bouquets = 'svadobne-kytice';
    case Ceremony = 'vyzdoba-obradu';
    case Tables = 'stolovanie-a-hostina';
    case Venue = 'styling-priestoru';

    /**
     * The Slovak label shown on the homepage and in the contact form.
     */
    public function label(): string
    {
        return match ($this) {
            self::Bouquets => 'Svadobné kytice',
            self::Ceremony => 'Výzdoba obradu',
            self::Tables => 'Stolovanie a hostina',
            self::Venue => 'Styling priestoru',
        };
    }
}
