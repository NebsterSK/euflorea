import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import {
    CarouselStem,
    ChevronLeftIcon,
    ChevronRightIcon,
    DillSprig,
} from '@/components/site/icons';
import { Tape } from '@/components/site/paper';
import { buttonVariants } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

const autoplayDelay = 5500;

/**
 * `sizes` for a slide in the cover-cropped frame: the image is shown at the
 * larger of the frame width and frame height × its aspect ratio, so a
 * landscape photo in the tall phone frame needs a much wider file than the
 * frame itself. Frame: 440 / 540 / 640px tall; width is the viewport minus
 * gutters and the paper mat (max 1200px on desktop).
 */
function slideSizes(slide: App.Data.Site.ImageData): string {
    const aspect = slide.width / slide.height;
    const atHeight = (height: number) => `${Math.ceil(height * aspect)}px`;

    return [
        `(min-width: 1024px) max(min(100vw - 120px, 1200px), ${atHeight(640)})`,
        `(min-width: 768px) max(100vw - 52px, ${atHeight(540)})`,
        `max(100vw - 52px, ${atHeight(440)})`,
    ].join(', ');
}
const swipeThreshold = 40;

const arrowClassName = cn(
    buttonVariants({ variant: 'paper', size: 'round' }),
    'shrink-0',
);

/**
 * Homepage photo print with the approved flower-stem controls: one bud per
 * slide, the active one blooms. Crossfade + slow zoom-out, autoplay that
 * pauses while a mouse rests on the controls or keyboard focus is inside,
 * swipe and arrow keys.
 */
export function HeroCarousel({
    slides,
}: {
    slides: App.Data.Site.ImageData[];
}) {
    const [current, setCurrent] = useState(0);
    const [hasPainted, setHasPainted] = useState(false);
    // Two separate reasons to pause, so one ending never cancels the other.
    // Taps and clicks never pause: a clicked button keeps focus, and touch
    // devices emulate a hover that never ends, which used to stop autoplay.
    const [isHoveringControls, setIsHoveringControls] = useState(false);
    const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
    const isPaused = isHoveringControls || hasKeyboardFocus;
    const [isManual, setIsManual] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const swipeStart = useRef<number | null>(null);
    const count = slides.length;
    // Only the current slide and its neighbours get a src, so hidden slides
    // don't compete with the first paint; once loaded, a slide keeps its src.
    const [loadedSlides, setLoadedSlides] = useState<Set<number>>(
        () =>
            new Set([
                0,
                1 % Math.max(count, 1),
                (count - 1 + count) % Math.max(count, 1),
            ]),
    );
    const isNearCurrent = (index: number) =>
        index === current ||
        index === (current + 1) % count ||
        index === (current - 1 + count) % count;

    useEffect(() => {
        if (count === 0) {
            return;
        }

        setLoadedSlides((previous) => {
            const neighbours = [
                current,
                (current + 1) % count,
                (current - 1 + count) % count,
            ];

            if (neighbours.every((index) => previous.has(index))) {
                return previous;
            }

            return new Set([...previous, ...neighbours]);
        });
    }, [current, count]);

    // The active slide only zooms when its scale changes: start at 1.06 and
    // flip to 1 after the first paint, or the first slide sits still.
    useEffect(() => {
        let secondFrame = 0;
        const firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => setHasPainted(true));
        });

        return () => {
            cancelAnimationFrame(firstFrame);
            cancelAnimationFrame(secondFrame);
        };
    }, []);

    // Restarts after every slide change, so manual navigation resets the timer.
    useEffect(() => {
        if (count < 2 || isPaused || reducedMotion) {
            return;
        }

        const timer = window.setTimeout(() => {
            setIsManual(false);
            setCurrent((index) => (index + 1) % count);
        }, autoplayDelay);

        return () => window.clearTimeout(timer);
    }, [current, count, isPaused, reducedMotion]);

    const goTo = useCallback(
        (index: number) => {
            setIsManual(true);
            setCurrent((index + count) % count);
        },
        [count],
    );

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(current - 1);
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(current + 1);
        }
    };

    const handlePointerDown = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') {
            swipeStart.current = event.clientX;
        }
    };

    const handlePointerUp = (event: PointerEvent) => {
        if (swipeStart.current === null) {
            return;
        }

        const distance = event.clientX - swipeStart.current;
        swipeStart.current = null;

        if (Math.abs(distance) > swipeThreshold) {
            goTo(distance < 0 ? current + 1 : current - 1);
        }
    };

    if (count === 0) {
        return null;
    }

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Naše svadby"
            onKeyDown={handleKeyDown}
            onFocus={(event) =>
                setHasKeyboardFocus(event.target.matches(':focus-visible'))
            }
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setHasKeyboardFocus(false);
                }
            }}
            className="relative mx-auto max-w-page px-4 pt-9 lg:px-10 lg:pt-14 lg:pb-10"
        >
            <div className="relative -rotate-[0.6deg] bg-paper-card p-2.5 shadow-print-sm lg:-rotate-[0.4deg] lg:p-5 lg:shadow-print">
                <div
                    aria-live={isManual ? 'polite' : 'off'}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={() => (swipeStart.current = null)}
                    className="relative h-110 touch-pan-y overflow-hidden bg-photo-bg md:h-135 lg:h-160"
                >
                    {slides.map((slide, index) => {
                        const isActive = index === current;
                        const shouldLoad =
                            loadedSlides.has(index) || isNearCurrent(index);

                        return (
                            <img
                                key={slide.id}
                                src={shouldLoad ? slide.src : undefined}
                                srcSet={shouldLoad ? slide.srcset : undefined}
                                sizes={slideSizes(slide)}
                                width={slide.width}
                                height={slide.height}
                                alt={slide.alt}
                                aria-hidden={!isActive}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                fetchPriority={index === 0 ? 'high' : 'auto'}
                                decoding="async"
                                draggable={false}
                                style={{
                                    objectPosition: `${slide.focalX}% ${slide.focalY}%`,
                                }}
                                className={cn(
                                    'absolute inset-0 size-full object-cover transition-[opacity,scale] duration-[1200ms,7000ms] ease-[ease,ease-out] select-none motion-reduce:scale-100 motion-reduce:transition-none',
                                    isActive ? 'opacity-100' : 'opacity-0',
                                    isActive && hasPainted
                                        ? 'scale-100'
                                        : 'scale-106',
                                )}
                            />
                        );
                    })}
                </div>
                <Tape className="-top-2.5 left-7.5 h-6.5 w-22.5 -rotate-5 lg:-top-3.5 lg:left-15 lg:h-8.5 lg:w-32.5 lg:-rotate-4" />
                <Tape
                    tone="lilac"
                    className="-top-3 right-20 hidden h-8 w-27.5 rotate-5 lg:block"
                />
            </div>

            <DillSprig
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -left-1.5 hidden h-92.5 w-42.5 text-rose lg:block"
            />

            {count > 1 && (
                <div
                    onPointerEnter={(event) =>
                        event.pointerType === 'mouse' &&
                        setIsHoveringControls(true)
                    }
                    onPointerLeave={() => setIsHoveringControls(false)}
                    className="relative mx-auto -mt-8.5 flex w-fit -rotate-1 items-center gap-1.5 border border-rule-strong bg-paper-card px-2.5 pt-3 pb-2 shadow-float-sm lg:absolute lg:right-22 lg:-bottom-2 lg:mt-0 lg:rotate-[1.2deg] lg:gap-3 lg:px-4.5 lg:pt-3.5 lg:pb-2.5 lg:shadow-float"
                >
                    <Tape className="-top-3.25 left-1/2 h-6.5 w-23 -translate-x-1/2 -rotate-3" />
                    <button
                        type="button"
                        aria-label="Predchádzajúca fotka"
                        onClick={() => goTo(current - 1)}
                        className={arrowClassName}
                    >
                        <ChevronLeftIcon aria-hidden="true" />
                    </button>
                    <div className="relative flex items-end">
                        <CarouselStem
                            aria-hidden="true"
                            preserveAspectRatio="none"
                            className="absolute -inset-x-1.5 bottom-0.5 h-3.5 w-[calc(100%+12px)] text-rose"
                        />
                        {slides.map((slide, index) => (
                            <Bud
                                key={slide.id}
                                isActive={index === current}
                                hasLeaf={index % 2 === 1}
                                label={`Fotka ${index + 1} z ${count}`}
                                onClick={() => goTo(index)}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        aria-label="Ďalšia fotka"
                        onClick={() => goTo(current + 1)}
                        className={arrowClassName}
                    >
                        <ChevronRightIcon aria-hidden="true" />
                    </button>
                </div>
            )}
        </section>
    );
}

/**
 * One slide indicator: a closed bud on its stalk that blooms into a plum
 * flower when active.
 */
function Bud({
    isActive,
    hasLeaf,
    label,
    onClick,
}: {
    isActive: boolean;
    hasLeaf: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
            onClick={onClick}
            className="group relative z-10 h-15.5 w-8.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum lg:w-10"
        >
            <svg
                viewBox="0 0 40 62"
                fill="none"
                strokeLinecap="round"
                aria-hidden="true"
                className="mx-auto block h-15.5 w-8.5 overflow-visible transition-[rotate,translate] duration-400 group-hover:-translate-y-0.5 group-hover:-rotate-6 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0 lg:w-10"
            >
                <path
                    d="M20 58C18.5 49 21.5 41 20 31"
                    className="stroke-rose"
                    strokeWidth="1.2"
                />
                {hasLeaf && (
                    <path
                        d="M20 47c-4-1-7-4-7-8 4 0 7 3 7 8z"
                        className="fill-leaf stroke-rose"
                        strokeWidth="1"
                    />
                )}
                <g
                    className={cn(
                        'origin-bottom transition-[scale] duration-450 [transform-box:fill-box]',
                        isActive ? 'scale-0' : 'scale-100',
                    )}
                >
                    <path
                        d="M20 31C15.5 26.5 16 18 20 13C24 18 24.5 26.5 20 31z"
                        className="fill-bud stroke-rose"
                        strokeWidth="1"
                    />
                    <path
                        d="M20 31c-1.5-4-1.2-9 0-13"
                        className="stroke-rose"
                        strokeWidth=".8"
                    />
                </g>
                <g
                    className={cn(
                        'origin-center transition-[scale,rotate] duration-700 ease-bloom [transform-box:fill-box]',
                        isActive ? 'scale-100 rotate-0' : 'scale-0 -rotate-60',
                    )}
                >
                    <g className="fill-plum" opacity=".92">
                        {[0, 72, 144, 216, 288].map((angle) => (
                            <ellipse
                                key={angle}
                                cx="20"
                                cy="12.5"
                                rx="4.6"
                                ry="7.2"
                                transform={`rotate(${angle} 20 20)`}
                            />
                        ))}
                    </g>
                    <circle
                        cx="20"
                        cy="20"
                        r="3.6"
                        className="fill-pollen stroke-paper"
                        strokeWidth="1"
                    />
                </g>
            </svg>
        </button>
    );
}
