import { useUser } from 'hooks/User';

// Material-UI
import { makeStyles } from '@mui/styles';
import { Skeleton, Typography } from '@mui/material';

// Project Components
import Page from 'components/navigation/Page';
import ProfileContent from 'pages/Profile/components/ProfileContent';
import Paper from 'components/layout/Paper';
import Avatar from 'components/miscellaneous/Avatar';
import QRButton from 'components/miscellaneous/QRButton';
import { ProfileTopBox } from 'components/layout/TopBox';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    left: 0,
    right: 0,
    top: theme.spacing(-7),
    padding: theme.spacing(4),
    paddingTop: theme.spacing(14),
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(1, 'auto', 0),
    minWidth: 150,
  },
  avatar: {
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
    top: -100,
    width: 200,
    height: 200,
    fontSize: 65,
  },
  text: {
    margin: `${theme.spacing(0.25)} auto`,
    color: theme.palette.text.primary,
  },
}));

const Profile = () => {
  const classes = useStyles();
  const { data: user } = useUser();

  return (
    <Page banner={<ProfileTopBox />} options={{ title: 'Profil' }}>
      <div>
        <Paper className={classes.paper} noPadding>
          <Avatar className={classes.avatar} user={user} />
          {user && user.first_name ? (
            <>
              <Typography className={classes.text} variant='h1'>
                {`${user.first_name} ${user.last_name}`}
              </Typography>
              <Typography className={classes.text} variant='subtitle1'>
                {user.email}
              </Typography>
              <Typography className={classes.text} variant='subtitle1'>
                {user.user_id}
              </Typography>
            </>
          ) : (
            <>
              <Skeleton height={50} sx={{ m: 'auto' }} variant='text' width='75%' />
              <Skeleton height={30} sx={{ m: 'auto' }} variant='text' width='45%' />
              <Skeleton height={30} sx={{ m: 'auto' }} variant='text' width='35%' />
            </>
          )}
          {user && (
            <QRButton qrValue={user.user_id} variant='outlined'>
              Medlemssbevis
            </QRButton>
          )}
        </Paper>
        <ProfileContent />
      </div>
    </Page>
  );
};

export default Profile;
