import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { useOptionalAuth } from '~/hooks/auth';
import { useLogout } from '~/hooks/User';
import { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { LogOutIcon } from 'lucide-react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { href, useNavigate } from 'react-router';

const navigationLinks = [
  { name: 'Hjem', path: href('/') },
  { name: 'Profil', path: href('/profil/:userId?') },
  { name: 'Arrangementer', path: href('/arrangementer') },
  { name: 'Nyheter', path: href('/nyheter') },
  { name: 'Stillingsannonser', path: href('/stillingsannonser') },
  { name: 'Grupper', path: href('/grupper') },
  { name: 'Galleri', path: href('/galleri') },
  { name: 'Bugs', path: href('/tilbakemelding') },
];

const externalLinks = [
  { name: 'Wiki', path: URLS.wiki },
  { name: 'GitHub', path: URLS.github },
  { name: 'Fondet', path: URLS.fondet },
  { name: 'Kontres', path: URLS.kontRes },
  { name: 'Pythons Herrer', path: URLS.pythons },
  { name: 'Pythons Damer', path: URLS.pythonsLadies },
];

export default function ShortCutMenu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const logout = useLogout();

  useEffect(() => {
    const abc = new AbortController();
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          setOpen((prev) => !prev);
        }
      },
      { signal: abc.signal },
    );
    return () => abc.abort();
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder='Søk eller velg et alternativ...' />
      <CommandList className='[&>div]:space-y-4'>
        <CommandEmpty>Ingen resultater funnet</CommandEmpty>

        {/* These load user data */}
        <Suspense fallback={<div>Laster bruker data...</div>}>
          <MembershipOptions closeMenu={closeMenu} />
          <AdminOptions closeMenu={closeMenu} />
          <ToolOptions closeMenu={closeMenu} />
        </Suspense>

        <CommandGroup heading='Navigering'>
          {navigationLinks.map((link) => (
            <CommandItem
              key={link.name}
              value={'nav-' + link.name}
              keywords={[link.name]}
              onSelect={() => {
                navigate(link.path);
                closeMenu();
              }}>
              {link.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading='Eksterne lenker'>
          {externalLinks.map((link) => (
            <CommandItem
              key={link.name}
              value={'external-' + link.name}
              keywords={[link.name]}
              onSelect={() => {
                window.open(link.path, '_blank');
                closeMenu();
              }}>
              {link.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading='Bruker'>
          <CommandItem
            onSelect={() => {
              closeMenu();
              logout();
            }}
            value='logg ut'
            className='text-red-600 data-[selected=true]:text-red-600 flex gap-2'>
            <LogOutIcon /> Logg ut
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function MembershipOptions({ closeMenu }: { closeMenu: () => void }) {
  const { auth } = useOptionalAuth();
  const navigate = useNavigate();

  if (!auth) return null;
  if (auth.user.groups.length === 0) return null;

  return (
    <>
      <CommandGroup heading='Mine medlemskap'>
        {auth.user.groups.map((group) => (
          <CommandItem
            key={group.id}
            value={'group-' + group.name}
            keywords={[group.name, 'gruppe', 'groups']}
            onSelect={() => {
              navigate(href('/grupper/:slug', { slug: group.id }));
              closeMenu();
            }}>
            {group.name}
          </CommandItem>
        ))}
      </CommandGroup>
    </>
  );
}

function AdminOptions({ closeMenu }: { closeMenu: () => void }) {
  const { auth } = useOptionalAuth();
  const navigate = useNavigate();
  const apps = useMemo(() => {
    if (!auth) return [];

    return [
      {
        apps: [PermissionApp.EVENT],
        title: 'Arrangementer',
        path: href('/admin/arrangementer/:eventId?'),
      },
      {
        apps: [PermissionApp.GROUP],
        title: 'Grupper',
        path: href('/grupper'),
      },
      {
        apps: [PermissionApp.JOBPOST],
        title: 'Stillingsannonser',
        path: href('/admin/stillingsannonser/:jobPostId?'),
      },
      {
        apps: [PermissionApp.USER],
        title: 'Medlemmer',
        path: href('/admin/brukere'),
      },
      {
        apps: [PermissionApp.NEWS],
        title: 'Nyheter',
        path: href('/admin/nyheter/:newsId?'),
      },
      {
        apps: [PermissionApp.STRIKE],
        title: 'Prikker',
        path: href('/admin/prikker'),
      },
      {
        apps: [PermissionApp.BANNERS],
        title: 'Bannere',
        path: href('/admin/bannere'),
      },
    ].filter(({ apps: requiredApps }) => requiredApps.every((app) => auth.permissions[app]?.write === true || auth.permissions[app]?.write_all === true));
  }, [auth]);

  if (!auth || apps.length === 0) return null;
  return (
    <CommandGroup heading='Admin'>
      {apps.map((app) => (
        <CommandItem
          key={app.title}
          value={app.title + '-admin'}
          keywords={[app.title, 'admin', 'administrasjon', 'administrer']}
          onSelect={() => {
            navigate(app.path);
            closeMenu();
          }}>
          {app.title}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

function ToolOptions({ closeMenu }: { closeMenu: () => void }) {
  const { auth } = useOptionalAuth();
  const navigate = useNavigate();
  if (!auth) return null;

  return (
    <CommandGroup heading='Verktøy'>
      <CommandItem
        onSelect={() => {
          navigate(href('/linker'));
          closeMenu();
        }}>
        Link forkorter
      </CommandItem>
      <CommandItem
        onSelect={() => {
          navigate(href('/qr-koder'));
          closeMenu();
        }}>
        QR-Generator
      </CommandItem>
      <CommandItem
        onSelect={() => {
          navigate(href('/kokebok/:studyId?/:classId?'));
          closeMenu();
        }}>
        Kokebok
      </CommandItem>
    </CommandGroup>
  );
}
