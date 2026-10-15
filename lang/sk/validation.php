<?php

/*
|--------------------------------------------------------------------------
| Slovak validation messages
|--------------------------------------------------------------------------
|
| The rules this application uses. Anything missing falls back to English.
|
*/

return [
    'accepted' => 'Pole :attribute je potrebné potvrdiť.',
    'after_or_equal' => ':Attribute musí byť dnes alebo neskôr.',
    'array' => ':Attribute musí byť zoznam.',
    'between' => [
        'numeric' => ':Attribute musí byť medzi :min a :max.',
        'string' => ':Attribute musí mať :min až :max znakov.',
    ],
    'boolean' => ':Attribute musí byť áno alebo nie.',
    'date' => ':Attribute nie je platný dátum.',
    'distinct' => ':Attribute obsahuje duplicitnú hodnotu.',
    'email' => 'Zadajte platnú e-mailovú adresu.',
    'enum' => 'Vybraná hodnota poľa :attribute je neplatná.',
    'exists' => 'Vybraná hodnota poľa :attribute neexistuje.',
    'file' => ':Attribute musí byť súbor.',
    'image' => ':Attribute musí byť obrázok.',
    'in' => 'Vybraná hodnota poľa :attribute je neplatná.',
    'integer' => ':Attribute musí byť celé číslo.',
    'max' => [
        'array' => ':Attribute môže mať najviac :max položiek.',
        'file' => ':Attribute môže mať najviac :max kB.',
        'numeric' => ':Attribute môže byť najviac :max.',
        'string' => ':Attribute môže mať najviac :max znakov.',
    ],
    'mimes' => ':Attribute musí byť súbor typu: :values.',
    'min' => [
        'numeric' => ':Attribute musí byť aspoň :min.',
        'string' => ':Attribute musí mať aspoň :min znakov.',
    ],
    'prohibited' => 'Pole :attribute musí zostať prázdne.',
    'regex' => 'Formát poľa :attribute je neplatný.',
    'required' => 'Vyplňte pole :attribute.',
    'required_unless' => 'Vyplňte pole :attribute.',
    'string' => ':Attribute musí byť text.',
    'unique' => 'Takú hodnotu poľa :attribute už používa iný záznam.',
    'uploaded' => ':Attribute sa nepodarilo nahrať.',

    'attributes' => [
        'title' => 'názov',
        'slug' => 'adresa',
        'type' => 'typ',
        'wedding_date' => 'dátum svadby',
        'location' => 'miesto',
        'description' => 'popis',
        'photo' => 'fotka',
        'photo_id' => 'fotka',
        'alt' => 'popis fotky',
        'focal_x' => 'bod záujmu',
        'focal_y' => 'bod záujmu',
        'name' => 'meno a priezvisko',
        'email' => 'e-mail',
        'phone' => 'telefón',
        'venue' => 'miesto svadby',
        'guests' => 'počet hostí',
        'services' => 'služby',
        'message' => 'vaša predstava',
        'consent' => 'súhlas so spracovaním osobných údajov',
    ],
];
