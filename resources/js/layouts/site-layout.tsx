import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

/**
 * Public site shell: paper background (on body), header, footer. Content
 * that bleeds or hangs off the edge (sprigs, tilted cards) is clipped here so
 * the page never scrolls horizontally.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col overflow-x-clip text-ink">
            <a
                href="#obsah"
                className="sr-only z-50 bg-paper-card px-4 py-3 text-plum focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
            >
                Preskočiť na obsah
            </a>
            <SiteHeader />
            <main id="obsah" className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
