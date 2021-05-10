import { useState } from 'react';
import { useUser } from 'api/hooks/User';
import Helmet from 'react-helmet';

// Material-UI
import { makeStyles, useMediaQuery, Typography, Button, Theme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

// Project Components
import Navigation from 'components/navigation/Navigation';
import ProfileContent from 'containers/Profile/components/ProfileContent';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import Avatar from 'components/miscellaneous/Avatar';
import QRCode from 'components/miscellaneous/QRCode';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 260,
    background: 'radial-gradient(circle at bottom, ' + theme.palette.colors.gradient.profile.top + ', ' + theme.palette.colors.gradient.profile.bottom + ')',
  },
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
  skeleton: {
    animation: 'animate 1.5s ease-in-out infinite',
    margin: 'auto',
    minHeight: 35,
  },
  text: {
    margin: `${theme.spacing(0.25)}px auto`,
    color: theme.palette.text.primary,
  },
}));

const Profile = () => {
  const classes = useStyles();
  const { data: user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const xsDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Navigation banner={<div className={classes.top} />} fancyNavbar>
      <Helmet>
        <title>Profil - TIHLDE</title>
      </Helmet>
      <div>
        <Paper className={classes.paper} noPadding>
          {showModal && user && (
            <Dialog onClose={() => setShowModal(false)} open={showModal} titleText='Medlemsbevis'>
              <QRCode height={xsDown ? 280 : 350} value={user.user_id} width={xsDown ? 280 : 350} />
            </Dialog>
          )}
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
              <Skeleton className={classes.skeleton} variant='text' width='75%' />
              <Skeleton className={classes.skeleton} variant='text' width='45%' />
              <Skeleton className={classes.skeleton} variant='text' width='35%' />
            </>
          )}
          <Button className={classes.button} color='primary' onClick={() => setShowModal(true)} variant='contained'>
            Medlemsbevis
          </Button>
        </Paper>
        <ProfileContent />
      </div>
    </Navigation>
  );
};

export default Profile;
