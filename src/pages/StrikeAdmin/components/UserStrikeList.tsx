import { Fragment, useMemo } from 'react';
import { useUsers } from 'hooks/User';

// Project Components
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import UserListItem from 'pages/StrikeAdmin/components/UserListItem';
import { PersonListItemLoading } from 'pages/UserAdmin/components/PersonListItem';

export type UserStrikeListProps = {
    filters : Record<string, any>
};

const UserStrikeList = ({filters}: UserStrikeListProps) => {
    const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers(filters);
    const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
    
    return (
      <Fragment>
        {isLoading && <PersonListItemLoading />}
        {isEmpty && <NotFoundIndicator header='Fant ingen brukere' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {data.pages.map((page, i) => (
              <Fragment key={i}>
                {page.results.map((user) => (
                  <UserListItem key={user.user_id} user={user} />
                ))}
              </Fragment>
            ))}
          </Pagination>
        )}
        </Fragment>
    )
}

export default UserStrikeList;
