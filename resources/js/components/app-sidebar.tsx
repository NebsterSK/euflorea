import { Link } from '@inertiajs/react';
import { ExternalLink, Images, Inbox, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, index } from '@/routes';
import { index as albumsIndex } from '@/routes/admin/albums';
import { index as inquiriesIndex } from '@/routes/admin/inquiries';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Prehľad',
        href: dashboard(),
        icon: LayoutGrid,
        exact: true,
    },
    {
        title: 'Albumy',
        href: albumsIndex(),
        icon: Images,
    },
    {
        title: 'Dopyty',
        href: inquiriesIndex(),
        icon: Inbox,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Zobraziť web',
        href: index(),
        icon: ExternalLink,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
