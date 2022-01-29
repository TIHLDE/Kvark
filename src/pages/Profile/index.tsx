import { useUser } from 'hooks/User';
import { Skeleton, Typography, Stack } from '@mui/material';

// Project Components
import Page from 'components/navigation/Page';
import ProfileContent from 'pages/Profile/components/ProfileContent';
import Paper from 'components/layout/Paper';
import Avatar from 'components/miscellaneous/Avatar';
import QRButton from 'components/miscellaneous/QRButton';

const Profile = () => {
  const { data: user } = useUser();

  return (
    <Page options={{ title: 'Profil', gutterTop: true, lightColor: 'blue' }}>
      <div>
        <Stack component={Paper} direction={{ xs: 'column', md: 'row' }} gap={1} sx={{ p: 2, mt: 1 }}>
          <Stack direction='row' gap={1} sx={{ flex: 1 }}>
            <Avatar sx={{ width: { xs: 70, md: 140 }, height: { xs: 70, md: 140 }, fontSize: { xs: '1.8rem', md: '3rem' } }} user={user} />
            {user && user.first_name ? (
              <Stack sx={{ m: 'auto', mx: 1, flex: 1 }}>
                <Typography sx={{ fontSize: { xs: '1.8rem', md: '3rem' } }} variant='h1'>{`${user.first_name} ${user.last_name}`}</Typography>
                <Typography variant='subtitle1'>
                  {user.user_id} | {user.email}
                </Typography>
              </Stack>
            ) : (
              <Stack sx={{ m: 'auto', mx: 1, flex: 1 }}>
                <Skeleton sx={{ fontSize: { xs: '1.8rem', md: '3rem' } }} variant='text' width={230} />
                <Skeleton variant='text' width={170} />
              </Stack>
            )}
          </Stack>
          {user && (
            <QRButton qrValue={user.user_id} subtitle={`${user.first_name} ${user.last_name}`} sx={{ mb: 'auto' }}>
              Medlemsbevis
            </QRButton>
          )}
        </Stack>
        <ProfileContent />
      </div>
    </Page>
  );
};

export default Profile;
