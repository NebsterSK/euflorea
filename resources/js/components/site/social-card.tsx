import { FacebookIcon, InstagramIcon } from '@/components/site/icons';
import { cn } from '@/lib/utils';
import type { SocialProfile } from '@/types';

const networks = {
    instagram: {
        label: 'Instagram',
        Icon: InstagramIcon,
        card: 'bg-plum text-cream -rotate-1 hover:rotate-[0.6deg] focus-visible:rotate-[0.6deg] motion-reduce:hover:-rotate-1',
        labelClassName: 'text-blush',
    },
    facebook: {
        label: 'Facebook',
        Icon: FacebookIcon,
        card: 'border border-rule-strong bg-paper-card text-plum rotate-[0.6deg] hover:-rotate-[0.8deg] focus-visible:-rotate-[0.8deg] motion-reduce:hover:rotate-[0.6deg]',
        labelClassName: 'text-rose-text',
    },
} as const;

/**
 * Large tilted link card to Instagram or Facebook (approved hover: the tilt
 * flips, the card lifts, the icon turns and the arrow slides).
 */
export function SocialCard({
    network,
    profile,
    className,
}: {
    network: keyof typeof networks;
    profile: SocialProfile;
    className?: string;
}) {
    if (!profile.url) {
        return null;
    }

    const { label, Icon, card, labelClassName } = networks[network];

    return (
        <a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                'group flex items-center gap-4.5 p-6 no-underline transition-[rotate,translate,scale,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:scale-[1.012] hover:shadow-lift focus-visible:-translate-y-1 focus-visible:scale-[1.012] focus-visible:shadow-lift motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 lg:gap-6 lg:px-8.5 lg:py-7.5',
                card,
                className,
            )}
        >
            <Icon
                aria-hidden="true"
                className="size-10.5 shrink-0 stroke-[1.1] transition-transform duration-400 group-hover:-rotate-8 motion-reduce:group-hover:rotate-0 lg:size-13"
            />
            <span className="flex grow flex-col gap-0.5 lg:gap-1">
                <span
                    className={cn(
                        'text-eyebrow tracking-[0.22em] uppercase lg:text-xs',
                        labelClassName,
                    )}
                >
                    {label}
                </span>
                <span className="font-serif text-[30px] leading-[1.1] italic lg:text-4xl">
                    {profile.handle}
                </span>
            </span>
            <span
                aria-hidden="true"
                className="hidden text-[28px] transition-transform duration-400 group-hover:translate-x-2 motion-reduce:group-hover:translate-x-0 lg:inline-block"
            >
                →
            </span>
            <span className="sr-only">(otvorí sa v novom okne)</span>
        </a>
    );
}
