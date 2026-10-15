import { Head } from '@inertiajs/react';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { IntroSection } from '@/components/home/intro-section';
import { ProcessSection } from '@/components/home/process-section';
import { ServicesSection } from '@/components/home/services-section';
import { CtaSection } from '@/components/site/cta-section';
import { Logo } from '@/components/site/logo';

export default function Home({
    slides,
}: {
    slides: App.Data.Site.ImageData[];
}) {
    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Euflorea, svadobný a kvetinový styling. Navrhujeme a realizujeme svadobné kytice, výzdobu obradu, stolovanie aj styling celého priestoru."
                />
            </Head>

            <div className="mx-auto flex max-w-page justify-center px-5 pt-10 lg:px-10 lg:pt-16">
                <h1 className="w-full lg:w-[min(760px,86%)]">
                    <Logo withTagline />
                </h1>
            </div>

            <HeroCarousel slides={slides} />
            <IntroSection />
            <ServicesSection />
            <ProcessSection />
            <CtaSection />
        </>
    );
}
