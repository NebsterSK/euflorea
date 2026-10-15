import { Head, usePage } from '@inertiajs/react';
import { createElement, useMemo } from 'react';
import type { ReactElement } from 'react';

const allowedTags = new Set(['title', 'meta', 'link', 'script']);

/**
 * Re-renders the head tags built on the server (laravel/head, shared as the
 * `head` prop) through Inertia's <Head>, so title, description, canonical,
 * Open Graph and JSON-LD stay correct after client-side navigation too.
 */
export function ServerHead() {
    const { head } = usePage<{ head?: string[] }>().props;

    const elements = useMemo(() => {
        if (!head?.length) {
            return [];
        }

        const parsed = new DOMParser().parseFromString(
            `<head>${head.join('')}</head>`,
            'text/html',
        );

        return Array.from(parsed.head.children)
            .filter((node) => allowedTags.has(node.tagName.toLowerCase()))
            .map((node, position): ReactElement => {
                const tag = node.tagName.toLowerCase();
                const props: Record<string, string> = {
                    key: node.getAttribute('data-inertia') ?? `${tag}-${position}`,
                };

                for (const attribute of Array.from(node.attributes)) {
                    if (attribute.name === 'data-inertia') {
                        props['head-key'] = attribute.value;
                    } else {
                        props[attribute.name === 'class' ? 'className' : attribute.name] =
                            attribute.value;
                    }
                }

                if (tag === 'script') {
                    return createElement(tag, {
                        ...props,
                        dangerouslySetInnerHTML: { __html: node.textContent ?? '' },
                    });
                }

                return createElement(tag, props, tag === 'title' ? node.textContent : undefined);
            });
    }, [head]);

    return <Head>{elements}</Head>;
}
