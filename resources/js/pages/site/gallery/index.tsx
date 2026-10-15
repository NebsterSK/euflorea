import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AlbumCard } from '@/components/gallery/album-card';
import { CtaSection } from '@/components/site/cta-section';
import { DillSprig } from '@/components/site/icons';
import { Eyebrow, PaperCard } from '@/components/site/paper';
import { cn } from '@/lib/utils';

const filters = [
    { value: null, label: 'Všetko' },
    { value: 'wedding', label: 'Svadby' },
    { value: 'editorial', label: 'Editoriály' },
] as const;

export default function GalleryIndex({
    albums,
}: {
    albums: App.Data.Site.AlbumCardData[];
}) {
    const { social } = usePage().props;
    const [type, setType] = useState<App.Enums.AlbumType | null>(null);
    const visible = type ? albums.filter((album) => album.type === type) : albums;
    const hasBothTypes =
        albums.some((album) => album.type === 'wedding') &&
        albums.some((album) => album.type === 'editorial');

    return (
        <>

            <section className="mx-auto flex max-w-page flex-col gap-5 px-6 pt-16 pb-12 lg:px-10 lg:pt-24 lg:pb-16">
                <Eyebrow>Galéria</Eyebrow>
                <h1 className="font-serif text-[44px] leading-[1.02] text-balance text-plum lg:text-[clamp(44px,5vw,72px)]">
                    Naše <em>svadby</em>
                </h1>
                <p className="max-w-[60ch] text-lead text-text lg:text-lead-lg">
                    Každá svadba je iná. Pozrite sa, ako sme ich obliekli do
                    kvetov.
                </p>
            </section>

            <div className="mx-auto max-w-page px-4 pb-10 lg:px-10">
                {hasBothTypes && (
                    <div
                        role="group"
                        aria-label="Filtrovať albumy"
                        className="mb-10 flex flex-wrap gap-x-7 gap-y-1 border-b border-rule px-2 lg:px-0"
                    >
                        {filters.map((filter) => (
                            <button
                                key={filter.label}
                                type="button"
                                aria-pressed={type === filter.value}
                                onClick={() => setType(filter.value)}
                                className={cn(
                                    '-mb-px border-b border-transparent px-0.5 py-3 text-nav text-plum uppercase transition-colors hover:border-plum',
                                    type === filter.value && 'border-plum',
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                )}

                {albums.length === 0 ? (
                    <PaperCard
                        className="mx-auto max-w-xl -rotate-[0.6deg]"
                        innerClassName="relative flex flex-col items-center gap-5 overflow-hidden px-6 py-14 text-center"
                    >
                        <DillSprig
                            withSideBranch={false}
                            aria-hidden="true"
                            className="h-28 w-14 text-rose"
                        />
                        <p className="font-serif text-[28px] leading-tight text-plum">
                            Čoskoro tu pribudnú naše svadby.
                        </p>
                        {social.instagram.url && (
                            <a
                                href={social.instagram.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-serif text-[21px] text-plum italic underline decoration-1 underline-offset-6 hover:text-plum-hover"
                            >
                                Zatiaľ nás nájdete na Instagrame →
                            </a>
                        )}
                    </PaperCard>
                ) : (
                    <ul className="grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 xl:grid-cols-3 xl:gap-x-10">
                        {visible.map((album, position) => (
                            <li key={album.slug}>
                                <AlbumCard album={album} position={position} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <CtaSection />
        </>
    );
}
