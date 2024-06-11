import { styled } from '@mui/material';
import { useMemo } from 'react';

import { useToddels } from 'hooks/Toddel';

import ToddelListItem, { ToddelListItemLoading } from 'pages/Toddel/components/ToddelListItem';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

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
    // TODO: Add 'add new' button when migration is done
    // <Page
    //   banner={
    //     <Banner text='Linjeforeningsbladet til TIHLDE' title='TÖDDEL'>
    //       <HavePermission apps={[PermissionApp.TODDEL]}>
    //         <CreateToddelDialog />
    //       </HavePermission>
    //     </Banner>
    //   }
    //   options={{ title: 'TÖDDEL' }}>
    <div className='w-full px-2 md:px-12 mt-40'>
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
    </div>
  );
};

export default ToddelPage;
