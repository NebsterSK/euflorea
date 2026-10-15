import { Head, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Lightbox } from '@/components/gallery/lightbox';
import { CtaSection } from '@/components/site/cta-section';
import { Eyebrow } from '@/components/site/paper';
import { index, show } from '@/routes/gallery';

export default function GalleryShow({
    album,
    next,
}: {
    album: App.Data.Site.AlbumPageData;
    next: App.Data.Site.AlbumLinkData | null;
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const triggers = useRef<(HTMLButtonElement | null)[]>([]);
    const lastOpened = useRef(0);

    const description =
        album.description ??
        `${album.typeLabel} ${album.title}: kvety a výzdoba od Euflorea.`;

    return (
        <>
            <Head title={album.title}>
                <meta name="description" content={description} />
            </Head>

            <header className="mx-auto flex max-w-page flex-col gap-4 px-6 pt-12 pb-10 lg:px-10 lg:pt-20 lg:pb-14">
                <Link
                    href={index()}
                    className="mb-4 self-start py-2 font-serif text-[21px] leading-[1.3] text-plum italic underline decoration-1 underline-offset-6 transition-colors hover:text-plum-hover lg:text-[22px]"
                >
                    ← Všetky svadby
                </Link>
                <Eyebrow>{album.typeLabel}</Eyebrow>
                <h1 className="font-serif text-[44px] leading-[1.02] text-balance text-plum lg:text-[clamp(44px,5vw,72px)]">
                    {album.title}
                </h1>
                {album.meta && (
                    <p className="text-eyebrow text-rose-text uppercase md:text-xs">
                        {album.meta}
                    </p>
                )}
                {album.description && (
                    <p className="mt-2 max-w-[60ch] text-lead text-text lg:text-lead-lg">
                        {album.description}
                    </p>
                )}
            </header>

            <div className="mx-auto max-w-page px-4 lg:px-10">
                <ul className="columns-1 gap-4 md:columns-2 lg:columns-3 lg:gap-6">
                    {album.photos.map((photo, position) => (
                        <li
                            key={photo.id}
                            className="mb-4 break-inside-avoid lg:mb-6"
                        >
                            <button
                                ref={(element) => {
                                    triggers.current[position] = element;
                                }}
                                type="button"
                                onClick={() => {
                                    lastOpened.current = position;
                                    setOpenIndex(position);
                                }}
                                aria-label={`Zväčšiť fotku ${position + 1} z ${album.photos.length}${photo.alt ? `: ${photo.alt}` : ''}`}
                                className="block w-full bg-paper-card p-1.5 shadow-card-sm transition-[translate,box-shadow] duration-500 ease-soft hover:-translate-y-0.5 hover:shadow-card lg:p-2"
                            >
                                <img
                                    src={photo.src}
                                    srcSet={photo.srcset}
                                    sizes="(min-width: 1320px) 400px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
                                    width={photo.width}
                                    height={photo.height}
                                    alt={photo.alt}
                                    loading={position < 3 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    className="block h-auto w-full bg-photo-bg"
                                />
                            </button>
                        </li>
                    ))}
                </ul>

                {next && (
                    <nav
                        aria-label="Ďalší album"
                        className="mt-12 flex flex-col items-end gap-2 border-t border-rule pt-8 lg:mt-16"
                    >
                        <span className="text-eyebrow text-rose-text uppercase md:text-xs">
                            Ďalší album
                        </span>
                        <Link
                            href={show(next.slug)}
                            className="py-1 font-serif text-[28px] leading-tight text-plum italic underline decoration-1 underline-offset-6 transition-colors hover:text-plum-hover lg:text-4xl"
                        >
                            {next.title} →
                        </Link>
                    </nav>
                )}
            </div>

            <CtaSection />

            {openIndex !== null && (
                <Lightbox
                    key={openIndex}
                    photos={album.photos}
                    startIndex={openIndex}
                    title={album.title}
                    open
                    onOpenChange={(open) => !open && setOpenIndex(null)}
                    onCloseAutoFocus={(event) => {
                        event.preventDefault();
                        triggers.current[lastOpened.current]?.focus();
                    }}
                />
            )}
        </>
    );
}
