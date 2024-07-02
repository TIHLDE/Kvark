import { CalendarRange, CircleDollarSign, CircleHelp, Info, LucideIcon, Scale } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { FormGroupValues } from 'types';

import { useGroup } from 'hooks/Group';
import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';
import { useIsAuthenticated } from 'hooks/User';

import GroupInfo from 'pages/Groups/about';
import GroupAdmin from 'pages/Groups/components/GroupAdmin';
import GroupEvents from 'pages/Groups/events';
import GroupFines from 'pages/Groups/fines';
import { FinesProvider } from 'pages/Groups/fines/FinesContext';
import GroupForms from 'pages/Groups/forms';
import GroupLaws from 'pages/Groups/laws';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { GoBackButton } from 'components/ui/button';
import { CardContent, CardHeader } from 'components/ui/card';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';

import AddFineDialog from './fines/AddFineDialog';

const GroupDetails = () => {
  const { slug } = useParams<'slug'>();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading: isLoadingGroup, isError } = useGroup(slug || '-');

  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const hasWriteAcccess = Boolean(data?.permissions.write);
  const isMemberOfGroup = Boolean(data?.viewer_is_member);
  const isFinesActive = Boolean(data?.fines_activated);

  const showFinesAndLaws = isFinesActive && (isMemberOfGroup || hasWriteAcccess);
  const showForms = isAuthenticated;

  const tabs = useMemo(() => {
    if (!data) {
      return [];
    }
    const arr = [
      { label: 'Om', to: URLS.groups.details(data.slug), icon: Info },
      { label: 'Arrangementer', to: URLS.groups.events(data.slug), icon: CalendarRange },
    ];
    if (showFinesAndLaws) {
      arr.push({ label: 'Bøter', to: URLS.groups.fines(data.slug), icon: CircleDollarSign });
      arr.push({ label: 'Lovverk', to: URLS.groups.laws(data.slug), icon: Scale });
    }
    if (showForms) {
      arr.push({ label: 'Spørreskjemaer', to: URLS.groups.forms(data.slug), icon: CircleHelp });
    }
    return arr;
  }, [showFinesAndLaws, data]);

  if (isError) {
    return (
      <CardHeader>
        <div className='flex items-center space-x-4'>
          <GoBackButton url={URLS.groups.index} />
          <h1 className='text-xl font-bold'>Kunne ikke finne gruppen</h1>
        </div>
      </CardHeader>
    );
  }

  if (isLoadingGroup || !data) {
    return null;
  }

  return (
    <>
      <AddFineDialog groupSlug={data.slug} />

      <CardHeader>
        <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
          <div className='flex items-center space-x-4'>
            <GoBackButton url={URLS.groups.index} />
            <div className='flex items-center space-x-2'>
              <AspectRatioImg
                alt={data?.image_alt || ''}
                borderRadius
                className='h-[45px] w-[45px] md:h-[70px] md:w-[70px]'
                ratio={1}
                src={data?.image || ''}
              />
              <h1 className='text-3xl md:text-5xl font-bold'>{data.name}</h1>
            </div>
          </div>

          {hasWriteAcccess && <GroupAdmin group={data as FormGroupValues} />}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {!isDesktop && (
          <ScrollArea className='w-full whitespace-nowrap p-0'>
            <div className='flex w-max space-x-4'>
              {tabs.map((tab, index) => (
                <TabLink key={index} {...tab} Icon={tab.icon} />
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        )}

        {isDesktop && (
          <div className='flex items-center space-x-4'>
            {tabs.map((tab, index) => (
              <TabLink key={index} {...tab} Icon={tab.icon} />
            ))}
          </div>
        )}

        <Routes>
          <Route element={<GroupInfo />} path='' />
          <Route element={<GroupEvents />} path={`${URLS.groups.events_relative}`} />
          {showFinesAndLaws && (
            <>
              <Route
                element={
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  <FinesProvider>
                    <GroupFines />
                  </FinesProvider>
                }
                path={URLS.groups.fines_relative}
              />
              <Route element={<GroupLaws />} path={`${URLS.groups.laws_relative}`} />
            </>
          )}
          {showForms && <Route element={<GroupForms />} path={`${URLS.groups.forms_relative}`} />}
          <Route element={<Navigate replace to={URLS.groups.details(data.slug)} />} path='*' />
        </Routes>
      </CardContent>
    </>
  );
};

const TabLink = ({ to, label, Icon }: { to: string; label: string; Icon?: LucideIcon }) => (
  <Link
    className={`flex items-center space-x-2 p-2 ${location.pathname === to ? 'text-black dark:text-white border-b border-primary' : 'text-muted-foreground'}`}
    to={to}>
    {Icon && <Icon className='w-5 h-5 stroke-[1.5px]' />}
    <h1>{label}</h1>
  </Link>
);

export default GroupDetails;
