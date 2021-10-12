import { useStrikes } from 'hooks/Strike';

// Project Components
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { PersonListItemLoading } from 'pages/UserAdmin/components/PersonListItem';
import StrikeListItem from 'components/miscellaneous/StrikeListItem';
import { Fragment, useMemo } from 'react';
import { Stack } from '@mui/material';

const AllStrikesList = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useStrikes();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  return (
    <Fragment>
      {isLoading && <PersonListItemLoading />}
      {isEmpty && <NotFoundIndicator header='Fant ingen prikker' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack spacing={2}>
            {data.pages.map((page, i) => (
              <Fragment key={i}>
                {page.results.map((strike) => (
                  <StrikeListItem allStrikes isAdmin key={strike.id} strike={strike} user={strike.user} />
                ))}
              </Fragment>
            ))}
          </Stack>
        </Pagination>
      )}
    </Fragment>
  );
};

export default AllStrikesList;
