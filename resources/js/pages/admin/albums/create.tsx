import { Head } from '@inertiajs/react';
import AlbumController from '@/actions/App/Http/Controllers/Admin/AlbumController';
import { AlbumForm } from '@/components/admin/album-form';
import type { ListOption } from '@/components/admin/list-controls';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import { create, index } from '@/routes/admin/albums';

export default function AlbumsCreate({
    typeOptions,
}: {
    typeOptions: ListOption[];
}) {
    return (
        <>
            <Head title="Nový album" />

            <div className="flex max-w-4xl flex-col gap-6 p-4 lg:p-6">
                <Heading
                    title="Nový album"
                    description="Najprv vyplňte údaje, fotky nahráte v ďalšom kroku."
                />
                <AlbumForm
                    action={AlbumController.store.form()}
                    typeOptions={typeOptions}
                    submitLabel="Vytvoriť album"
                />
            </div>
        </>
    );
}

AlbumsCreate.layout = {
    breadcrumbs: [
        { title: 'Prehľad', href: dashboard() },
        { title: 'Albumy', href: index() },
        { title: 'Nový album', href: create() },
    ],
};
