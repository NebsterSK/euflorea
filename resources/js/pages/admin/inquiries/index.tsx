import { Head, router } from '@inertiajs/react';
import { Inbox, X } from 'lucide-react';
import InquiryController from '@/actions/App/Http/Controllers/Admin/InquiryController';
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
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index } from '@/routes/admin/inquiries';

const allStatuses = 'all';

export default function InquiriesIndex({
    inquiries,
    meta,
    statusOptions,
    filters,
    sort,
}: {
    inquiries: App.Data.Admin.InquiryData[];
    meta: ListMeta;
    statusOptions: ListOption[];
    filters: App.Data.Admin.InquiryFilterData;
    sort: string | null;
}) {
    const list = useListQuery(index.url(), { ...filters }, sort);

    return (
        <>
            <Head title="Dopyty" />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                <Heading
                    title="Dopyty"
                    description="Správy z kontaktného formulára. Vybavené si označte, nech viete, na čo ste už odpovedali."
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                        type="search"
                        value={list.search}
                        onChange={(event) => list.setSearch(event.target.value)}
                        placeholder="Meno, e-mail alebo miesto"
                        aria-label="Hľadať"
                        className="sm:max-w-xs"
                    />
                    <Select
                        value={filters.status ?? allStatuses}
                        onValueChange={(value) =>
                            list.setFilter(
                                'status',
                                value === allStatuses ? null : value,
                            )
                        }
                        disabled={list.loading}
                    >
                        <SelectTrigger className="sm:w-44" aria-label="Stav">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={allStatuses}>Všetky</SelectItem>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">Zoradiť:</span>
                        <SortableHeader
                            label="Prijaté"
                            column="created_at"
                            sort={sort}
                            onSort={list.setSort}
                            disabled={list.loading}
                        />
                        <SortableHeader
                            label="Dátum svadby"
                            column="wedding_date"
                            sort={sort}
                            onSort={list.setSort}
                            disabled={list.loading}
                        />
                    </div>
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

                {inquiries.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 border border-dashed py-16 text-center">
                        <Inbox className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            {list.isFiltered
                                ? 'Filtru nezodpovedá žiadny dopyt.'
                                : 'Zatiaľ neprišiel žiadny dopyt.'}
                        </p>
                    </div>
                ) : (
                    <ul
                        className={cn(
                            'grid gap-4',
                            list.loading && 'opacity-50',
                        )}
                    >
                        {inquiries.map((inquiry) => (
                            <li
                                key={inquiry.id}
                                className={cn(
                                    'grid gap-4 border bg-card p-4 lg:grid-cols-[1fr_2fr_auto] lg:p-5',
                                    inquiry.isHandled && 'opacity-70',
                                )}
                            >
                                <div className="grid content-start gap-1 text-sm">
                                    <p className="text-base font-medium">
                                        {inquiry.name}
                                    </p>
                                    <a
                                        href={`mailto:${inquiry.email}`}
                                        className="break-all text-primary underline-offset-4 hover:underline"
                                    >
                                        {inquiry.email}
                                    </a>
                                    {inquiry.phone && (
                                        <a
                                            href={`tel:${inquiry.phone.replace(/\s+/g, '')}`}
                                            className="text-primary underline-offset-4 hover:underline"
                                        >
                                            {inquiry.phone}
                                        </a>
                                    )}
                                    <p className="text-xs text-muted-foreground tabular-nums">
                                        Prijaté {inquiry.createdAt}
                                    </p>
                                </div>
                                <div className="grid content-start gap-2 text-sm">
                                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                                        <dt className="text-muted-foreground">Svadba</dt>
                                        <dd className="tabular-nums">
                                            {inquiry.dateUnknown
                                                ? 'dátum zatiaľ nevedia'
                                                : (inquiry.weddingDate ?? '–')}
                                        </dd>
                                        <dt className="text-muted-foreground">Miesto</dt>
                                        <dd>{inquiry.venue ?? '–'}</dd>
                                        <dt className="text-muted-foreground">Hostia</dt>
                                        <dd>{inquiry.guests ?? '–'}</dd>
                                    </dl>
                                    {inquiry.services.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {inquiry.services.map((service) => (
                                                <Badge key={service} variant="secondary">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <p className="whitespace-pre-line">
                                        {inquiry.message}
                                    </p>
                                </div>
                                <label className="flex items-center gap-2 self-start text-sm">
                                    <Switch
                                        checked={inquiry.isHandled}
                                        onCheckedChange={(checked) =>
                                            router.patch(
                                                InquiryController.update.url(inquiry.id),
                                                { value: checked },
                                                { preserveScroll: true },
                                            )
                                        }
                                    />
                                    Vybavené
                                </label>
                            </li>
                        ))}
                    </ul>
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

InquiriesIndex.layout = {
    breadcrumbs: [
        { title: 'Prehľad', href: dashboard() },
        { title: 'Dopyty', href: index() },
    ],
};
