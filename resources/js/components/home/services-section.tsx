import {
    BouquetIcon,
    CeremonyArchIcon,
    TableIcon,
    VenueVaseIcon,
} from '@/components/site/icons';
import { PaperCard } from '@/components/site/paper';
import { cn } from '@/lib/utils';

const services = [
    {
        title: 'Svadobné kytice',
        description:
            'Kytica pre nevestu, pierka pre svedkov a kvety do vlasov.',
        Icon: BouquetIcon,
        tilt: '-rotate-[0.8deg] lg:-rotate-1',
    },
    {
        title: 'Výzdoba obradu',
        description:
            'Kvetinové brány, uličky a oltáre v kostole aj pod holým nebom.',
        Icon: CeremonyArchIcon,
        tilt: 'rotate-[0.7deg] lg:rotate-[0.8deg] lg:translate-y-4.5',
    },
    {
        title: 'Stolovanie a hostina',
        description:
            'Aranžmány na stoly, sviečky, menovky a hlavný stôl mladomanželov.',
        Icon: TableIcon,
        tilt: '-rotate-[0.5deg] lg:-rotate-[0.6deg]',
    },
    {
        title: 'Styling priestoru',
        description:
            'Celkový koncept: farby, textílie a kvety, ktoré spoja celý deň.',
        Icon: VenueVaseIcon,
        tilt: 'rotate-[0.9deg] lg:rotate-[1.1deg] lg:translate-y-2.5',
    },
];

export function ServicesSection() {
    return (
        <section className="mx-auto flex max-w-page flex-col gap-5.5 px-4 pb-22.5 lg:gap-12 lg:px-10 lg:pb-37.5">
            <div className="reveal border-b border-rule px-2 pb-3.5 lg:px-0 lg:pb-5">
                <h2 className="font-serif text-[34px] leading-[1.1] text-plum md:text-[40px] lg:text-5xl">
                    Čo pre vás urobíme
                </h2>
            </div>
            <ul className="grid gap-5.5 md:grid-cols-2 md:gap-7 xl:grid-cols-4">
                {services.map(({ title, description, Icon, tilt }) => (
                    <li key={title}>
                        <PaperCard
                            className={cn(
                                'h-full reveal transition-[rotate,translate] duration-500 ease-soft lg:hover:-translate-y-0.75 lg:hover:rotate-0 motion-reduce:lg:hover:translate-y-0',
                                tilt,
                            )}
                            innerClassName="flex items-start gap-4.5 p-5 md:min-h-75 md:flex-col md:gap-4 md:px-6.5 md:pt-8.5 md:pb-7.5"
                        >
                            <Icon
                                aria-hidden="true"
                                className="size-12 shrink-0 draw-in text-plum md:size-14"
                            />
                            <div className="flex flex-col gap-1.5 md:gap-4">
                                <h3 className="font-serif text-2xl leading-[1.2] font-medium text-plum md:text-[26px] lg:text-[28px]">
                                    {title}
                                </h3>
                                <p className="text-copy text-text">
                                    {description}
                                </p>
                            </div>
                        </PaperCard>
                    </li>
                ))}
            </ul>
        </section>
    );
}
