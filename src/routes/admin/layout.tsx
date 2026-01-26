import { createFileRoute, Link, LinkOptions, linkOptions, Outlet } from '@tanstack/react-router';
import TihldeLogo from '~/components/miscellaneous/TihldeLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '~/components/ui/sidebar';
import {
  BookmarkIcon,
  BriefcaseBusinessIcon,
  CalendarIcon,
  DotSquare,
  FileUserIcon,
  LayoutDashboardIcon,
  LucideIcon,
  NewspaperIcon,
  UserIcon,
  Users2Icon,
} from 'lucide-react';
import * as React from 'react';

import { AdminLayoutHeader } from './components/AdminLayoutHeader';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar variant='sidebar' />
      <SidebarInset className='h-screen overflow-y-auto overscroll-none'>
        <AdminLayoutHeader />
        <div className='p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

type SidebarGroup = {
  id: string;
  label?: string;
  items: {
    label: string;
    link: LinkOptions;

    icon?: LucideIcon;
    exact?: boolean;
  }[];
};

const sidebarMenuGroups: SidebarGroup[] = [
  {
    id: 'main',
    items: [
      //
      { label: 'Dashboard', icon: LayoutDashboardIcon, link: linkOptions({ to: '/admin' }), exact: true },
    ],
  },
  {
    id: 'content',
    label: 'Innhold',
    items: [
      { label: 'Arrangementer', icon: CalendarIcon, link: linkOptions({ to: '/admin/arrangementer/{-$eventId}' }) },
      { label: 'Nyheter', icon: NewspaperIcon, link: linkOptions({ to: '/admin/nyheter/{-$newsId}' }) },
      { label: 'Annonser', icon: BriefcaseBusinessIcon, link: linkOptions({ to: '/admin/stillingsannonser/{-$jobPostId}' }) },
      { label: 'Bannere', icon: BookmarkIcon, link: linkOptions({ to: '/admin/bannere' }) },
    ],
  },
  {
    id: 'admin',
    label: 'Administrasjon',
    items: [
      { label: 'Brukere', icon: UserIcon, link: linkOptions({ to: '/admin/brukere' }) },
      { label: 'Ny Grupper', icon: Users2Icon, link: linkOptions({ to: '/admin/ny-gruppe' }) },
      { label: 'Prikker', icon: DotSquare, link: linkOptions({ to: '/admin/prikker' }) },
      { label: 'Opptak', icon: FileUserIcon, link: linkOptions({ to: '/admin/opptak' }) },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='h-12'>
            <SidebarMenuButton render={<Link aria-label='Til forsiden' to='/' className='h-full w-full cursor-pointer' />}>
              <TihldeLogo className='w-full! h-full! text-primary' size='large' />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {sidebarMenuGroups.map((group) => (
          <SidebarGroup key={group.id}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    render={
                      <Link
                        {...item.link}
                        className='[&.active]:bg-sidebar-primary [&.active]:text-sidebar-primary-foreground'
                        activeProps={{ className: 'active' }}
                        activeOptions={{ exact: item.exact ?? false }}
                      />
                    }>
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
