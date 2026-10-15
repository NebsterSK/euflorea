import { Link } from '@inertiajs/react';
import { Tape } from '@/components/site/paper';
import { cn } from '@/lib/utils';
import { show } from '@/routes/gallery';

const tilts = [
    '-rotate-[0.8deg]',
    'rotate-[0.6deg]',
    '-rotate-[0.4deg]',
    'rotate-[0.9deg]',
];

/**
 * An album as a taped photo print. The whole card is one link; hover
 * straightens and lifts it like the social cards.
 */
export function AlbumCard({
    album,
    position,
}: {
    album: App.Data.Site.AlbumCardData;
    position: number;
}) {
    const cover = album.cover;

    return (
        <Link
            href={show(album.slug)}
            className={cn(
                'group relative block bg-paper-card p-2.5 shadow-card-sm transition-[rotate,translate,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:rotate-0 hover:shadow-lift focus-visible:-translate-y-1 focus-visible:rotate-0 focus-visible:shadow-lift motion-reduce:hover:translate-y-0 lg:p-3 lg:shadow-card',
                tilts[position % tilts.length],
            )}
        >
            <Tape
                tone={position % 2 ? 'lilac' : 'sand'}
                className={cn(
                    '-top-3 h-7 w-24',
                    position % 2 ? 'right-8 rotate-4' : 'left-8 -rotate-4',
                )}
            />
            <div className="aspect-[4/5] overflow-hidden bg-photo-bg">
                {cover && (
                    <img
                        src={cover.src}
                        srcSet={cover.srcset}
                        sizes="(min-width: 1280px) 400px, (min-width: 768px) 46vw, 92vw"
                        width={cover.width}
                        height={cover.height}
                        alt=""
                        loading={position < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="size-full object-cover"
                        style={{
                            objectPosition: `${cover.focalX}% ${cover.focalY}%`,
                        }}
                    />
                )}
            </div>
            <div className="flex flex-col gap-1.5 px-1.5 pt-4 pb-2 lg:pt-5">
                <h2 className="font-serif text-2xl leading-tight font-medium text-plum lg:text-[28px]">
                    {album.title}
                </h2>
                <p className="text-eyebrow text-rose-text uppercase md:text-xs">
                    {[album.typeLabel, album.meta].filter(Boolean).join(' · ')}
                </p>
            </div>
        </Link>
    );
}
