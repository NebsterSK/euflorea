import { useSyncExternalStore } from 'react';

const twoColumnQuery = '(min-width: 768px)';
const threeColumnQuery = '(min-width: 1024px)';

function subscribe(onChange: () => void): () => void {
    const queries = [twoColumnQuery, threeColumnQuery].map((query) =>
        window.matchMedia(query),
    );
    queries.forEach((media) => media.addEventListener('change', onChange));

    return () =>
        queries.forEach((media) =>
            media.removeEventListener('change', onChange),
        );
}

function getColumnCount(): number {
    if (window.matchMedia(threeColumnQuery).matches) {
        return 3;
    }

    return window.matchMedia(twoColumnQuery).matches ? 2 : 1;
}

/**
 * The photo grid's column count, matching Tailwind's `md` and `lg` breakpoints.
 */
export function useGalleryColumns(): number {
    return useSyncExternalStore(subscribe, getColumnCount, () => 1);
}
