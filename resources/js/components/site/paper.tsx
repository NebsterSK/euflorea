import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A strip of washi tape. Position, size and tilt come from `className`.
 */
export function Tape({
    tone = 'sand',
    className,
}: {
    tone?: 'sand' | 'lilac';
    className?: string;
}) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute block',
                tone === 'sand' ? 'bg-tape-sand' : 'bg-tape-lilac',
                className,
            )}
        />
    );
}

/**
 * A paper card: cream sheet with a dashed inner frame. Tilt comes from
 * `className` (deterministic values only, see DESIGN.md §5).
 */
export function PaperCard({
    className,
    innerClassName,
    children,
    ...props
}: ComponentProps<'div'> & { innerClassName?: string }) {
    return (
        <div
            className={cn(
                'bg-paper-card p-2 shadow-card-sm lg:p-3 lg:shadow-card',
                className,
            )}
            {...props}
        >
            <div
                className={cn(
                    'h-full border border-dashed border-rule-strong',
                    innerClassName,
                )}
            >
                {children}
            </div>
        </div>
    );
}

/**
 * The taped paper sheet ("Ako to rastie" card, contact form): paper at 96%,
 * two tape strips, a slight tilt.
 */
export function TapedSheet({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'relative -rotate-[0.6deg] bg-paper/96 shadow-sheet-sm lg:-rotate-[0.4deg] lg:shadow-sheet',
                className,
            )}
        >
            <Tape className="-top-3.5 left-6 h-8 w-30 -rotate-4 lg:left-12" />
            <Tape
                tone="lilac"
                className="-top-3 right-7 h-7.5 w-25 rotate-5 lg:right-14"
            />
            {children}
        </div>
    );
}

/**
 * Small uppercase label above headings.
 */
export function Eyebrow({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <p
            className={cn(
                'text-eyebrow text-rose-text uppercase md:text-xs',
                className,
            )}
        >
            {children}
        </p>
    );
}
