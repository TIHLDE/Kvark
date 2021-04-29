import { User } from 'types/Types';

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

export type MembersCardProps = {
  slug: string;
};

const useStyles = makeStyles((theme) => ({
  icons: {
    marginRight: theme.spacing(1),
  },
}));

const MembersCard = ({ slug }: MembersCardProps) => {
  const { data, isLoading } = useMemberships(slug.toLowerCase());
  const leader = data?.find((member) => member.membership_type === 'LEADER');
  const members = data?.filter((element) => element.membership_type === 'MEMBER') || [];
  const membersSorted = members?.sort((a, b) => `${a.user.first_name} ${a.user.last_name}`.localeCompare(`${b.user.first_name} ${b.user.last_name}`));

  const classes = useStyles();

  if (isLoading) {
    return (
      <Paper>
        <Skeleton height='100px' variant='rect' />
      </Paper>
    );
  }

  if (!membersSorted?.length && !leader) {
    return null;
  }

  type PersonProps = {
    user: User;
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
        {Boolean(membersSorted?.length) && (
          <Grid item xs={12}>
            <Typography variant='h3'>Leder:</Typography>
          </Grid>
        )}
        {leader && <Person icon={StarIcon} user={leader.user} />}
        {Boolean(membersSorted?.length) && (
          <Grid item xs={12}>
            <Typography variant='h3'>Medlemmer:</Typography>
          </Grid>
        )}
        {membersSorted?.map((member) => (
          <Person icon={PersonIcon} key={member.user.user_id} user={member.user} />
        ))}
      </Grid>
    </Paper>
  );
};

export default MembersCard;
