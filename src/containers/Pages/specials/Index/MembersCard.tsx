import { useMemo } from 'react';
import { UserList } from 'types/Types';

import { ListItem, ListItemText, ListItemAvatar, List, Grid, Typography, Skeleton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Paper from 'components/layout/Paper';
import { useMemberships } from 'api/hooks/Membership';
import Pagination from 'components/layout/Pagination';
import { useGroup } from 'api/hooks/Group';
import Avatar from 'components/miscellaneous/Avatar';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
  },
}));

export type MembersCardProps = {
  slug: string;
};

const MembersCard = ({ slug }: MembersCardProps) => {
  const classes = useStyles();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMemberships(slug, { onlyMembers: true });
  const members = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  const { data: group } = useGroup(slug);
  const leader = group?.leader;

  if (isLoading) {
    return (
      <Paper>
        <Skeleton height='100px' variant='rectangular' />
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
    <Paper className={classes.paper}>
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
            {members.map((member) => (
              <Person key={member.user.user_id} user={member.user} />
            ))}
          </List>
        </Pagination>
      </Grid>
    </Paper>
  );
};

export default MembersCard;
