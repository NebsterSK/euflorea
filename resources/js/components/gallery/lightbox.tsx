import * as DialogPrimitive from '@radix-ui/react-dialog';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/site/icons';
import { buttonVariants } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * `sizes` for a contained photo: it is limited by the free width or by the
 * free height × its aspect ratio, whichever is smaller, so a portrait photo
 * on a wide screen doesn't download the full-width file. The subtracted
 * values are the top bar, arrows and padding (slightly under-estimated).
 */
function lightboxSizes(photo: App.Data.Site.ImageData): string {
    const aspect = (photo.width / photo.height).toFixed(3);

    return [
        `(min-width: 1024px) min(100vw - 192px, (100vh - 120px) * ${aspect})`,
        `min(100vw - 32px, (100vh - 150px) * ${aspect})`,
    ].join(', ');
}

const arrowClassName = cn(
    buttonVariants({ variant: 'paper', size: 'round' }),
    'bg-paper-card',
);

/**
 * Full-screen photo viewer on paper: swipe, arrow buttons, ← → and Esc,
 * focus trapped inside; focus returns to the opener on close (handled by
 * the caller through `onClose`).
 */
export function Lightbox({
    photos,
    startIndex,
    open,
    onOpenChange,
    onCloseAutoFocus,
    title,
}: {
    photos: App.Data.Site.ImageData[];
    startIndex: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseAutoFocus: (event: Event) => void;
    title: string;
}) {
    const reducedMotion = usePrefersReducedMotion();
    const [viewportRef, embla] = useEmblaCarousel({
        startIndex,
        loop: photos.length > 1,
        duration: reducedMotion ? 0 : 22,
    });
    const [current, setCurrent] = useState(startIndex);

    useEffect(() => {
        if (!embla) {
            return;
        }

        const update = () => setCurrent(embla.selectedScrollSnap());
        update();
        embla.on('select', update);

        return () => {
            embla.off('select', update);
        };
    }, [embla]);

    const previous = useCallback(() => embla?.scrollPrev(), [embla]);
    const next = useCallback(() => embla?.scrollNext(), [embla]);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            previous();
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            next();
        }
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-paper/96 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    onKeyDown={handleKeyDown}
                    onCloseAutoFocus={onCloseAutoFocus}
                    aria-roledescription="galéria"
                    className="fixed inset-0 z-50 flex flex-col outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
                >
                    <DialogPrimitive.Title className="sr-only">
                        {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Prehliadanie fotiek. Šípkami vľavo a vpravo prepínate,
                        klávesom Escape zavriete.
                    </DialogPrimitive.Description>

                    <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-5">
                        <p
                            className="font-serif text-xl text-plum italic tabular-nums"
                            aria-live="polite"
                        >
                            {current + 1} / {photos.length}
                        </p>
                        <DialogPrimitive.Close
                            className={cn(
                                buttonVariants({ variant: 'paper', size: 'header' }),
                            )}
                        >
                            Zavrieť
                        </DialogPrimitive.Close>
                    </div>

                    <div ref={viewportRef} className="min-h-0 flex-1 overflow-hidden">
                        <div className="flex h-full touch-pan-y">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    role="group"
                                    aria-roledescription="fotka"
                                    aria-label={`${index + 1} z ${photos.length}`}
                                    className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center px-4 pb-4 lg:px-24 lg:pb-8"
                                >
                                    <img
                                        src={photo.src}
                                        srcSet={photo.srcset}
                                        sizes={lightboxSizes(photo)}
                                        width={photo.width}
                                        height={photo.height}
                                        alt={photo.alt}
                                        loading={
                                            Math.abs(index - current) <= 1
                                                ? 'eager'
                                                : 'lazy'
                                        }
                                        decoding="async"
                                        draggable={false}
                                        className="h-auto max-h-full w-auto max-w-full bg-paper-card p-1.5 shadow-print select-none lg:p-2.5"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {photos.length > 1 && (
                        <div className="flex items-center justify-center gap-6 px-4 py-4 lg:pointer-events-none lg:absolute lg:inset-x-8 lg:top-1/2 lg:-translate-y-1/2 lg:justify-between lg:p-0">
                            <button
                                type="button"
                                aria-label="Predchádzajúca fotka"
                                onClick={previous}
                                className={cn(arrowClassName, 'lg:pointer-events-auto')}
                            >
                                <ChevronLeftIcon aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Ďalšia fotka"
                                onClick={next}
                                className={cn(arrowClassName, 'lg:pointer-events-auto')}
                            >
                                <ChevronRightIcon aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
