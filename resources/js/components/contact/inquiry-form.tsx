import { Form, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DayPicker } from 'react-day-picker';
import { sk } from 'react-day-picker/locale';
import ContactController from '@/actions/App/Http/Controllers/Site/ContactController';
import { DillSprig } from '@/components/site/icons';
import { TapedSheet } from '@/components/site/paper';
import { buttonVariants } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { privacy } from '@/routes';

type Option = { value: string; label: string };

const fieldClassName =
    'block w-full border border-rule-strong bg-paper-card px-4 py-3 text-base font-light text-ink placeholder:text-muted-ink/80 focus-visible:border-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum aria-invalid:border-destructive disabled:opacity-60';

const fieldLabels: Record<string, string> = {
    name: 'Meno a priezvisko',
    email: 'E-mail',
    phone: 'Telefón',
    wedding_date: 'Dátum svadby',
    venue: 'Miesto svadby',
    guests: 'Približný počet hostí',
    services: 'Čo vás zaujíma',
    message: 'Vaša predstava',
    consent: 'Súhlas',
};

function Field({
    id,
    label,
    optional,
    error,
    children,
    className,
}: {
    id: string;
    label: string;
    optional?: boolean;
    error?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label
                htmlFor={id}
                className="text-eyebrow text-rose-text uppercase md:text-xs"
            >
                {label}
                {optional && (
                    <span className="ml-1.5 tracking-normal normal-case opacity-80">
                        (nepovinné)
                    </span>
                )}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} className="text-small text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

function errorProps(id: string, error?: string) {
    return error
        ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` }
        : {};
}

function toIsoDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * The inquiry form on a taped paper sheet. On success it is replaced by a
 * thank-you card (the toast comes from the server flash).
 */
export function InquiryForm({
    guestOptions,
    serviceOptions,
}: {
    guestOptions: Option[];
    serviceOptions: Option[];
}) {
    const { social } = usePage().props;
    const [sent, setSent] = useState(false);
    const [weddingDate, setWeddingDate] = useState<Date | undefined>();
    const [dateUnknown, setDateUnknown] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sent) {
        return (
            <TapedSheet className="flex rotate-0 flex-col items-center gap-6 px-6 py-16 text-center lg:rotate-0 lg:px-14 lg:py-20">
                <DillSprig
                    withSideBranch={false}
                    aria-hidden="true"
                    className="h-32 w-16 text-rose"
                />
                <h2
                    className="font-serif text-[34px] leading-[1.1] text-plum outline-none lg:text-[44px]"
                    tabIndex={-1}
                    ref={(element) => element?.focus()}
                >
                    Ďakujeme! <em>Ozveme sa vám</em> do dvoch dní.
                </h2>
                {social.instagram.url && (
                    <p className="max-w-prose text-lead text-text">
                        Medzitým sa môžete pozrieť, čo práve chystáme{' '}
                        <a
                            href={social.instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-plum underline underline-offset-3 hover:text-plum-hover"
                        >
                            na Instagrame
                        </a>
                        .
                    </p>
                )}
            </TapedSheet>
        );
    }

    return (
        <TapedSheet className="rotate-0 px-5 pt-12 pb-10 sm:px-8 lg:rotate-0 lg:px-14 lg:pt-16 lg:pb-14">
            <Form
                {...ContactController.send.form()}
                options={{ preserveScroll: true }}
                onSuccess={() => setSent(true)}
            >
                {({ processing, errors }) => {
                    const messages = Object.entries(errors);

                    return (
                        <fieldset
                            disabled={processing}
                            className="flex flex-col gap-6"
                        >
                            <legend className="mb-8 font-serif text-[34px] leading-[1.1] text-plum lg:text-[44px]">
                                Napíšte nám o <em>vašej svadbe</em>
                            </legend>

                            {messages.length > 0 && (
                                <div
                                    role="alert"
                                    className="border border-destructive/50 bg-paper-card px-4 py-3 text-small text-destructive"
                                >
                                    <p className="font-normal">
                                        Skontrolujte prosím formulár:
                                    </p>
                                    <ul className="mt-1 list-disc pl-5">
                                        {messages.map(([field, message]) => (
                                            <li key={field}>
                                                {fieldLabels[
                                                    field.split('.')[0]
                                                ]
                                                    ? `${fieldLabels[field.split('.')[0]]}: `
                                                    : ''}
                                                {message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="grid gap-6 md:grid-cols-2">
                                <Field
                                    id="name"
                                    label="Meno a priezvisko"
                                    error={errors.name}
                                >
                                    <input
                                        id="name"
                                        name="name"
                                        required
                                        maxLength={120}
                                        autoComplete="name"
                                        className={fieldClassName}
                                        {...errorProps('name', errors.name)}
                                    />
                                </Field>
                                <Field
                                    id="email"
                                    label="E-mail"
                                    error={errors.email}
                                >
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className={fieldClassName}
                                        {...errorProps('email', errors.email)}
                                    />
                                </Field>
                                <Field
                                    id="phone"
                                    label="Telefón"
                                    optional
                                    error={errors.phone}
                                >
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        maxLength={30}
                                        autoComplete="tel"
                                        className={fieldClassName}
                                        {...errorProps('phone', errors.phone)}
                                    />
                                </Field>
                                <Field
                                    id="wedding_date"
                                    label="Dátum svadby"
                                    error={errors.wedding_date}
                                >
                                    <input
                                        type="hidden"
                                        name="wedding_date"
                                        value={
                                            weddingDate && !dateUnknown
                                                ? toIsoDate(weddingDate)
                                                : ''
                                        }
                                    />
                                    <Popover
                                        open={calendarOpen}
                                        onOpenChange={setCalendarOpen}
                                    >
                                        <PopoverTrigger
                                            id="wedding_date"
                                            disabled={dateUnknown}
                                            className={cn(
                                                fieldClassName,
                                                'text-left',
                                                !weddingDate &&
                                                    'text-muted-ink',
                                            )}
                                            {...errorProps(
                                                'wedding_date',
                                                errors.wedding_date,
                                            )}
                                        >
                                            {weddingDate && !dateUnknown
                                                ? weddingDate.toLocaleDateString(
                                                      'sk-SK',
                                                      {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : dateUnknown
                                                  ? 'Zatiaľ nevieme'
                                                  : 'Vyberte dátum'}
                                        </PopoverTrigger>
                                        <PopoverContent
                                            align="start"
                                            className="w-auto rounded-none border-rule-strong bg-paper-card p-3"
                                        >
                                            <DayPicker
                                                mode="single"
                                                locale={sk}
                                                selected={weddingDate}
                                                defaultMonth={weddingDate}
                                                disabled={{ before: today }}
                                                startMonth={today}
                                                onSelect={(date) => {
                                                    setWeddingDate(date);
                                                    setCalendarOpen(false);
                                                }}
                                                classNames={{
                                                    root: 'text-ink',
                                                    months: 'relative',
                                                    month_caption:
                                                        'flex h-10 items-center justify-center font-serif text-xl text-plum capitalize',
                                                    nav: 'absolute inset-x-0 top-0 flex h-10 items-center justify-between',
                                                    button_previous:
                                                        'flex size-10 items-center justify-center text-plum disabled:opacity-30',
                                                    button_next:
                                                        'flex size-10 items-center justify-center text-plum disabled:opacity-30',
                                                    chevron: 'size-4 fill-plum',
                                                    weekday:
                                                        'size-10 text-eyebrow font-light text-rose-text uppercase',
                                                    day: 'p-0',
                                                    day_button:
                                                        'size-10 rounded-full text-small hover:bg-bud',
                                                    selected:
                                                        '[&>button]:bg-plum [&>button]:text-paper',
                                                    today: 'font-medium text-plum',
                                                    disabled:
                                                        'opacity-30 [&>button]:hover:bg-transparent',
                                                    outside: 'opacity-40',
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <label className="flex min-h-11 items-center gap-3 text-small text-text">
                                        <input
                                            type="checkbox"
                                            name="date_unknown"
                                            value="1"
                                            checked={dateUnknown}
                                            onChange={(event) =>
                                                setDateUnknown(
                                                    event.target.checked,
                                                )
                                            }
                                            className="size-5 accent-plum"
                                        />
                                        Dátum ešte nevieme presne
                                    </label>
                                </Field>
                                <Field
                                    id="venue"
                                    label="Miesto svadby"
                                    optional
                                    error={errors.venue}
                                >
                                    <input
                                        id="venue"
                                        name="venue"
                                        maxLength={160}
                                        className={fieldClassName}
                                        {...errorProps('venue', errors.venue)}
                                    />
                                </Field>
                                <Field
                                    id="guests"
                                    label="Približný počet hostí"
                                    optional
                                    error={errors.guests}
                                >
                                    <select
                                        id="guests"
                                        name="guests"
                                        defaultValue=""
                                        className={cn(
                                            fieldClassName,
                                            'appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10',
                                        )}
                                        style={{
                                            backgroundImage:
                                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2354284A' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M5 9l7 7 7-7'/%3E%3C/svg%3E\")",
                                        }}
                                        {...errorProps('guests', errors.guests)}
                                    >
                                        <option value="">Vyberte</option>
                                        {guestOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <fieldset className="flex flex-col gap-3">
                                <legend className="mb-2 text-eyebrow text-rose-text uppercase md:text-xs">
                                    Čo vás zaujíma
                                    <span className="ml-1.5 tracking-normal normal-case opacity-80">
                                        (nepovinné)
                                    </span>
                                </legend>
                                <div className="flex flex-wrap gap-2.5">
                                    {serviceOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex min-h-11 cursor-pointer items-center border border-rule-strong bg-paper-card px-4 text-small text-plum transition-colors select-none has-checked:border-plum has-checked:bg-plum has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-plum"
                                        >
                                            <input
                                                type="checkbox"
                                                name="services[]"
                                                value={option.value}
                                                className="sr-only"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <Field
                                id="message"
                                label="Vaša predstava"
                                error={errors.message}
                            >
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    maxLength={3000}
                                    placeholder="Ako si svadbu predstavujete? Farby, kvety, štýl, čokoľvek vás napadne."
                                    className={cn(fieldClassName, 'resize-y')}
                                    {...errorProps('message', errors.message)}
                                />
                            </Field>

                            <div
                                aria-hidden="true"
                                className="absolute -left-[9999px] h-px w-px overflow-hidden"
                            >
                                <label htmlFor="fax_number_confirm">
                                    Webstránka
                                </label>
                                <input
                                    id="fax_number_confirm"
                                    name="fax_number_confirm"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-start gap-3 text-small text-text">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        value="1"
                                        required
                                        className="mt-0.5 size-5 shrink-0 accent-plum"
                                        {...errorProps(
                                            'consent',
                                            errors.consent,
                                        )}
                                    />
                                    <span>
                                        Súhlasím so{' '}
                                        <Link
                                            href={privacy()}
                                            target="_blank"
                                            className="text-plum underline underline-offset-3 hover:text-plum-hover"
                                        >
                                            spracovaním osobných údajov
                                        </Link>
                                        , aby ste mi mohli odpovedať.
                                    </span>
                                </label>
                                {errors.consent && (
                                    <p
                                        id="consent-error"
                                        className="text-small text-destructive"
                                    >
                                        {errors.consent}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={cn(
                                    buttonVariants({
                                        variant: 'paper',
                                        size: 'cta',
                                    }),
                                    'mt-2 w-full sm:w-auto sm:self-start',
                                )}
                            >
                                {processing && <Spinner />}
                                {processing ? 'Odosielam…' : 'Odoslať správu'}
                            </button>
                        </fieldset>
                    );
                }}
            </Form>
        </TapedSheet>
    );
}
