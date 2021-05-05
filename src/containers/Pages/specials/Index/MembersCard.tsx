import { UserList } from 'types/Types';
import { Fragment } from 'react';
import { ListItem, ListItemText, ListItemAvatar, List, Grid, Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from 'components/layout/Paper';
import { useMemberships } from 'api/hooks/Membership';
import Pagination from 'components/layout/Pagination';
import { useGroup } from 'api/hooks/Group';
import Avatar from 'components/miscellaneous/Avatar';

export type MembersCardProps = {
  slug: string;
};

const MembersCard = ({ slug }: MembersCardProps) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMemberships(slug, { onlyMembers: true });
  const { data: group } = useGroup(slug);
  const leader = group?.leader;

  if (isLoading) {
    return (
      <Paper>
        <Skeleton height='100px' variant='rect' />
      </Paper>
    );
  }

  if (!data?.pages?.length && !leader) {
    return null;
  }

  type PersonProps = {
    user: UserList;
  };

  const Person = ({ user }: PersonProps) => (
    <ListItem>
      <ListItemAvatar>
        <Avatar user={user} />
      </ListItemAvatar>
      <ListItemText primary={`${user.first_name} ${user.last_name}`} />
    </ListItem>
  );

  return (
    <Paper>
      <Grid container spacing={2}>
        {Boolean(data?.pages?.length) && (
          <Grid item xs={12}>
            <Typography variant='h3'>Leder:</Typography>
          </Grid>
        )}
        {leader && <Person user={leader} />}
        {Boolean(data?.pages?.length) && (
          <Grid item xs={12}>
            <Typography variant='h3'>Medlemmer:</Typography>
          </Grid>
        )}
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemmer' nextPage={() => fetchNextPage()}>
          <List>
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.results.map((member) => (
                  <Person key={member.user.user_id} user={member.user} />
                ))}
              </Fragment>
            ))}
          </List>
        </Pagination>
      </Grid>
    </Paper>
  );
};

export default MembersCard;
