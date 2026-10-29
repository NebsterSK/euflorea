import type { SVGProps } from 'react';

/**
 * Hand-drawn line art and icons (sources in `resources/images/svg`) as React
 * components, so they inherit `currentColor` and accept classes. Decorative
 * by default: pass `aria-hidden` or a label from the call site. Each
 * botanical drawing is a single path with `pathLength={1}` so `draw-in` can
 * draw it.
 */
type IconProps = SVGProps<SVGSVGElement>;

const line = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

/** A circle as path data, so it can join a drawing's single path. */
function dot(centerX: number, centerY: number, radius: number): string {
    return `M${centerX - radius} ${centerY}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
}

/**
 * Joins a drawing's strokes into one path, drawn in this order by `draw-in`:
 * one shape keeps the per-frame cost of the animation low.
 */
function strokes(...parts: (string | false)[]): string {
    return parts.filter(Boolean).join(' ');
}

export function ChevronLeftIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...line} strokeWidth={1.5} {...props}>
            <path d="M15 5l-7 7 7 7" />
        </svg>
    );
}

export function ChevronRightIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...line} strokeWidth={1.5} {...props}>
            <path d="M9 5l7 7-7 7" />
        </svg>
    );
}

export function InstagramIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...line} strokeWidth={1.4} {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    );
}

export function FacebookIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...line} strokeWidth={1.4} {...props}>
            <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z" />
        </svg>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...line} strokeWidth={1.3} {...props}>
            <path d="M3 8h18M7 16h14" />
        </svg>
    );
}

export function HeartIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 22" {...props}>
            <path
                className="fill-heart"
                d="M12 21C5 15.5 1 11.8 1 7.2 1 3.8 3.6 1 7 1c2.1 0 3.9 1.1 5 2.8C13.1 2.1 14.9 1 17 1c3.4 0 6 2.8 6 6.2 0 4.6-4 8.3-11 13.8z"
            />
        </svg>
    );
}

export function BouquetIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 48 48" {...line} strokeWidth={1.1} {...props}>
            <path
                pathLength={1}
                d={strokes(
                    dot(18, 12, 5),
                    dot(29, 10, 4),
                    dot(33, 19, 4.5),
                    dot(23, 20, 4),
                    'M14 17c-2 3 0 6 4 6M20 24l4 18M24 24v18M28 23l-4 19',
                    'M17 30c4 2 10 2 14 0l-3 5h-8z',
                )}
            />
        </svg>
    );
}

export function CeremonyArchIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 48 48" {...line} strokeWidth={1.1} {...props}>
            <path
                pathLength={1}
                d={strokes(
                    'M10 42V22a14 14 0 0 1 28 0v20',
                    'M6 42h36',
                    dot(12, 20, 2.5),
                    dot(15, 13, 2),
                    dot(21, 9, 2.5),
                    dot(28, 9, 2),
                    dot(34, 14, 2.5),
                    'M13 25c-2-1-3-3-2-5M36 20c2 1 2 3 1 5',
                )}
            />
        </svg>
    );
}

export function TableIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 48 48" {...line} strokeWidth={1.1} {...props}>
            <path
                pathLength={1}
                d={strokes(
                    'M6 30h36M10 30l-2 12M38 30l2 12',
                    'M16 30V18M16 18c-1-2 0-4 0-5 0 1 1 3 0 5',
                    'M32 30V16M32 16c-1-2 0-4 0-5 0 1 1 3 0 5',
                    'M20 30c0-4 2-7 4-7s4 3 4 7',
                    dot(24, 19, 3),
                )}
            />
        </svg>
    );
}

export function VenueVaseIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 48 48" {...line} strokeWidth={1.1} {...props}>
            <path
                pathLength={1}
                d={strokes(
                    'M18 42h12M19 42c-3-4-3-9 0-12h10c3 3 3 8 0 12',
                    'M24 30V14M24 22c-4-1-6-4-6-8 4 1 6 4 6 8zM24 18c3-1 5-4 5-7-3 1-5 3-5 7',
                    'M24 14c-1-3 0-6 0-8',
                    dot(24, 5, 1.5),
                )}
            />
        </svg>
    );
}

/**
 * The dill (umbel) sprig from the logo. `withSideBranch` adds the lower left
 * umbel used on the large desktop sprig.
 */
export function DillSprig({
    withSideBranch = true,
    ...props
}: IconProps & { withSideBranch?: boolean }) {
    return (
        <svg viewBox="0 0 120 260" {...line} strokeWidth={1.1} {...props}>
            <path
                pathLength={1}
                d={strokes(
                    'M60 258C58 200 62 140 58 60',
                    'M58 60l-14-18M58 60l-6-22M58 60l2-23M58 60l10-20M58 60l17-14',
                    dot(44, 41, 2.2),
                    dot(52, 37, 2.2),
                    dot(60, 36, 2.2),
                    dot(68, 39, 2.2),
                    dot(75, 45, 2.2),
                    'M59 150c10-20 20-36 34-48',
                    'M93 102l-10-12M93 102l-2-15M93 102l6-13M93 102l12-7',
                    dot(83, 89, 2),
                    dot(91, 86, 2),
                    dot(99, 88, 2),
                    dot(105, 94, 2),
                    withSideBranch && 'M59 180c-10-16-22-28-36-34',
                    withSideBranch &&
                        'M23 146l-6-12M23 146l2-14M23 146l9-10M23 146l-12-4',
                    withSideBranch && dot(17, 133, 1.8),
                    withSideBranch && dot(25, 131, 1.8),
                    withSideBranch && dot(32, 135, 1.8),
                    withSideBranch && dot(11, 141, 1.8),
                )}
            />
        </svg>
    );
}

export function CarouselStem(props: IconProps) {
    return (
        <svg
            viewBox="0 0 300 16"
            preserveAspectRatio="none"
            {...line}
            strokeWidth={1.3}
            {...props}
        >
            <path d="M0 8C25 2 45 14 75 8S120 2 150 8s50 7 75 1 50-6 75 0" />
        </svg>
    );
}

export function VineVertical(props: IconProps) {
    return (
        <svg
            viewBox="0 0 20 400"
            preserveAspectRatio="none"
            {...line}
            strokeWidth={1.2}
            {...props}
        >
            <path
                pathLength={1}
                d="M10 0C0 50 20 100 10 150S0 250 10 300s10 60 0 100"
            />
        </svg>
    );
}
