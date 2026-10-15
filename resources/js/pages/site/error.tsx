import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { DillSprig } from '@/components/site/icons';
import { Eyebrow } from '@/components/site/paper';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { index } from '@/routes';
import { index as galleryIndex } from '@/routes/gallery';

const messages: Record<number, { title: ReactNode; text: string }> = {
    403: {
        title: (
            <>
                Sem nemáte <em>prístup</em>
            </>
        ),
        text: 'Táto stránka je len pre prihlásených. Vráťte sa na úvod alebo si pozrite naše svadby.',
    },
    404: {
        title: (
            <>
                Táto stránka <em>neexistuje</em>
            </>
        ),
        text: 'Možno sa presunula, alebo bola adresa zadaná nesprávne. Kvety však stále kvitnú na úvodnej stránke a v galérii.',
    },
    500: {
        title: (
            <>
                Niečo sa <em>pokazilo</em>
            </>
        ),
        text: 'Na našej strane nastala chyba. Skúste to prosím o chvíľu znova.',
    },
    503: {
        title: (
            <>
                Práve <em>aranžujeme</em>
            </>
        ),
        text: 'Na webe robíme údržbu. Vráťte sa prosím o chvíľu.',
    },
};

export default function ErrorPage({ status }: { status: number }) {
    const message = messages[status] ?? messages[500];

    return (
        <>

            <section className="relative mx-auto flex max-w-page flex-col items-start gap-6 overflow-hidden px-6 pt-16 pb-28 lg:px-10 lg:pt-28 lg:pb-40">
                <DillSprig
                    aria-hidden="true"
                    className="pointer-events-none absolute top-10 right-0 h-64 w-30 text-rose opacity-70 lg:right-20 lg:h-92.5 lg:w-42.5"
                />
                <Eyebrow>Chyba {status}</Eyebrow>
                <h1 className="max-w-2xl font-serif text-[44px] leading-[1.02] text-balance text-plum lg:text-[clamp(44px,5vw,72px)]">
                    {message.title}
                </h1>
                <p className="max-w-prose text-lead text-text lg:text-lead-lg">
                    {message.text}
                </p>
                <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Link
                        href={index()}
                        className={cn(buttonVariants({ variant: 'paper', size: 'cta' }))}
                    >
                        Na úvodnú stránku
                    </Link>
                    <Link
                        href={galleryIndex()}
                        className={cn(buttonVariants({ variant: 'paper', size: 'cta' }))}
                    >
                        Do galérie
                    </Link>
                </div>
            </section>
        </>
    );
}
