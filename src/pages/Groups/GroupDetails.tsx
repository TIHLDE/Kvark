import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import LawIcon from '@mui/icons-material/GavelRounded';
import FormsIcon from '@mui/icons-material/HelpOutlineRounded';
import InfoIcon from '@mui/icons-material/InfoRounded';
import FineIcon from '@mui/icons-material/LocalAtmRounded';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { useGroup } from 'hooks/Group';
import { useIsAuthenticated } from 'hooks/User';

import GroupInfo from 'pages/Groups/about';
import GroupAdmin from 'pages/Groups/components/GroupAdmin';
import GroupFines from 'pages/Groups/fines';
import { FinesProvider } from 'pages/Groups/fines/FinesContext';
import GroupForms from 'pages/Groups/forms';
import GroupLaws from 'pages/Groups/laws';

import { RouterTabs } from 'components/layout/Tabs';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { useSetNavigationOptions } from 'components/navigation/Navigation';

const GroupDetails = () => {
  const { slug } = useParams<'slug'>();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading: isLoadingGroup, isError } = useGroup(slug || '-');
  useSetNavigationOptions({ title: `Gruppe - ${data?.name || 'Laster...'}` });

  const hasWriteAcccess = Boolean(data?.permissions.write);
  const isMemberOfGroup = Boolean(data?.viewer_is_member);
  const isFinesActive = Boolean(data?.fines_activated);

  const showFinesAndLaws = isFinesActive && (isMemberOfGroup || hasWriteAcccess);
  const showForms = isAuthenticated;

  const tabs = useMemo(() => {
    if (!data) {
      return [];
    }
    const arr = [{ label: 'Om', to: URLS.groups.details(data.slug), icon: InfoIcon }];
    if (showFinesAndLaws) {
      arr.push({ label: 'Bøter', to: URLS.groups.fines(data.slug), icon: FineIcon });
      arr.push({ label: 'Lovverk', to: URLS.groups.laws(data.slug), icon: LawIcon });
    }
    if (showForms) {
      arr.push({ label: 'Spørreskjemaer', to: URLS.groups.forms(data.slug), icon: FormsIcon });
    }
    return arr;
  }, [showFinesAndLaws, data]);

  if (isError) {
    return (
      <Stack direction='row' gap={1} sx={{ mb: 1, alignItems: 'center' }}>
        <IconButton component={Link} to={URLS.groups.index}>
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
          <IconButton component={Link} to={URLS.groups.index}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'block', height: { xs: 45, md: 70 }, width: { xs: 45, md: 70 } }}>
            <AspectRatioImg alt={data?.image_alt || ''} borderRadius ratio={1} src={data?.image || ''} />
          </Box>
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
              path={URLS.groups.fines_relative}
            />
            <Route element={<GroupLaws />} path={`${URLS.groups.laws_relative}`} />
          </>
        )}
        {showForms && <Route element={<GroupForms />} path={`${URLS.groups.forms_relative}`} />}
        <Route element={<Navigate replace to={URLS.groups.details(data.slug)} />} path='*' />
      </Routes>
    </>
  );
};

export default GroupDetails;
