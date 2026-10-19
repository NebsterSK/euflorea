import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Crosshair,
    ImagePlus,
    Loader2,
    Star,
    Trash2,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { DragEvent, MouseEvent } from 'react';
import AlbumController from '@/actions/App/Http/Controllers/Admin/AlbumController';
import PhotoController from '@/actions/App/Http/Controllers/Admin/PhotoController';
import { ConfirmDelete } from '@/components/admin/confirm-delete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Upload = {
    key: string;
    name: string;
    progress: number;
    status: 'waiting' | 'uploading' | 'done' | 'failed';
};

export function PhotoManager({
    album,
    photos,
}: {
    album: App.Data.Admin.AlbumData;
    photos: App.Data.Admin.PhotoData[];
}) {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [isDraggingFiles, setIsDraggingFiles] = useState(false);
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [editing, setEditing] = useState<App.Data.Admin.PhotoData | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const isUploading = uploads.some((upload) => upload.status === 'uploading' || upload.status === 'waiting');

    const updateUpload = (key: string, changes: Partial<Upload>) =>
        setUploads((current) =>
            current.map((upload) => (upload.key === key ? { ...upload, ...changes } : upload)),
        );

    const uploadFiles = async (files: File[]) => {
        const images = files.filter((file) => file.type.startsWith('image/'));
        const queued = images.map((file, position) => ({
            key: `${Date.now()}-${position}-${file.name}`,
            name: file.name,
            progress: 0,
            status: 'waiting' as const,
        }));

        setUploads((current) => [
            ...current.filter((upload) => upload.status !== 'done'),
            ...queued,
        ]);

        for (const [position, file] of images.entries()) {
            const { key } = queued[position];
            updateUpload(key, { status: 'uploading' });

            await new Promise<void>((resolve) => {
                router.post(
                    PhotoController.store.url(album.id),
                    { photo: file },
                    {
                        forceFormData: true,
                        preserveScroll: true,
                        preserveState: true,
                        onProgress: (event) =>
                            updateUpload(key, {
                                progress: Math.round(event?.percentage ?? 0),
                            }),
                        onSuccess: (page) => {
                            const failed = Object.keys(page.props.errors ?? {}).length > 0;
                            updateUpload(key, {
                                status: failed ? 'failed' : 'done',
                                progress: 100,
                            });
                        },
                        onError: () => updateUpload(key, { status: 'failed' }),
                        onFinish: () => resolve(),
                    },
                );
            });
        }
    };

    const saveOrder = (ids: number[]) =>
        router.patch(
            PhotoController.reorder.url(album.id),
            { ids },
            { preserveScroll: true },
        );

    const move = (position: number, offset: number) => {
        const ids = photos.map((photo) => photo.id);
        const target = position + offset;

        if (target < 0 || target >= ids.length) {
            return;
        }

        [ids[position], ids[target]] = [ids[target], ids[position]];
        saveOrder(ids);
    };

    const dropOnPhoto = (targetId: number) => {
        if (draggedId === null || draggedId === targetId) {
            return;
        }

        const ids = photos.map((photo) => photo.id).filter((id) => id !== draggedId);
        ids.splice(ids.indexOf(targetId), 0, draggedId);
        setDraggedId(null);
        saveOrder(ids);
    };

    const handleFileDrop = (event: DragEvent) => {
        event.preventDefault();
        setIsDraggingFiles(false);

        if (event.dataTransfer.files.length) {
            void uploadFiles(Array.from(event.dataTransfer.files));
        }
    };

    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Fotky</h2>
                    <p className="text-sm text-muted-foreground">
                        {photos.length} {photos.length === 1 ? 'fotka' : photos.length < 5 && photos.length > 0 ? 'fotky' : 'fotiek'}.
                        Poradie zmeníte šípkami alebo potiahnutím.
                    </p>
                </div>
            </div>

            <div
                onDragOver={(event) => {
                    if (event.dataTransfer.types.includes('Files')) {
                        event.preventDefault();
                        setIsDraggingFiles(true);
                    }
                }}
                onDragLeave={() => setIsDraggingFiles(false)}
                onDrop={handleFileDrop}
                className={cn(
                    'flex flex-col items-center gap-3 border border-dashed px-4 py-8 text-center transition-colors',
                    isDraggingFiles && 'border-primary bg-accent',
                )}
            >
                <ImagePlus className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Pretiahnite sem fotky alebo ich vyberte zo zariadenia.
                    <br />
                    JPG, PNG alebo WebP, najviac 25 MB na fotku.
                </p>
                <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => fileInput.current?.click()}
                >
                    {isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
                    Vybrať fotky
                </Button>
                <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    tabIndex={-1}
                    onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        event.target.value = '';
                        void uploadFiles(files);
                    }}
                />
            </div>

            {uploads.length > 0 && (
                <ul className="grid gap-2" aria-live="polite">
                    {uploads.map((upload) => (
                        <li key={upload.key} className="grid gap-1 text-sm">
                            <div className="flex justify-between gap-3">
                                <span className="truncate">{upload.name}</span>
                                <span
                                    className={cn(
                                        'shrink-0 text-muted-foreground',
                                        upload.status === 'failed' && 'text-destructive',
                                    )}
                                >
                                    {
                                        {
                                            waiting: 'čaká',
                                            uploading: `${upload.progress} %`,
                                            done: 'hotovo',
                                            failed: 'chyba',
                                        }[upload.status]
                                    }
                                </span>
                            </div>
                            <Progress value={upload.progress} className="h-1" />
                        </li>
                    ))}
                </ul>
            )}

            {photos.length > 0 && (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {photos.map((photo, position) => {
                        const isCover = album.coverPhotoId === photo.id;

                        return (
                            <li
                                key={photo.id}
                                draggable
                                onDragStart={(event) => {
                                    event.dataTransfer.effectAllowed = 'move';
                                    setDraggedId(photo.id);
                                }}
                                onDragEnd={() => setDraggedId(null)}
                                onDragOver={(event) => {
                                    if (draggedId !== null) {
                                        event.preventDefault();
                                    }
                                }}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    dropOnPhoto(photo.id);
                                }}
                                className={cn(
                                    'flex flex-col border bg-card',
                                    draggedId === photo.id && 'opacity-40',
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => setEditing(photo)}
                                    className="relative block aspect-square w-full overflow-hidden bg-photo-bg"
                                    aria-label={`Upraviť fotku ${position + 1}`}
                                >
                                    {photo.thumb ? (
                                        <img
                                            src={photo.thumb}
                                            alt={photo.alt ?? ''}
                                            loading="lazy"
                                            draggable={false}
                                            className="size-full object-cover"
                                            style={{
                                                objectPosition: `${photo.focalX}% ${photo.focalY}%`,
                                            }}
                                        />
                                    ) : (
                                        <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
                                            Spracúva sa…
                                        </span>
                                    )}
                                    {isCover && (
                                        <Badge className="absolute top-2 left-2">
                                            <Star />
                                            Obálka
                                        </Badge>
                                    )}
                                    {!photo.alt && (
                                        <Badge
                                            variant="outline"
                                            className="absolute right-2 bottom-2 bg-card"
                                        >
                                            bez popisu
                                        </Badge>
                                    )}
                                </button>
                                <div className="flex items-center justify-between gap-1 p-1">
                                    <div className="flex">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Posunúť dopredu"
                                            disabled={position === 0}
                                            onClick={() => move(position, -1)}
                                        >
                                            <ArrowLeft />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Posunúť dozadu"
                                            disabled={position === photos.length - 1}
                                            onClick={() => move(position, 1)}
                                        >
                                            <ArrowRight />
                                        </Button>
                                    </div>
                                    <div className="flex">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Nastaviť ako obálku"
                                            disabled={isCover}
                                            onClick={() =>
                                                router.patch(
                                                    AlbumController.cover.url(album.id),
                                                    { photo_id: photo.id },
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            <Star className={cn(isCover && 'fill-current')} />
                                        </Button>
                                        <ConfirmDelete
                                            title="Zmazať fotku?"
                                            description="Fotka sa odstráni z albumu aj z webu. Túto akciu nie je možné vrátiť."
                                            onConfirm={() =>
                                                router.delete(
                                                    PhotoController.destroy.url(photo.id),
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Zmazať fotku"
                                            >
                                                <Trash2 className="text-destructive" />
                                            </Button>
                                        </ConfirmDelete>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {editing && (
                <PhotoDialog
                    key={editing.id}
                    photo={editing}
                    onClose={() => setEditing(null)}
                />
            )}
        </section>
    );
}

/**
 * Alt text and focal point editor. Tap the photo to choose what must stay
 * visible when it is cropped; the two previews show the landscape (desktop
 * carousel) and portrait (cards, mobile) crops.
 */
function PhotoDialog({
    photo,
    onClose,
}: {
    photo: App.Data.Admin.PhotoData;
    onClose: () => void;
}) {
    const [alt, setAlt] = useState(photo.alt ?? '');
    const [focal, setFocal] = useState({ x: photo.focalX, y: photo.focalY });
    const [saving, setSaving] = useState(false);
    const position = `${focal.x}% ${focal.y}%`;

    const pickFocal = (event: MouseEvent<HTMLButtonElement>) => {
        const box = event.currentTarget.getBoundingClientRect();
        setFocal({
            x: Math.round(((event.clientX - box.left) / box.width) * 100),
            y: Math.round(((event.clientY - box.top) / box.height) * 100),
        });
    };

    const save = () =>
        router.patch(
            PhotoController.update.url(photo.id),
            { alt, focal_x: focal.x, focal_y: focal.y },
            {
                preserveScroll: true,
                onStart: () => setSaving(true),
                onFinish: () => setSaving(false),
                onSuccess: onClose,
            },
        );

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Upraviť fotku</DialogTitle>
                    <DialogDescription>
                        Ťuknite na miesto, ktoré musí zostať viditeľné pri orezaní.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-5 md:grid-cols-[1fr_200px]">
                    <button
                        type="button"
                        onClick={pickFocal}
                        className="relative w-full cursor-crosshair bg-photo-bg"
                        aria-label="Nastaviť bod záujmu"
                    >
                        {photo.thumb && (
                            <img
                                src={photo.thumb}
                                alt=""
                                className="block h-auto w-full"
                                draggable={false}
                            />
                        )}
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary/60 text-white shadow"
                            style={{ left: `${focal.x}%`, top: `${focal.y}%` }}
                        >
                            <Crosshair className="size-4" />
                        </span>
                    </button>

                    <div className="grid content-start gap-3">
                        <p className="text-sm font-medium">Náhľad orezania</p>
                        <div className="aspect-[2/1] overflow-hidden bg-photo-bg">
                            {photo.thumb && (
                                <img
                                    src={photo.thumb}
                                    alt=""
                                    className="size-full object-cover"
                                    style={{ objectPosition: position }}
                                />
                            )}
                        </div>
                        <div className="aspect-[4/5] w-2/3 overflow-hidden bg-photo-bg">
                            {photo.thumb && (
                                <img
                                    src={photo.thumb}
                                    alt=""
                                    className="size-full object-cover"
                                    style={{ objectPosition: position }}
                                />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground tabular-nums">
                            Bod: {focal.x} % × {focal.y} %
                        </p>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="photo-alt">Popis fotky (pre nevidiacich a Google)</Label>
                    <Textarea
                        id="photo-alt"
                        rows={2}
                        value={alt}
                        maxLength={255}
                        placeholder="Nevesta s kyticou lúčnych kvetov a oranžových kál"
                        onChange={(event) => setAlt(event.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Zrušiť
                    </Button>
                    <Button onClick={save} disabled={saving}>
                        {saving && <Loader2 className="animate-spin" />}
                        Uložiť
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
