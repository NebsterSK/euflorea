import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * Fraction of the remaining distance covered each frame, the one knob for
 * how the page feels: 0.22 is a light touch that lands in ~120ms, 0.10 floats
 * for most of a second. The public site is calm and photo-led, so it glides.
 */
const lerp = 0.12;

/** Pixels left at which the remainder is jumped, so the glide ends cleanly. */
const snapDistance = 0.5;

/** Firefox reports notched wheels in lines, not pixels. */
const pixelsPerLine = 40;

/** True if the wheel is over something that can still scroll itself this way. */
function isOverScrollable(node: EventTarget | null, deltaY: number): boolean {
    let element = node instanceof Element ? node : null;

    while (
        element &&
        element !== document.body &&
        element !== document.documentElement
    ) {
        const { overflowY } = getComputedStyle(element);

        if (
            (overflowY === 'auto' || overflowY === 'scroll') &&
            element.scrollHeight > element.clientHeight
        ) {
            const isAtTop = element.scrollTop <= 0;
            const isAtBottom =
                element.scrollTop + element.clientHeight >=
                element.scrollHeight - 1;

            if (!((deltaY < 0 && isAtTop) || (deltaY > 0 && isAtBottom))) {
                return true;
            }
        }

        element = element.parentElement;
    }

    return false;
}

/**
 * Eased mouse-wheel scrolling for the public site (same approach as the
 * legacy-upgrade site, tuned stronger). It drives the real window scroll, so
 * scroll-driven CSS (the "Ako to rastie" parallax), sticky elements and
 * Inertia's scroll reset keep working.
 *
 * It only smooths a notched mouse wheel and stays out of the way of
 * trackpads and touch (the OS already smooths those), ctrl/cmd + wheel
 * (zoom), anything scrollable under the cursor, a locked body (Radix sets
 * `data-scroll-locked` while the lightbox or the mobile menu is open) and
 * visitors who prefer reduced motion.
 */
export function useSmoothScroll(): void {
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (reducedMotion) {
            return;
        }

        let frame = 0;
        let target = window.scrollY;
        const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');

        const maxScroll = () =>
            document.documentElement.scrollHeight - window.innerHeight;

        // Tracked as a float: `scrollY` is rounded to whole pixels at 1x zoom,
        // so re-reading it would stall the glide once a step drops under 0.5px.
        let position = window.scrollY;

        const step = () => {
            const distance = target - position;

            if (Math.abs(distance) < snapDistance) {
                window.scrollTo({ top: target, behavior: 'instant' });
                frame = 0;

                return;
            }

            position += distance * lerp;
            window.scrollTo({ top: position, behavior: 'instant' });
            frame = requestAnimationFrame(step);
        };

        /** Hand the scroll back: a finger, a key or a page visit is driving now. */
        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
        };

        const handleWheel = (event: WheelEvent) => {
            if (
                !mouse.matches ||
                event.ctrlKey ||
                event.metaKey ||
                document.body.hasAttribute('data-scroll-locked')
            ) {
                return;
            }

            let delta: number;

            if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
                delta = event.deltaY * pixelsPerLine;
            } else if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
                // Chromium reports a notched wheel as multiples of 120 here and
                // something irregular for a trackpad, which is left alone.
                const rawDelta = (
                    event as WheelEvent & { wheelDeltaY?: number }
                ).wheelDeltaY;

                if (!rawDelta || Math.abs(rawDelta) % 120 !== 0) {
                    return;
                }

                delta = event.deltaY;
            } else {
                return;
            }

            if (isOverScrollable(event.target, delta)) {
                return;
            }

            event.preventDefault();

            // Idle means the last move came from elsewhere (scrollbar, keys,
            // a page visit), so start from where the page really is.
            if (!frame) {
                target = window.scrollY;
                position = window.scrollY;
            }

            target = Math.min(maxScroll(), Math.max(0, target + delta));

            if (!frame) {
                frame = requestAnimationFrame(step);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', stop, { passive: true });
        window.addEventListener('keydown', stop);
        // A page visit resets the scroll; a running glide would drag it back.
        const removeVisitListener = router.on('start', stop);

        return () => {
            removeVisitListener();
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', stop);
            window.removeEventListener('keydown', stop);
            stop();
        };
    }, [reducedMotion]);
}
