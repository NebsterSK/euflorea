import { Form } from '@inertiajs/react';
import { useState } from 'react';
import type { ListOption } from '@/components/admin/list-controls';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { RouteFormDefinition } from '@/wayfinder';

/**
 * Slovak-safe slug: strips diacritics, lowercases, joins words with dashes.
 */
export function slugify(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function AlbumForm({
    action,
    album,
    typeOptions,
    submitLabel,
}: {
    action: RouteFormDefinition<'post'> | RouteFormDefinition<'patch'>;
    album?: App.Data.Admin.AlbumData;
    typeOptions: ListOption[];
    submitLabel: string;
}) {
    const [title, setTitle] = useState(album?.title ?? '');
    const [slug, setSlug] = useState(album?.slug ?? '');
    const [slugTouched, setSlugTouched] = useState(Boolean(album));

    return (
        <Form {...action} options={{ preserveScroll: true }}>
            {({ processing, errors }) => (
                <fieldset disabled={processing} className="grid gap-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Názov</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                value={title}
                                placeholder="Anna a Jakub"
                                onChange={(event) => {
                                    setTitle(event.target.value);

                                    if (!slugTouched) {
                                        setSlug(slugify(event.target.value));
                                    }
                                }}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Adresa (slug)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={slug}
                                placeholder="anna-a-jakub"
                                onChange={(event) => {
                                    setSlugTouched(true);
                                    setSlug(slugify(event.target.value));
                                }}
                            />
                            <p className="text-xs text-muted-foreground">
                                euflorea.sk/galeria/{slug || '…'}
                            </p>
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Typ</Label>
                            <Select
                                name="type"
                                defaultValue={album?.type ?? 'wedding'}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="wedding_date">Dátum (nepovinné)</Label>
                            <Input
                                id="wedding_date"
                                name="wedding_date"
                                type="date"
                                defaultValue={album?.weddingDate ?? ''}
                            />
                            <InputError message={errors.wedding_date} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="location">Miesto (nepovinné)</Label>
                            <Input
                                id="location"
                                name="location"
                                defaultValue={album?.location ?? ''}
                                placeholder="Kaštieľ Mojmírovce"
                            />
                            <InputError message={errors.location} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="description">
                                Krátky popis (nepovinné)
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={3}
                                defaultValue={album?.description ?? ''}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    {album && (
                        <input
                            type="hidden"
                            name="cover_photo_id"
                            value={album.coverPhotoId ?? ''}
                        />
                    )}

                    <div className="grid gap-4 border p-4">
                        <label className="flex items-start gap-3">
                            <Switch
                                name="is_published"
                                defaultChecked={album?.isPublished ?? false}
                                className="mt-0.5"
                            />
                            <span className="grid gap-1 text-sm">
                                <span className="font-medium">
                                    Zverejnený v galérii
                                </span>
                                <span className="text-muted-foreground">
                                    Kým nie je zverejnený, na webe ho nikto neuvidí.
                                </span>
                            </span>
                        </label>
                        <label className="flex items-start gap-3">
                            <Switch
                                name="is_homepage_carousel"
                                defaultChecked={album?.isHomepageCarousel ?? false}
                                className="mt-0.5"
                            />
                            <span className="grid gap-1 text-sm">
                                <span className="font-medium">
                                    Karusel na úvodnej stránke
                                </span>
                                <span className="text-muted-foreground">
                                    Fotky tohto albumu sa striedajú na úvode. Môže
                                    to byť len jeden album a v galérii sa nezobrazí.
                                </span>
                            </span>
                        </label>
                    </div>

                    <div>
                        <Button type="submit">
                            {processing && <Spinner />}
                            {submitLabel}
                        </Button>
                    </div>
                </fieldset>
            )}
        </Form>
    );
}
