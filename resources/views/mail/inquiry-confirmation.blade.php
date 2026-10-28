<x-mail::message>
# Ďakujeme, {{ \App\Support\MarkdownText::escape($inquiry->name) }}!

Vašu správu sme dostali a ozveme sa vám do dvoch dní.

Pre istotu posielame, čo ste nám napísali:

{{ \App\Support\MarkdownText::escape($inquiry->message, true) }}

S pozdravom,<br>
Euflorea, svadobný a kvetinový styling
</x-mail::message>
