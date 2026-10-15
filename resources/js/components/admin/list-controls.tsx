import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ListMeta = {
    currentPage: number;
    lastPage: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type ListOption = { value: string; label: string };

type Query = {
    filter: Record<string, string | null | undefined>;
    sort: string | null;
    page?: number;
};

/**
 * URL-synced list state for admin index pages: filters and sort apply
 * instantly, the search box is debounced (300ms).
 */
export function useListQuery(
    url: string,
    filters: Record<string, string | null | undefined>,
    sort: string | null,
) {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const debounce = useRef<number | undefined>(undefined);

    const visit = (query: Query) => {
        const filter = Object.fromEntries(
            Object.entries(query.filter).filter(
                ([, value]) => value !== null && value !== undefined && value !== '',
            ),
        );

        router.get(
            url,
            {
                ...(Object.keys(filter).length ? { filter } : {}),
                ...(query.sort ? { sort: query.sort } : {}),
                ...(query.page && query.page > 1 ? { page: query.page } : {}),
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    useEffect(() => () => window.clearTimeout(debounce.current), []);

    return {
        loading,
        search,
        setSearch: (value: string) => {
            setSearch(value);
            window.clearTimeout(debounce.current);
            debounce.current = window.setTimeout(
                () => visit({ filter: { ...filters, search: value }, sort }),
                300,
            );
        },
        setFilter: (key: string, value: string | null) =>
            visit({ filter: { ...filters, search, [key]: value }, sort }),
        setSort: (value: string | null) =>
            visit({ filter: { ...filters, search }, sort: value }),
        setPage: (page: number) =>
            visit({ filter: { ...filters, search }, sort, page }),
        clear: () => {
            setSearch('');
            visit({ filter: {}, sort: null });
        },
        isFiltered:
            Object.values(filters).some((value) => value) || sort !== null,
    };
}

/**
 * Column header that cycles ascending → descending → default.
 */
export function SortableHeader({
    label,
    column,
    sort,
    onSort,
    disabled,
}: {
    label: string;
    column: string;
    sort: string | null;
    onSort: (value: string | null) => void;
    disabled?: boolean;
}) {
    const direction =
        sort === column ? 'asc' : sort === `-${column}` ? 'desc' : null;
    const Icon =
        direction === 'asc'
            ? ArrowUp
            : direction === 'desc'
              ? ArrowDown
              : ArrowUpDown;

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() =>
                onSort(
                    direction === null
                        ? column
                        : direction === 'asc'
                          ? `-${column}`
                          : null,
                )
            }
            className="inline-flex min-h-9 items-center gap-1.5 font-medium text-foreground hover:text-primary"
        >
            {label}
            <Icon
                className={cn(
                    'size-3.5',
                    direction === null && 'text-muted-foreground',
                )}
            />
        </button>
    );
}

export function Pagination({
    meta,
    onPage,
    disabled,
}: {
    meta: ListMeta;
    onPage: (page: number) => void;
    disabled?: boolean;
}) {
    if (meta.total === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p className="tabular-nums">
                {meta.from} až {meta.to} z {meta.total}
            </p>
            {meta.lastPage > 1 && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={disabled || meta.currentPage <= 1}
                        onClick={() => onPage(meta.currentPage - 1)}
                    >
                        <ChevronLeft />
                        Predchádzajúca
                    </Button>
                    <span className="tabular-nums">
                        {meta.currentPage} / {meta.lastPage}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={disabled || meta.currentPage >= meta.lastPage}
                        onClick={() => onPage(meta.currentPage + 1)}
                    >
                        Ďalšia
                        <ChevronRight />
                    </Button>
                </div>
            )}
        </div>
    );
}
