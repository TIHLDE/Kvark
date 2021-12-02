import { useParams, Routes, Route, Link } from 'react-router-dom';
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
  const { slug: slugParameter } = useParams<'slug'>();
  const slug = (slugParameter || '-').toLowerCase();
  const { data, isLoading: isLoadingGroup, isError } = useGroup(slug);
  useSetNavigationOptions({ title: `Gruppe - ${data?.name || 'Laster...'}` });

  const hasWriteAcccess = Boolean(data?.permissions.write);

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
      <RouterTabs
        tabs={[
          { label: 'Om', to: `${URLS.groups}${data.slug}/`, icon: InfoIcon },
          { label: 'Bøter', to: `${URLS.groups}${data.slug}/boter/`, icon: FineIcon },
          { label: 'Lovverk', to: `${URLS.groups}${data.slug}/lovverk/`, icon: LawIcon },
        ]}
      />
      <Divider sx={{ mb: 2 }} />
      <Routes>
        <Route element={<GroupInfo group={data} />} path='' />
        <Route element={<p>Bøter</p>} path='boter/' />
        <Route element={<p>Lovverk</p>} path='lovverk/' />
      </Routes>
    </>
  );
};

export default GroupDetails;
