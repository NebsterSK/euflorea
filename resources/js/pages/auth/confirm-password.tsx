import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Potvrdenie hesla" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <fieldset disabled={processing} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Heslo</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Heslo"
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Potvrdiť heslo
                            </Button>
                        </div>
                    </fieldset>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Potvrdenie hesla',
    description:
        'Toto je zabezpečená časť aplikácie. Pred pokračovaním potvrďte svoje heslo.',
};
