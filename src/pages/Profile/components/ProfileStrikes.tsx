import { Box } from '@mui/system';
// Material UI Components
import { useUserStrikes, useUser } from 'hooks/User';

import StrikeListItem from 'components/miscellaneous/StrikeListItem';
import { makeStyles } from '@mui/styles';
import { Typography, Paper, ListItem } from '@mui/material';

const useStyles = makeStyles({
  paper: {
    marginBottom: 5,
    padding: 10,
  },
  strikeContainer: {
    marginBottom: 5,
  },
});
function ProfileStrikes() {
  const classes = useStyles();
  const { data = [] } = useUserStrikes();
  const { data: user } = useUser();
  return (
    <Box>
      <Paper className={classes.paper}>
        <ListItem>
          <Typography>
            Feil med prikkene? Send mail til <a href='mailto:bedpres@tihlde.org'>bedpres@tihlde.org</a>
          </Typography>
        </ListItem>
      </Paper>
      {user &&
        data.map((strike, i) => (
          <Box className={classes.strikeContainer} key={i}>
            <StrikeListItem key={strike.id} strike={strike} userId={user.user_id} />
          </Box>
        ))}
      <Box></Box>
    </Box>
  );
}

export default ProfileStrikes;
