import { Head, Link } from '@inertiajs/react';
import { Images, Inbox, LayoutGrid, Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { create, edit, index as albumsIndex } from '@/routes/admin/albums';
import { index as inquiriesIndex } from '@/routes/admin/inquiries';

export default function Dashboard({
    stats,
    carouselAlbumId,
}: {
    stats: {
        albums: number;
        published: number;
        photos: number;
        openInquiries: number;
    };
    carouselAlbumId: number | null;
}) {
    const cards = [
        {
            label: 'Albumy',
            value: stats.albums,
            hint: `${stats.published} zverejnených`,
            href: albumsIndex(),
            Icon: Images,
        },
        {
            label: 'Fotky',
            value: stats.photos,
            hint: 'vo všetkých albumoch',
            href: albumsIndex(),
            Icon: LayoutGrid,
        },
        {
            label: 'Nevybavené dopyty',
            value: stats.openInquiries,
            hint: 'z kontaktného formulára',
            href: inquiriesIndex(),
            Icon: Inbox,
        },
    ];

    return (
        <>
            <Head title="Prehľad" />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <Heading
                    title="Prehľad"
                    description="Albumy, fotky a dopyty na jednom mieste."
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    {cards.map(({ label, value, hint, href, Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            className="flex flex-col gap-2 border bg-card p-5 transition-colors hover:border-primary"
                        >
                            <span className="flex items-center justify-between text-sm text-muted-foreground">
                                {label}
                                <Icon className="size-4" />
                            </span>
                            <span className="text-3xl font-semibold tabular-nums">
                                {value}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {hint}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            Nový album
                        </Link>
                    </Button>
                    {carouselAlbumId && (
                        <Button variant="outline" asChild>
                            <Link href={edit(carouselAlbumId)}>
                                Upraviť karusel na úvode
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Prehľad', href: dashboard() }],
};
