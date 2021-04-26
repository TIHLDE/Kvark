import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Paper from 'components/layout/Paper';
import PersonIcon from '@material-ui/icons/Person';
import { useMemberships } from 'api/hooks/Membership';
import StarIcon from '@material-ui/icons/Star';

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
  const members = data?.filter((element) => element.membership_type === 'MEMBER');
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

  return (
    <Paper>
      <Grid container spacing={2}>
        {leader && (
          <Grid item xs={12}>
            <Typography variant='subtitle1'>
              <b>Leder:</b>
            </Typography>
            <Box alignItems='center' display='flex' flexWrap='wrap'>
              <StarIcon className={classes.icons} />
              <Typography variant='subtitle1'>{`${leader?.user.first_name} ${leader?.user.last_name}`}</Typography>
            </Box>
          </Grid>
        )}
        {Boolean(membersSorted?.length) && (
          <Grid item xs={12}>
            <Typography variant='subtitle1'>
              <b>Medlemmer:</b>
            </Typography>
          </Grid>
        )}
        {membersSorted?.map((member) => {
          return (
            <Grid item key={member.user.user_id} md={6} xs={12}>
              <Box alignItems='center' display='flex' flexWrap='wrap'>
                <PersonIcon className={classes.icons} />
                <Typography variant='subtitle1'>{`${member.user.first_name} ${member.user.last_name}`}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default MembersCard;
