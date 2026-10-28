import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/site/paper';
import { contact } from '@/routes';

type Operator = {
    name: string | null;
    address: string | null;
    company_id: string | null;
    email: string | null;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="font-serif text-[30px] leading-[1.15] text-plum lg:text-4xl">
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function Privacy({
    operator,
    updatedAt,
}: {
    operator: Operator;
    updatedAt: string;
}) {
    const hasOperator = Boolean(operator.name);

    return (
        <>
            <header className="mx-auto flex max-w-page flex-col gap-5 px-6 pt-14 pb-10 lg:px-10 lg:pt-24 lg:pb-14">
                <Eyebrow>Ochrana osobných údajov</Eyebrow>
                <h1 className="max-w-3xl font-serif text-[44px] leading-[1.02] text-balance text-plum lg:text-[clamp(44px,5vw,64px)]">
                    Ako narábame s <em>vašimi údajmi</em>
                </h1>
                <p className="text-eyebrow text-rose-text uppercase md:text-xs">
                    Platné od {updatedAt}
                </p>
            </header>

            <div className="mx-auto max-w-page px-6 pb-24 lg:px-10 lg:pb-32">
                <div className="flex max-w-[68ch] flex-col gap-12 text-lead text-text lg:text-lead-lg [&_a]:text-plum [&_a]:underline [&_a]:underline-offset-3 [&_a:hover]:text-plum-hover [&_li]:pl-1 [&_ul]:list-disc [&_ul]:pl-6">
                    <p>
                        Osobné údaje, ktoré nám pošlete cez kontaktný formulár,
                        používame len na to, aby sme vám mohli odpovedať a
                        pripraviť ponuku na výzdobu vašej svadby. Nižšie
                        nájdete, čo presne spracúvame, prečo a aké máte práva.
                    </p>

                    <Section title="Kto vaše údaje spracúva">
                        {hasOperator ? (
                            <address className="not-italic">
                                {operator.name}
                                {operator.address && (
                                    <>
                                        <br />
                                        {operator.address}
                                    </>
                                )}
                                {operator.company_id && (
                                    <>
                                        <br />
                                        IČO: {operator.company_id}
                                    </>
                                )}
                                {operator.email && (
                                    <>
                                        <br />
                                        <a href={`mailto:${operator.email}`}>
                                            {operator.email}
                                        </a>
                                    </>
                                )}
                            </address>
                        ) : (
                            <p>
                                Prevádzkovateľom je Euflorea, svadobný a
                                kvetinový styling. S otázkami o vašich údajoch
                                sa na nás môžete obrátiť cez{' '}
                                <Link href={contact()}>kontaktný formulár</Link>
                                .
                            </p>
                        )}
                    </Section>

                    <Section title="Aké údaje spracúvame a prečo">
                        <p>Z kontaktného formulára uchovávame:</p>
                        <ul>
                            <li>
                                meno a priezvisko, e-mail a telefón (ak ho
                                uvediete),
                            </li>
                            <li>
                                dátum a miesto svadby, približný počet hostí a
                                služby, ktoré vás zaujímajú,
                            </li>
                            <li>text vašej správy.</li>
                        </ul>
                        <p>
                            Spracúvame ich na základe vášho súhlasu, ktorý
                            dávate zaškrtnutím políčka vo formulári (čl. 6 ods.
                            1 písm. a) GDPR), a s cieľom pripraviť ponuku na
                            vašu žiadosť (čl. 6 ods. 1 písm. b) GDPR).
                        </p>
                        <p>
                            K správe ukladáme aj IP adresu a typ prehliadača.
                            Slúžia len na ochranu formulára pred zneužitím a
                            spamom, čo je náš oprávnený záujem (čl. 6 ods. 1
                            písm. f) GDPR).
                        </p>
                    </Section>

                    <Section title="Ako dlho ich uchovávame">
                        <p>
                            Údaje z dopytu uchovávame počas komunikácie s vami a
                            najdlhšie dva roky od jej skončenia. Ak sa dohodneme
                            na spolupráci, údaje potrebné na fakturáciu
                            uchovávame tak dlho, ako nám to ukladajú účtovné a
                            daňové predpisy.
                        </p>
                    </Section>

                    <Section title="Kto má k údajom prístup">
                        <p>
                            K vašim údajom máme prístup len my. Technicky ich
                            uchovávajú naši poskytovatelia webhostingu a
                            e-mailu, ktorí s nimi môžu narábať iba podľa našich
                            pokynov. Vaše údaje nepredávame a nepoužívame na
                            reklamu.
                        </p>
                    </Section>

                    <Section title="Vaše práva">
                        <p>Kedykoľvek máte právo:</p>
                        <ul>
                            <li>
                                vedieť, aké údaje o vás máme, a dostať ich
                                kópiu,
                            </li>
                            <li>požiadať o opravu alebo vymazanie údajov,</li>
                            <li>
                                obmedziť ich spracúvanie alebo namietať proti
                                nemu,
                            </li>
                            <li>na prenos údajov k inému prevádzkovateľovi,</li>
                            <li>
                                odvolať súhlas; spracúvanie pred jeho odvolaním
                                tým zostáva zákonné.
                            </li>
                        </ul>
                        <p>
                            Stačí nám napísať. Ak sa domnievate, že s údajmi
                            narábame nesprávne, môžete podať návrh Úradu na
                            ochranu osobných údajov Slovenskej republiky,
                            Hraničná 12, 820 07 Bratislava,{' '}
                            <a
                                href="https://dataprotection.gov.sk"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                dataprotection.gov.sk
                            </a>
                            .
                        </p>
                    </Section>

                    <Section title="Fotografie">
                        <p>
                            Fotky svadieb zverejňujeme so súhlasom novomanželov
                            a fotografov. Ak sa na niektorej fotke nájdete a
                            chcete ju odstrániť, napíšte nám a urobíme to.
                        </p>
                    </Section>

                    <Section title="Cookies">
                        <p>
                            Používame iba technicky nevyhnutné cookies, ktoré
                            web potrebuje na fungovanie a na ochranu formulára.
                            Nepoužívame analytické ani reklamné cookies. Písma
                            máme uložené na vlastnom serveri, takže pri návšteve
                            webu sa nič neposiela tretím stranám.
                        </p>
                    </Section>
                </div>
            </div>
        </>
    );
}
