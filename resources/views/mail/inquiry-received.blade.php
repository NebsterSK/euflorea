<x-mail::message>
# Nový dopyt z webu

**{{ \App\Support\MarkdownText::escape($inquiry->name) }}**
{{ $inquiry->email }}@if ($inquiry->phone) · {{ \App\Support\MarkdownText::escape($inquiry->phone) }}@endif


<x-mail::table>
| | |
|:--|:--|
| Dátum svadby | {{ $inquiry->date_unknown ? 'zatiaľ nevedia' : ($inquiry->wedding_date?->format('d.m.Y') ?? 'neuvedený') }} |
| Miesto | {{ \App\Support\MarkdownText::escape($inquiry->venue) ?: 'neuvedené' }} |
| Počet hostí | {{ $guests ?: 'neuvedené' }} |
| Čo ich zaujíma | {{ $services ? implode(', ', $services) : 'neuvedené' }} |
</x-mail::table>

**Ich predstava**

{{ \App\Support\MarkdownText::escape($inquiry->message, true) }}

<x-mail::button :url="$adminUrl">
Otvoriť dopyty
</x-mail::button>

Na tento e-mail môžete rovno odpovedať, odpoveď príde {{ \App\Support\MarkdownText::escape($inquiry->name) }}.
</x-mail::message>
