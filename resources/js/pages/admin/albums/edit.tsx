import { Head, Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import AlbumController from '@/actions/App/Http/Controllers/Admin/AlbumController';
import { AlbumForm } from '@/components/admin/album-form';
import type { ListOption } from '@/components/admin/list-controls';
import { PhotoManager } from '@/components/admin/photo-manager';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { index } from '@/routes/admin/albums';
import { show } from '@/routes/gallery';

export default function AlbumsEdit({
    album,
    photos,
    typeOptions,
}: {
    album: App.Data.Admin.AlbumData;
    photos: App.Data.Admin.PhotoData[];
    typeOptions: ListOption[];
}) {
    const isPublic = album.isPublished && !album.isHomepageCarousel;

    return (
        <>
            <Head title={album.title} />

            <div className="flex flex-col gap-8 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title={album.title}
                        description={
                            album.isHomepageCarousel
                                ? 'Album s fotkami pre karusel na úvodnej stránke.'
                                : isPublic
                                  ? 'Album je zverejnený v galérii.'
                                  : 'Album je skrytý, na webe sa nezobrazuje.'
                        }
                    />
                    {isPublic && (
                        <Button variant="outline" asChild>
                            <Link href={show(album.slug)} target="_blank">
                                <ExternalLink />
                                Zobraziť na webe
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <PhotoManager album={album} photos={photos} />

                    <section className="flex flex-col gap-5 border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Údaje albumu
                        </h2>
                        <AlbumForm
                            key={album.id}
                            action={AlbumController.update.form(album.id)}
                            album={album}
                            typeOptions={typeOptions}
                            submitLabel="Uložiť album"
                        />
                    </section>
                </div>
            </div>
        </>
    );
}

AlbumsEdit.layout = (props: { album: App.Data.Admin.AlbumData }) => ({
    breadcrumbs: [
        { title: 'Prehľad', href: dashboard() },
        { title: 'Albumy', href: index() },
        {
            title: props.album.title,
            href: AlbumController.edit(props.album.id),
        },
    ],
});
