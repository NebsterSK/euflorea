import { Link, usePage } from '@inertiajs/react';
import {
    FacebookIcon,
    InstagramIcon,
    MenuIcon,
} from '@/components/site/icons';
import { Logo } from '@/components/site/logo';
import { buttonVariants } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { contact, index } from '@/routes';
import { index as galleryIndex } from '@/routes/gallery';

const navItems = [
    { title: 'Domov', href: index(), exact: true },
    { title: 'Galéria', href: galleryIndex(), exact: false },
    { title: 'Kontakt', href: contact(), exact: true },
];

const tagline = 'Kvety pre váš veľký deň';

export function useSiteNav() {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    return navItems.map((item) => ({
        ...item,
        isActive: item.exact
            ? isCurrentUrl(item.href)
            : isCurrentOrParentUrl(item.href),
    }));
}

function SocialIconLinks({ className }: { className?: string }) {
    const { social } = usePage().props;

    return (
        <div className={cn('flex items-center', className)}>
            {social.instagram.url && (
                <a
                    href={social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex size-11 items-center justify-center text-plum transition-colors hover:text-plum-hover"
                >
                    <InstagramIcon aria-hidden="true" className="size-5" />
                </a>
            )}
            {social.facebook.url && (
                <a
                    href={social.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex size-11 items-center justify-center text-plum transition-colors hover:text-plum-hover"
                >
                    <FacebookIcon aria-hidden="true" className="size-5" />
                </a>
            )}
        </div>
    );
}

/**
 * Public site header. The homepage shows the tagline (the big logo follows
 * right below); every other page shows the small wordmark in its place.
 */
export function SiteHeader() {
    const nav = useSiteNav();
    const isHome = nav[0].isActive;

    const brand = isHome ? (
        <p className="font-serif text-base leading-tight text-taupe-text italic lg:text-[17px]">
            {tagline}
        </p>
    ) : (
        <Link href={index()} className="block py-2" aria-label="Euflorea, domov">
            <Logo className="w-28 lg:w-32" />
        </Link>
    );

    return (
        <header className="relative">
            <div className="mx-auto flex max-w-page items-center justify-between border-b border-rule py-2.5 pr-4 pl-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10 lg:py-5.5">
                <nav aria-label="Hlavná navigácia" className="hidden lg:block">
                    <ul className="flex gap-9">
                        {nav.map((item) => (
                            <li key={item.title}>
                                <Link
                                    href={item.href}
                                    aria-current={
                                        item.isActive ? 'page' : undefined
                                    }
                                    className={cn(
                                        'block border-b border-transparent px-0.5 py-3 text-nav text-plum uppercase transition-colors hover:border-plum',
                                        item.isActive && 'border-plum',
                                    )}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {brand}

                <div className="hidden items-center justify-end gap-2.5 lg:flex">
                    <SocialIconLinks />
                    <Link
                        href={contact()}
                        className={cn(
                            buttonVariants({ variant: 'paper', size: 'header' }),
                            'ml-2.5',
                        )}
                    >
                        Napíšte nám
                    </Link>
                </div>

                <MobileMenu nav={nav} />
            </div>
        </header>
    );
}

function MobileMenu({ nav }: { nav: ReturnType<typeof useSiteNav> }) {
    return (
        <Sheet>
            <SheetTrigger
                aria-label="Otvoriť menu"
                className="flex size-12 items-center justify-center text-plum lg:hidden"
            >
                <MenuIcon aria-hidden="true" className="size-6.5" />
            </SheetTrigger>
            <SheetContent
                side="right"
                closeLabel="Zavrieť menu"
                overlayClassName="bg-ink/40"
                closeClassName="top-4 right-4 flex size-12 items-center justify-center rounded-full text-plum opacity-100 focus:ring-0 focus:outline-2 data-[state=open]:bg-transparent [&_svg]:size-6 [&_svg]:stroke-[1.3]"
                className="paper-grain w-[min(88vw,22rem)] gap-0 border-l border-rule px-8 pt-20 pb-10"
            >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                    Navigácia po stránke
                </SheetDescription>

                <nav aria-label="Mobilná navigácia">
                    <ul className="flex flex-col gap-1">
                        {nav.map((item) => (
                            <li key={item.title}>
                                <SheetClose asChild>
                                    <Link
                                        href={item.href}
                                        aria-current={
                                            item.isActive ? 'page' : undefined
                                        }
                                        className={cn(
                                            'block py-2 font-serif text-[34px] leading-tight text-plum',
                                            item.isActive &&
                                                'italic underline decoration-1 underline-offset-8',
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </SheetClose>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto flex flex-col gap-6 pt-10">
                    <SocialIconLinks className="-ml-3" />
                    <SheetClose asChild>
                        <Link
                            href={contact()}
                            className={cn(
                                buttonVariants({ variant: 'paper', size: 'cta' }),
                                'w-full',
                            )}
                        >
                            Napíšte nám
                        </Link>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );
}
