import { UserList } from 'types/Types';
import { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Paper from 'components/layout/Paper';
import PersonIcon from '@material-ui/icons/Person';
import { useMemberships } from 'api/hooks/Membership';
import StarIcon from '@material-ui/icons/Star';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Pagination from 'components/layout/Pagination';
import { useGroup } from 'api/hooks/Group';

export type MembersCardProps = {
  slug: string;
};

const useStyles = makeStyles((theme) => ({
  icons: {
    marginRight: theme.spacing(1),
  },
}));

const MembersCard = ({ slug }: MembersCardProps) => {
  const filters = { onlyMembers: true };
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useMemberships(slug, filters);
  const { data: group } = useGroup(slug);
  const leader = group?.leader;

  const classes = useStyles();

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
    icon: React.ComponentType<SvgIconProps>;
  };

  const Person = ({ user, icon: Icon }: PersonProps) => (
    <Grid item xs={12}>
      <Box alignItems='center' display='flex' flexWrap='wrap'>
        <Icon className={classes.icons} />
        <Typography variant='subtitle1'>{`${user.first_name} ${user.last_name}`}</Typography>
      </Box>
    </Grid>
  );

  return (
    <Paper>
      <Grid container spacing={2}>
        {Boolean(data?.pages?.length) && (
          <Grid item xs={12}>
            <Typography variant='h3'>Leder:</Typography>
          </Grid>
        )}
        {leader && <Person icon={StarIcon} user={leader} />}
        {Boolean(data?.pages?.length) && (
          <Grid item xs={12}>
            <Typography variant='h3'>Medlemmer:</Typography>
          </Grid>
        )}
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          {data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page.results.map((member) => (
                <Person icon={PersonIcon} key={member.user.user_id} user={member.user} />
              ))}
            </Fragment>
          ))}
        </Pagination>
      </Grid>
    </Paper>
  );
};

export default MembersCard;
