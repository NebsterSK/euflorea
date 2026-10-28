import type { SVGProps } from 'react';

/**
 * Hand-drawn line art and icons (sources in `resources/images/svg`) as React
 * components, so they inherit `currentColor` and accept classes. Decorative
 * by default: pass `aria-hidden` or a label from the call site. Shapes of
 * the botanical drawings carry `pathLength={1}` so `draw-in` can draw them.
 */
type IconProps = SVGProps<SVGSVGElement>;

const line = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

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
            <circle pathLength={1} cx="18" cy="12" r="5" />
            <circle pathLength={1} cx="29" cy="10" r="4" />
            <circle pathLength={1} cx="33" cy="19" r="4.5" />
            <circle pathLength={1} cx="23" cy="20" r="4" />
            <path
                pathLength={1}
                d="M14 17c-2 3 0 6 4 6M20 24l4 18M24 24v18M28 23l-4 19"
            />
            <path pathLength={1} d="M17 30c4 2 10 2 14 0l-3 5h-8z" />
        </svg>
    );
}

export function CeremonyArchIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 48 48" {...line} strokeWidth={1.1} {...props}>
            <path pathLength={1} d="M10 42V22a14 14 0 0 1 28 0v20" />
            <path pathLength={1} d="M6 42h36" />
            <circle pathLength={1} cx="12" cy="20" r="2.5" />
            <circle pathLength={1} cx="15" cy="13" r="2" />
            <circle pathLength={1} cx="21" cy="9" r="2.5" />
            <circle pathLength={1} cx="28" cy="9" r="2" />
            <circle pathLength={1} cx="34" cy="14" r="2.5" />
            <path pathLength={1} d="M13 25c-2-1-3-3-2-5M36 20c2 1 2 3 1 5" />
        </svg>
    );
}

export function TableIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 48 48" {...line} strokeWidth={1.1} {...props}>
            <path pathLength={1} d="M6 30h36M10 30l-2 12M38 30l2 12" />
            <path pathLength={1} d="M16 30V18M16 18c-1-2 0-4 0-5 0 1 1 3 0 5" />
            <path pathLength={1} d="M32 30V16M32 16c-1-2 0-4 0-5 0 1 1 3 0 5" />
            <path pathLength={1} d="M20 30c0-4 2-7 4-7s4 3 4 7" />
            <circle pathLength={1} cx="24" cy="19" r="3" />
        </svg>
    );
}

export function VenueVaseIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 48 48" {...line} strokeWidth={1.1} {...props}>
            <path
                pathLength={1}
                d="M18 42h12M19 42c-3-4-3-9 0-12h10c3 3 3 8 0 12"
            />
            <path
                pathLength={1}
                d="M24 30V14M24 22c-4-1-6-4-6-8 4 1 6 4 6 8zM24 18c3-1 5-4 5-7-3 1-5 3-5 7"
            />
            <path pathLength={1} d="M24 14c-1-3 0-6 0-8" />
            <circle pathLength={1} cx="24" cy="5" r="1.5" />
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
            <path pathLength={1} d="M60 258C58 200 62 140 58 60" />
            <path
                pathLength={1}
                d="M58 60l-14-18M58 60l-6-22M58 60l2-23M58 60l10-20M58 60l17-14"
            />
            <circle pathLength={1} cx="44" cy="41" r="2.2" />
            <circle pathLength={1} cx="52" cy="37" r="2.2" />
            <circle pathLength={1} cx="60" cy="36" r="2.2" />
            <circle pathLength={1} cx="68" cy="39" r="2.2" />
            <circle pathLength={1} cx="75" cy="45" r="2.2" />
            <path pathLength={1} d="M59 150c10-20 20-36 34-48" />
            <path
                pathLength={1}
                d="M93 102l-10-12M93 102l-2-15M93 102l6-13M93 102l12-7"
            />
            <circle pathLength={1} cx="83" cy="89" r="2" />
            <circle pathLength={1} cx="91" cy="86" r="2" />
            <circle pathLength={1} cx="99" cy="88" r="2" />
            <circle pathLength={1} cx="105" cy="94" r="2" />
            {withSideBranch && (
                <>
                    <path pathLength={1} d="M59 180c-10-16-22-28-36-34" />
                    <path
                        pathLength={1}
                        d="M23 146l-6-12M23 146l2-14M23 146l9-10M23 146l-12-4"
                    />
                    <circle pathLength={1} cx="17" cy="133" r="1.8" />
                    <circle pathLength={1} cx="25" cy="131" r="1.8" />
                    <circle pathLength={1} cx="32" cy="135" r="1.8" />
                    <circle pathLength={1} cx="11" cy="141" r="1.8" />
                </>
            )}
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
