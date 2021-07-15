import { useState } from 'react';
import { useUser } from 'api/hooks/User';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import { Skeleton, Typography, Button } from '@material-ui/core';

// Icons
import QrCodeIcon from '@material-ui/icons/QrCodeRounded';

// Project Components
import Page from 'components/navigation/Page';
import ProfileContent from 'containers/Profile/components/ProfileContent';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import Avatar from 'components/miscellaneous/Avatar';
import QRCode from 'components/miscellaneous/QRCode';
import { ProfileTopBox } from 'components/layout/TopBox';
import { useGoogleAnalytics } from 'api/hooks/Utils';

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
  const { event } = useGoogleAnalytics();
  const { data: user } = useUser();
  const [showModal, setShowModal] = useState(false);

  const openMemberProof = () => {
    setShowModal(true);
    event('open-memberproof', 'profile', 'Open');
  };

  return (
    <Page banner={<ProfileTopBox />} options={{ title: 'Profil' }}>
      <div>
        <Paper className={classes.paper} noPadding>
          {showModal && user && (
            <Dialog onClose={() => setShowModal(false)} open={showModal} titleText='Medlemsbevis'>
              <QRCode background='paper' value={user.user_id} />
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
              <Skeleton height={50} sx={{ m: 'auto' }} variant='text' width='75%' />
              <Skeleton height={30} sx={{ m: 'auto' }} variant='text' width='45%' />
              <Skeleton height={30} sx={{ m: 'auto' }} variant='text' width='35%' />
            </>
          )}
          <Button className={classes.button} endIcon={<QrCodeIcon />} onClick={openMemberProof} variant='contained'>
            Medlemsbevis
          </Button>
        </Paper>
        <ProfileContent />
      </div>
    </Page>
  );
};

export default Profile;
