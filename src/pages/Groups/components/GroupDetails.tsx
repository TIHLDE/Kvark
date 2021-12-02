import { useMemo } from 'react';
import { useParams, Link, Routes, Route, Navigate } from 'react-router-dom';
import URLS from 'URLS';

import { useGroup } from 'hooks/Group';
import { useSetNavigationOptions } from 'components/navigation/Navigation';
import { Typography, Stack, IconButton, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import InfoIcon from '@mui/icons-material/InfoRounded';
import FineIcon from '@mui/icons-material/PaymentsRounded';
import LawIcon from '@mui/icons-material/GavelRounded';

// Project Components
import UpdateGroupModal from 'pages/Groups/components/UpdateGroupModal';
import GroupInfo from 'pages/Groups/components/GroupInfo';
import { RouterTabs } from 'components/layout/Tabs';

const GroupDetails = () => {
  const { slug } = useParams<'slug'>();
  const { data, isLoading: isLoadingGroup, isError } = useGroup((slug || '-').toLowerCase());
  useSetNavigationOptions({ title: `Gruppe - ${data?.name || 'Laster...'}` });

  const hasWriteAcccess = Boolean(data?.permissions.write);
  const isMemberOfGroup = false;
  const isFinesActive = false;

  const tabs = useMemo(() => {
    if (!data) {
      return [];
    }
    const arr = [{ label: 'Om', to: `${URLS.groups}${data.slug}/`, icon: InfoIcon }];
    if (isMemberOfGroup && isFinesActive) {
      arr.push({ label: 'Bøter', to: `${URLS.groups}${data.slug}/${URLS.groups_fines}`, icon: FineIcon });
      arr.push({ label: 'Lovverk', to: `${URLS.groups}${data.slug}/${URLS.groups_laws}`, icon: LawIcon });
    }
    return arr;
  }, [isMemberOfGroup, isFinesActive, data]);

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
      <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
        <Stack direction='row' gap={1} sx={{ mb: 1, alignItems: 'center', flex: 1 }}>
          <IconButton component={Link} to={URLS.groups}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h1'>{data.name}</Typography>
        </Stack>
        {hasWriteAcccess && <UpdateGroupModal group={data} />}
      </Stack>
      {tabs.length > 1 && (
        <>
          <RouterTabs tabs={tabs} />
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      <Routes>
        <Route element={<GroupInfo />} path='' />
        {isMemberOfGroup && (
          <>
            <Route element={<p>Bøter</p>} path={URLS.groups_fines} />
            <Route element={<p>Lovverk</p>} path={URLS.groups_laws} />
          </>
        )}
        <Route element={<Navigate replace to={`${URLS.groups}${data.slug}/`} />} path='*' />
      </Routes>
    </>
  );
};

export default GroupDetails;
