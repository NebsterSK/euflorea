<x-mail::message>
# Nový dopyt z webu

**{{ $inquiry->name }}**
{{ $inquiry->email }}@if ($inquiry->phone) · {{ $inquiry->phone }}@endif


<x-mail::table>
| | |
|:--|:--|
| Dátum svadby | {{ $inquiry->date_unknown ? 'zatiaľ nevedia' : ($inquiry->wedding_date?->format('d.m.Y') ?? '–') }} |
| Miesto | {{ $inquiry->venue ?: '–' }} |
| Počet hostí | {{ $guests ?: '–' }} |
| Čo ich zaujíma | {{ $services ? implode(', ', $services) : '–' }} |
</x-mail::table>

**Ich predstava**

{{ $inquiry->message }}

<x-mail::button :url="$adminUrl">
Otvoriť dopyty
</x-mail::button>

Na tento e-mail môžete rovno odpovedať, odpoveď príde {{ $inquiry->name }}.
</x-mail::message>
