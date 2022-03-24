import { styled } from '@mui/material';
import { useMemo } from 'react';

import { PermissionApp } from 'types/Enums';

import { useToddels } from 'hooks/Toddel';
import { HavePermission } from 'hooks/User';

import CreateToddelDialog from 'pages/Toddel/components/CreateToddelDialog';
import ToddelListItem, { ToddelListItemLoading } from 'pages/Toddel/components/ToddelListItem';

import Banner from 'components/layout/Banner';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

const ToddelGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridGap: theme.spacing(1),
  alignItems: 'start',
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const ToddelPage = () => {
  const { data, error, isLoading, isFetching, hasNextPage, fetchNextPage } = useToddels();
  const toddels = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Page
      banner={
        <Banner text='Linjeforeningsbladet til TIHLDE' title='Töddel'>
          <HavePermission apps={[PermissionApp.TODDEL]}>
            <CreateToddelDialog />
          </HavePermission>
        </Banner>
      }
      options={{ title: 'Töddel' }}>
      <ToddelGrid>
        {isLoading && <ToddelListItemLoading />}
        {!isLoading && !toddels.length && <NotFoundIndicator header='Fant ingen publikasjoner' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {toddels.map((toddel) => (
              <ToddelListItem key={toddel.edition} toddel={toddel} />
            ))}
          </Pagination>
        )}
        {isFetching && <ToddelListItemLoading />}
      </ToddelGrid>
    </Page>
  );
};

export default ToddelPage;
