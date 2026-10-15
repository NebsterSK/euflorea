import { usePage } from '@inertiajs/react';
import { InquiryForm } from '@/components/contact/inquiry-form';
import { Eyebrow, PaperCard } from '@/components/site/paper';
import { SocialCard } from '@/components/site/social-card';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string };

const personTilts = ['-rotate-[0.7deg]', 'rotate-[0.6deg]'];

export default function Contact({
    people,
    guestOptions,
    serviceOptions,
}: {
    people: App.Data.Site.ContactPersonData[];
    guestOptions: Option[];
    serviceOptions: Option[];
}) {
    const { social } = usePage().props;

    return (
        <>

            <div className="mx-auto grid max-w-page gap-14 px-4 pt-14 pb-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-10 lg:pt-24 lg:pb-32">
                <div className="flex flex-col gap-10 lg:pt-4">
                    <section className="flex flex-col gap-5 px-2 lg:px-0">
                        <Eyebrow>Kontakt</Eyebrow>
                        <h1 className="font-serif text-[44px] leading-[1.02] text-balance text-plum lg:text-[clamp(44px,5vw,72px)]">
                            Plánujete <em>svadbu</em>?
                        </h1>
                        <p className="max-w-prose text-lead text-text lg:text-lead-lg">
                            Napíšte nám termín a miesto a ozveme sa do dvoch dní.
                        </p>
                    </section>

                    {people.length > 0 && (
                        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                            {people.map((person, position) => (
                                <li key={person.name}>
                                    <PaperCard
                                        className={personTilts[position % personTilts.length]}
                                        innerClassName="flex flex-col gap-1.5 p-5"
                                    >
                                        <p className="font-serif text-2xl font-medium text-plum">
                                            {person.name}
                                        </p>
                                        {person.role && (
                                            <p className="text-eyebrow text-rose-text uppercase md:text-xs">
                                                {person.role}
                                            </p>
                                        )}
                                        {person.phone && (
                                            <a
                                                href={`tel:${person.phone.replace(/\s+/g, '')}`}
                                                className="mt-2 py-1 text-lead text-plum underline-offset-4 select-all hover:underline"
                                            >
                                                {person.phone}
                                            </a>
                                        )}
                                        {person.email && (
                                            <a
                                                href={`mailto:${person.email}`}
                                                className="py-1 text-lead break-all text-plum underline-offset-4 select-all hover:underline"
                                            >
                                                {person.email}
                                            </a>
                                        )}
                                    </PaperCard>
                                </li>
                            ))}
                        </ul>
                    )}

                    <section
                        aria-label="Sociálne siete"
                        className={cn(
                            'grid gap-4.5',
                            social.facebook.url && 'md:grid-cols-2 lg:grid-cols-1',
                        )}
                    >
                        <SocialCard network="instagram" profile={social.instagram} />
                        <SocialCard network="facebook" profile={social.facebook} />
                    </section>
                </div>

                <div className="lg:pt-6">
                    <InquiryForm
                        guestOptions={guestOptions}
                        serviceOptions={serviceOptions}
                    />
                </div>
            </div>
        </>
    );
}
