import { Link, usePage } from '@inertiajs/react';
import { SocialCard } from '@/components/site/social-card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { contact } from '@/routes';

/**
 * "Plánujete svadbu? Porozprávajme sa." with the contact button and the two
 * social cards. Shared by the homepage and the album page.
 */
export function CtaSection() {
    const { social } = usePage().props;

    return (
        <section className="mx-auto grid max-w-page gap-5.5 px-4 pt-20 pb-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-10 lg:pt-35 lg:pb-30">
            <div className="flex flex-col gap-5.5 px-2 lg:gap-6.5 lg:px-0">
                <h2 className="font-serif text-[42px] leading-[1.02] text-plum lg:text-[clamp(44px,5vw,68px)]">
                    Plánujete svadbu? <em>Porozprávajme sa.</em>
                </h2>
                <p className="max-w-prose text-lead text-text lg:text-lead-lg">
                    Napíšte nám termín a miesto a ozveme sa do dvoch dní.
                </p>
                <Link
                    href={contact()}
                    className={cn(
                        buttonVariants({ variant: 'paper', size: 'cta' }),
                        'mt-1.5 mb-5 lg:my-0 lg:self-start',
                    )}
                >
                    Kontaktujte nás
                </Link>
            </div>
            <div className="flex flex-col gap-4.5">
                <SocialCard network="instagram" profile={social.instagram} />
                <SocialCard network="facebook" profile={social.facebook} />
            </div>
        </section>
    );
}
