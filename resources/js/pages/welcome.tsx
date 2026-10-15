import { Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';

export default function Welcome({ canRegister }: { canRegister: boolean }) {
    return (
        <GuestLayout canRegister={canRegister}>
            <Head title="Welcome" />
        </GuestLayout>
    );
}
