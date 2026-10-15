import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { index, login, register } from '@/routes';

export default function GuestLayout({
    canRegister,
    children,
}: {
    canRegister: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    <Link href={index()} className="flex items-center gap-x-2">
                        <AppLogo />
                    </Link>

                    <div className="ml-auto hidden items-center space-x-2 lg:flex">
                        <Link
                            href={login()}
                            className={buttonVariants({ variant: 'ghost' })}
                        >
                            Log in
                        </Link>

                        {canRegister && (
                            <Link
                                href={register()}
                                className={buttonVariants()}
                            >
                                Register
                            </Link>
                        )}
                    </div>

                    <div className="ml-auto lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-75 p-6">
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>

                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="size-6 fill-current text-black dark:text-white" />
                                </SheetHeader>

                                <div className="flex h-full flex-1 flex-col justify-between space-y-4 py-6">
                                    <nav className="-mx-3 space-y-1">
                                        <Link
                                            href={login()}
                                            className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                        >
                                            Log in
                                        </Link>

                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                {children}
            </main>
        </div>
    );
}
