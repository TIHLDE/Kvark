import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from 'components/layout/Paper';
import PersonIcon from '@material-ui/icons/Person';
export type MembersCardProps = {
  members: string[];
};

const useStyles = makeStyles((theme) => ({
  icons: {
    marginRight: theme.spacing(1),
  },
}));

const MembersCard = ({ members }: MembersCardProps) => {
  const classes = useStyles();
  return (
    <Paper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box alignItems='center' display='flex' flexWrap='wrap'>
            <Typography variant='h2'>Medlemmer</Typography>
          </Box>
        </Grid>
        {members.map((member) => {
          return (
            <Grid item key={member} md={6} xs={12}>
              <Box alignItems='center' display='flex' flexWrap='wrap'>
                <PersonIcon className={classes.icons} />
                <Typography variant='subtitle1'>{member}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default MembersCard;
