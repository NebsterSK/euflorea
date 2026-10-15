import { Link } from '@inertiajs/react';
import { HeartIcon } from '@/components/site/icons';
import { Logo } from '@/components/site/logo';
import { useSiteNav } from '@/components/site/site-header';
import { cn } from '@/lib/utils';
import { index, privacy } from '@/routes';

export function SiteFooter() {
    const nav = useSiteNav();
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t border-rule">
            <div className="mx-auto flex max-w-page flex-col items-center gap-5 px-6 pt-9 pb-11 text-small text-muted-ink lg:flex-row lg:flex-wrap lg:justify-between lg:gap-6 lg:px-10 lg:py-11">
                <Link href={index()} aria-label="Euflorea, domov">
                    <Logo className="w-31 lg:w-36" />
                </Link>

                <nav aria-label="Päta">
                    <ul className="flex flex-wrap justify-center gap-2 lg:gap-7">
                        {nav.map((item) => (
                            <li key={item.title}>
                                <Link
                                    href={item.href}
                                    aria-current={
                                        item.isActive ? 'page' : undefined
                                    }
                                    className={cn(
                                        'block p-3 text-plum underline underline-offset-4 transition-colors hover:text-plum-hover lg:border-b lg:border-transparent lg:px-0.5 lg:text-nav lg:uppercase lg:no-underline lg:hover:border-plum lg:hover:text-plum',
                                        item.isActive && 'lg:border-plum',
                                    )}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex flex-col items-center gap-1 lg:items-end">
                    <p className="flex flex-wrap items-center justify-center gap-1.5">
                        © {year} Euflorea
                        <span aria-hidden="true" className="opacity-50">
                            ·
                        </span>
                        Made with
                        <HeartIcon
                            role="img"
                            aria-label="love"
                            className="h-3 w-3.25"
                        />
                        by
                        <a
                            href="https://legacy-upgrade.com/"
                            className="py-1.5 text-plum underline underline-offset-3 hover:text-plum-hover"
                        >
                            Legacy Upgrade
                        </a>
                    </p>
                    <Link
                        href={privacy()}
                        className="py-1.5 text-plum underline underline-offset-3 hover:text-plum-hover"
                    >
                        Ochrana osobných údajov
                    </Link>
                </div>
            </div>
        </footer>
    );
}
