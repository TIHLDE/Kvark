import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useUserPaidHistory } from 'hooks/User';

import PaidItem, { PaidItemLoading } from 'pages/paidHistory/PaidItems';

import Pagination from 'components/layout/Pagination';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const ProfilePaidHistory = () => {
  const { userId } = useParams();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useUserPaidHistory(userId);
  const PaidItems = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere badges' nextPage={() => fetchNextPage()}>
      {!isLoading && !PaidItems.length && (
        <NotFoundIndicator header='Fant ingen betalingshistorikk' subtitle={`${userId ? 'Brukeren' : 'Du'} har ingen betalinger enda`} />
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1, mb: 1 }}>
        {isLoading && (
          <>
            <PaidItemLoading />
            <PaidItemLoading />
          </>
        )}
        {PaidItems.map((paidHistory) => (
          <PaidItem key={paidHistory.id} paidHistory={paidHistory} />
        ))}
      </Box>
    </Pagination>
  );
};

export default ProfilePaidHistory;
