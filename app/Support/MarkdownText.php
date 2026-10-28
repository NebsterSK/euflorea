<?php

namespace App\Support;

/**
 * Neutralises user-supplied text so it renders literally inside Markdown mail.
 */
class MarkdownText
{
    /**
     * Escape Markdown control characters (and table pipes) in a value.
     *
     * With $multiline, line breaks are kept as hard breaks; otherwise they collapse to spaces.
     */
    public static function escape(?string $text, bool $multiline = false): string
    {
        $escaped = preg_replace('/[\\\\`*_{}\[\]()#+\-.!|<>~:&]/', '\\\\$0', (string) $text);
        $escaped = str_replace(["\r\n", "\r"], "\n", $escaped);

        return $multiline
            ? str_replace("\n", "  \n", $escaped)
            : trim(preg_replace('/\s*\n\s*/', ' ', $escaped));
    }
}
