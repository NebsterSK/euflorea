import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Marks every `draw-in` / `draw-wipe` drawing with `data-drawn` once it is
 * on screen. On touch devices the CSS plays the drawing once from that
 * attribute instead of scrubbing it with the scroll (see `app.css`); mouse
 * devices ignore it. Re-scans after every page visit, since the site layout
 * persists.
 */
export function useDrawIn(): void {
    const { url } = usePage();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.setAttribute('data-drawn', '');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -15% 0px' },
        );

        document
            .querySelectorAll('.draw-in:not([data-drawn]), .draw-wipe:not([data-drawn])')
            .forEach((drawing) => observer.observe(drawing));

        return () => observer.disconnect();
    }, [url]);
}
