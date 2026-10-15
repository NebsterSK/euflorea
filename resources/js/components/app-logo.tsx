import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-serif text-lg leading-tight font-medium text-plum">
                    Euflorea
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Administrácia
                </span>
            </div>
        </>
    );
}
