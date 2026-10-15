import logoUrl from '@/../images/brand/logo-plum.png';
import { cn } from '@/lib/utils';

/**
 * The Euflorea wordmark (image) with the optional tagline as real text,
 * sized relative to the logo width through a container query.
 */
export function Logo({
    withTagline = false,
    className,
}: {
    withTagline?: boolean;
    className?: string;
}) {
    return (
        <span className={cn('@container block', className)}>
            <img
                src={logoUrl}
                alt="Euflorea"
                width={891}
                height={249}
                className="block h-auto w-full"
            />
            {withTagline && (
                <span className="mt-[4.5cqi] -mr-[0.2em] block text-center font-sans text-[clamp(0.75rem,2.6cqi,1.25rem)] leading-tight font-normal tracking-[0.2em] text-plum uppercase">
                    Svadobný a kvetinový styling
                </span>
            )}
        </span>
    );
}
