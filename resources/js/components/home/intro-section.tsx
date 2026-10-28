import { Link } from '@inertiajs/react';
import { DillSprig } from '@/components/site/icons';
import { Eyebrow } from '@/components/site/paper';
import { index as galleryIndex } from '@/routes/gallery';

export function IntroSection() {
    return (
        <section className="relative mx-auto grid max-w-page gap-5 px-6 pt-20 pb-18 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-10 lg:pt-37.5 lg:pb-32.5">
            <DillSprig
                withSideBranch={false}
                aria-hidden="true"
                className="pointer-events-none absolute top-7.5 -right-3.5 h-55 w-25 draw-in text-rose opacity-80 lg:hidden"
            />
            <div className="flex reveal flex-col gap-5">
                <Eyebrow>O nás</Eyebrow>
                <h2 className="max-w-75 font-serif text-[44px] leading-[1.02] text-balance text-plum lg:max-w-none lg:text-[clamp(44px,5vw,72px)]">
                    Kvety, ktoré <em>rozprávajú</em> váš príbeh.
                </h2>
            </div>
            <div className="flex reveal flex-col gap-5.5 pt-2 text-lead text-text lg:pt-11 lg:text-lead-lg">
                <p>
                    Sme Euflorea, malé kvetinové štúdio, ktoré navrhuje a
                    realizuje svadobnú výzdobu. Pracujeme so sezónnymi kvetmi a
                    každú výzdobu ladíme na mieru vašej svadbe.
                </p>
                <p>
                    Od kytice pre nevestu až po obrad a hostinu. Každú svadbu
                    staviame okolo kvetov, ktoré k vám naozaj patria.
                </p>
                <Link
                    href={galleryIndex()}
                    className="self-start py-2.5 font-serif text-[21px] leading-[1.3] text-plum italic underline decoration-1 underline-offset-6 transition-colors hover:text-plum-hover lg:py-0 lg:text-[22px]"
                >
                    Pozrite si naše svadby →
                </Link>
            </div>
        </section>
    );
}
