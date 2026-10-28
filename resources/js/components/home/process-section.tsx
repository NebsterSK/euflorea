import process1280 from '@/../images/home/process-1280.webp';
import process1754 from '@/../images/home/process-1754.webp';
import process800 from '@/../images/home/process-800.webp';
import { VineVertical } from '@/components/site/icons';
import { TapedSheet } from '@/components/site/paper';

const steps = [
    {
        numeral: 'i',
        title: 'Zoznámenie',
        text: 'Stretneme sa, porozprávate nám o vás, mieste a predstavách.',
    },
    {
        numeral: 'ii',
        title: 'Návrh',
        text: 'Pripravíme moodboard, výber kvetov a jasný rozpočet.',
    },
    {
        numeral: 'iii',
        title: 'Príprava',
        text: 'Objednáme sezónne kvety a doladíme každý detail.',
    },
    {
        numeral: 'iv',
        title: 'Svadobný deň',
        text: 'Výzdobu nainštalujeme a po oslave aj upraceme.',
    },
];

/**
 * "Ako to rastie": the taped process sheet over a full-bleed colour photo
 * (no overlay, the photo stays vivid). The photo is 160% of the section
 * height so the parallax drift never uncovers an edge; the section uses
 * `overflow-clip`, because an `overflow-hidden` box is a scroll container
 * and the view timeline would track it instead of the page.
 */
export function ProcessSection() {
    return (
        <section className="relative overflow-clip">
            <img
                src={process1280}
                srcSet={`${process800} 800w, ${process1280} 1280w, ${process1754} 1754w`}
                sizes="100vw"
                width={1754}
                height={2631}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-x-0 -top-[30%] h-[160%] w-full parallax-drift bg-photo-bg object-cover object-[center_40%] lg:object-[center_58%]"
            />
            <div className="relative mx-auto max-w-page px-4 pt-75 pb-10 lg:px-10 lg:py-30">
                <TapedSheet className="flex max-w-sheet reveal flex-col gap-9 px-6 pt-13 pb-12 lg:gap-13 lg:px-14 lg:pt-16 lg:pb-15">
                    <div className="flex flex-wrap items-end justify-between gap-8">
                        <h2 className="font-serif text-[42px] leading-[1.05] text-plum md:text-[clamp(40px,4.4vw,64px)]">
                            Ako to <em>rastie</em>
                        </h2>
                        <p className="hidden max-w-105 text-lead text-text lg:block">
                            Od prvej kávy po posledný lupeň. Celú cestu prejdeme
                            spolu, krok za krokom.
                        </p>
                    </div>

                    <ol className="relative flex flex-col gap-9 pl-16 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-10 md:pl-0">
                        <VineVertical
                            aria-hidden="true"
                            preserveAspectRatio="none"
                            className="absolute top-2.5 left-4.5 h-[calc(100%-20px)] w-5 draw-in text-rose-line md:hidden"
                        />
                        {steps.map((step) => (
                            <li
                                key={step.numeral}
                                className="relative flex flex-col gap-1.5 md:gap-3.5"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-1 -left-16 flex size-12 reveal-pop items-center justify-center rounded-full border border-rose-line bg-white font-serif text-[22px] leading-none text-plum italic md:static md:mb-3 md:size-18 md:text-[30px]"
                                >
                                    {step.numeral}
                                </span>
                                <h3 className="font-serif text-[26px] leading-[1.2] font-medium text-ink md:text-[28px]">
                                    {step.title}
                                </h3>
                                <p className="text-copy text-text">
                                    {step.text}
                                </p>
                            </li>
                        ))}
                    </ol>
                </TapedSheet>
            </div>
        </section>
    );
}
