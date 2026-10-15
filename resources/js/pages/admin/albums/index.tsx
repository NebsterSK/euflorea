import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ImageOff, Images, Pencil, Plus, Trash2, X } from 'lucide-react';
import AlbumController from '@/actions/App/Http/Controllers/Admin/AlbumController';
import { ConfirmDelete } from '@/components/admin/confirm-delete';
import {
    Pagination,
    SortableHeader,
    useListQuery,
} from '@/components/admin/list-controls';
import type { ListMeta, ListOption } from '@/components/admin/list-controls';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/admin/albums';

const allTypes = 'all';

export default function AlbumsIndex({
    albums,
    meta,
    typeOptions,
    filters,
    sort,
}: {
    albums: App.Data.Admin.AlbumRowData[];
    meta: ListMeta;
    typeOptions: ListOption[];
    filters: App.Data.Admin.AlbumFilterData;
    sort: string | null;
}) {
    const list = useListQuery(index.url(), { ...filters }, sort);
    const canReorder =
        !list.isFiltered && meta.lastPage === 1 && albums.length > 1;

    const patch = (
        route: { url: string },
        data: Record<string, string | boolean>,
    ) => router.patch(route.url, data, { preserveScroll: true });

    return (
        <>
            <Head title="Albumy" />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Albumy"
                        description="Svadby a editoriály v galérii. Poradie tu je poradie na webe."
                    />
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            Nový album
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                        type="search"
                        value={list.search}
                        onChange={(event) => list.setSearch(event.target.value)}
                        placeholder="Hľadať podľa názvu"
                        aria-label="Hľadať podľa názvu"
                        className="sm:max-w-xs"
                    />
                    <Select
                        value={filters.type ?? allTypes}
                        onValueChange={(value) =>
                            list.setFilter('type', value === allTypes ? null : value)
                        }
                        disabled={list.loading}
                    >
                        <SelectTrigger className="sm:w-44" aria-label="Typ">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={allTypes}>Všetky typy</SelectItem>
                            {typeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {list.isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={list.clear}
                            disabled={list.loading}
                        >
                            <X />
                            Zrušiť filtre
                        </Button>
                    )}
                </div>

                {albums.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 border border-dashed py-16 text-center">
                        <Images className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            {list.isFiltered
                                ? 'Filtru nezodpovedá žiadny album.'
                                : 'Zatiaľ tu nie je žiadny album.'}
                        </p>
                        {!list.isFiltered && (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    Vytvoriť prvý album
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {canReorder && (
                                        <TableHead className="w-24">Poradie</TableHead>
                                    )}
                                    <TableHead>
                                        <SortableHeader
                                            label="Názov"
                                            column="title"
                                            sort={sort}
                                            onSort={list.setSort}
                                            disabled={list.loading}
                                        />
                                    </TableHead>
                                    <TableHead>Typ</TableHead>
                                    <TableHead>
                                        <SortableHeader
                                            label="Dátum"
                                            column="wedding_date"
                                            sort={sort}
                                            onSort={list.setSort}
                                            disabled={list.loading}
                                        />
                                    </TableHead>
                                    <TableHead className="text-right">Fotky</TableHead>
                                    <TableHead>Zverejnený</TableHead>
                                    <TableHead className="text-right">Akcie</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody
                                className={cn(list.loading && 'opacity-50')}
                            >
                                {albums.map((album, position) => (
                                    <TableRow key={album.id}>
                                        {canReorder && (
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Posunúť ${album.title} vyššie`}
                                                        disabled={position === 0}
                                                        onClick={() =>
                                                            patch(
                                                                AlbumController.move(album.id),
                                                                { direction: 'up' },
                                                            )
                                                        }
                                                    >
                                                        <ArrowUp />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Posunúť ${album.title} nižšie`}
                                                        disabled={position === albums.length - 1}
                                                        onClick={() =>
                                                            patch(
                                                                AlbumController.move(album.id),
                                                                { direction: 'down' },
                                                            )
                                                        }
                                                    >
                                                        <ArrowDown />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Link
                                                href={edit(album.id)}
                                                className="flex min-w-56 items-center gap-3 font-medium hover:text-primary"
                                            >
                                                {album.coverThumb ? (
                                                    <img
                                                        src={album.coverThumb}
                                                        alt=""
                                                        className="size-12 shrink-0 bg-photo-bg object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex size-12 shrink-0 items-center justify-center bg-muted">
                                                        <ImageOff className="size-4 text-muted-foreground" />
                                                    </span>
                                                )}
                                                <span className="flex flex-col gap-1">
                                                    {album.title}
                                                    {album.isHomepageCarousel && (
                                                        <Badge variant="secondary" className="w-fit">
                                                            Karusel na úvode
                                                        </Badge>
                                                    )}
                                                </span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>{album.typeLabel}</TableCell>
                                        <TableCell className="tabular-nums">
                                            {album.weddingDate ?? '–'}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {album.photosCount}
                                        </TableCell>
                                        <TableCell>
                                            {album.isHomepageCarousel ? (
                                                <span className="text-xs text-muted-foreground">
                                                    nie je v galérii
                                                </span>
                                            ) : (
                                                <Switch
                                                    checked={album.isPublished}
                                                    aria-label={`Zverejniť ${album.title}`}
                                                    onCheckedChange={(checked) =>
                                                        patch(
                                                            AlbumController.publish(album.id),
                                                            { value: checked },
                                                        )
                                                    }
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(album.id)}
                                                        aria-label={`Upraviť ${album.title}`}
                                                    >
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <ConfirmDelete
                                                    title={`Zmazať album ${album.title}?`}
                                                    description="Zmažú sa aj všetky jeho fotky. Túto akciu nie je možné vrátiť."
                                                    onConfirm={() =>
                                                        router.delete(
                                                            AlbumController.destroy.url(album.id),
                                                            { preserveScroll: true },
                                                        )
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Zmazať ${album.title}`}
                                                    >
                                                        <Trash2 className="text-destructive" />
                                                    </Button>
                                                </ConfirmDelete>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination
                    meta={meta}
                    onPage={list.setPage}
                    disabled={list.loading}
                />
            </div>
        </>
    );
}

AlbumsIndex.layout = {
    breadcrumbs: [
        { title: 'Prehľad', href: dashboard() },
        { title: 'Albumy', href: index() },
    ],
};
