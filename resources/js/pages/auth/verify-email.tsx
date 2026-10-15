// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Overenie e-mailu" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Na e-mailovú adresu, ktorú ste zadali pri registrácii, sme
                    poslali nový overovací odkaz.
                </div>
            )}

            <Form {...send.form()} className="text-center">
                {({ processing }) => (
                    <fieldset disabled={processing} className="space-y-6">
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Znova poslať overovací e-mail
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Odhlásiť sa
                        </TextLink>
                    </fieldset>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Overenie e-mailu',
    description:
        'Overte svoju e-mailovú adresu kliknutím na odkaz, ktorý sme vám práve poslali.',
};
