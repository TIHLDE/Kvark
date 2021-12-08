import { useMemo } from 'react';
import { useParams, Link, Routes, Route, Navigate } from 'react-router-dom';
import URLS from 'URLS';

import { useGroup } from 'hooks/Group';
import { useSetNavigationOptions } from 'components/navigation/Navigation';
import { Typography, Stack, IconButton, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import InfoIcon from '@mui/icons-material/InfoRounded';
import FineIcon from '@mui/icons-material/LocalAtmRounded';
import LawIcon from '@mui/icons-material/GavelRounded';

// Project Components
import GroupAdmin from 'pages/Groups/components/GroupAdmin';
import GroupInfo from 'pages/Groups/about';
import GroupLaws from 'pages/Groups/laws';
import GroupFines from 'pages/Groups/fines';
import { FinesProvider } from 'pages/Groups/fines/FinesContext';
import { RouterTabs } from 'components/layout/Tabs';

const GroupDetails = () => {
  const { slug } = useParams<'slug'>();
  const { data, isLoading: isLoadingGroup, isError } = useGroup(slug || '-');
  useSetNavigationOptions({ title: `Gruppe - ${data?.name || 'Laster...'}` });

  const hasWriteAcccess = Boolean(data?.permissions.write);
  const isMemberOfGroup = true;
  const isFinesActive = Boolean(data?.fines_activated);

  const showFinesAndLaws = isFinesActive && isMemberOfGroup;

  const tabs = useMemo(() => {
    if (!data) {
      return [];
    }
    const arr = [{ label: 'Om', to: `${URLS.groups}${data.slug}/`, icon: InfoIcon }];
    if (showFinesAndLaws) {
      arr.push({ label: 'Bøter', to: `${URLS.groups}${data.slug}/${URLS.groups_fines}`, icon: FineIcon });
      arr.push({ label: 'Lovverk', to: `${URLS.groups}${data.slug}/${URLS.groups_laws}`, icon: LawIcon });
    }
    return arr;
  }, [showFinesAndLaws, data]);

  if (isError) {
    return (
      <Stack direction='row' gap={1} sx={{ mb: 1, alignItems: 'center' }}>
        <IconButton component={Link} to={URLS.groups}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h1'>Kunne ikke finne gruppen</Typography>
      </Stack>
    );
  }

  if (isLoadingGroup || !data) {
    return null;
  }
  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={1} sx={{ mb: 1 }}>
        <Stack direction='row' gap={1} sx={{ alignItems: 'center', flex: 1 }}>
          <IconButton component={Link} to={URLS.groups}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h1'>{data.name}</Typography>
        </Stack>
        {hasWriteAcccess && <GroupAdmin group={data} />}
      </Stack>
      {tabs.length > 1 && (
        <>
          <RouterTabs tabs={tabs} />
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      <Routes>
        <Route element={<GroupInfo />} path='' />
        {showFinesAndLaws && (
          <>
            <Route
              element={
                <FinesProvider>
                  <GroupFines />
                </FinesProvider>
              }
              path={URLS.groups_fines}
            />
            <Route element={<GroupLaws />} path={URLS.groups_laws} />
          </>
        )}
        <Route element={<Navigate replace to={`${URLS.groups}${data.slug}/`} />} path='*' />
      </Routes>
    </>
  );
};

export default GroupDetails;
