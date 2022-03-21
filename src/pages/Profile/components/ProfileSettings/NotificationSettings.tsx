import { Box, Button, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import URLS from 'URLS';

import { User, UserNotificationSetting, UserNotificationSettingChoice } from 'types';

import { useSnackbar } from 'hooks/Snackbar';
import { useSlackConnect, useUpdateUserNotificationSettings, useUser, useUserNotificationSettingChoices, useUserNotificationSettings } from 'hooks/User';

import { Switch } from 'components/inputs/Bool';
import Paper, { PaperProps } from 'components/layout/Paper';
import Page from 'components/navigation/Page';

export const SlackConnectPage = () => {
  const [searchParams] = useSearchParams();
  const slackConnect = useSlackConnect();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      return;
    }
    slackConnect.mutate(code, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        navigate(URLS.profile);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
        setLoading(false);
      },
    });
  }, [searchParams]);

  return (
    <Page options={{ title: 'Slack-tilkobling', gutterTop: true }}>
      <Paper>
        <Typography variant='h1'>Slack-tilkobling</Typography>
        <Typography gutterBottom variant='body1'>
          {searchParams.get('code')
            ? loading
              ? 'Kobler din Slack-konto til din TIHLDE-konto...'
              : 'Noe gikk galt, vi kunne ikke koble sammen din Slack- og TIHLDE-konto.'
            : 'Ugyldig lenke'}
        </Typography>
        {(!loading || !searchParams.get('code')) && (
          <Button component={Link} to={URLS.landing} variant='outlined'>
            Gå til forsiden
          </Button>
        )}
      </Paper>
    </Page>
  );
};

export const ConnectWithSlack = (props: PaperProps) => {
  const { data } = useUser();
  if (!data || data.slack_user_id) {
    return null;
  }
  return (
    <Paper {...props}>
      <Typography variant='h3'>Koble til Slack</Typography>
      <Typography gutterBottom>
        Hvis du har en Slack-konto i TIHLDE sin Slack kan du koble den til din konto på TIHLDE.org. Da kan du motta varsler fra oss i Slack. Du kan selv
        bestemme hvilke varsler du vil motta hvor i varslingsinnstillingene.
      </Typography>
      <Button
        component='a'
        fullWidth
        href={`https://slack.com/openid/connect/authorize?scope=openid&response_type=code&redirect_uri=${window.location.origin}/slack&client_id=${
          import.meta.env.VITE_SLACK_CLIENT_ID
        }`}
        startIcon={
          <SvgIcon viewBox='0 0 122.8 122.8'>
            <path
              d='M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z'
              fill='#e01e5a'></path>
            <path
              d='M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z'
              fill='#36c5f0'></path>
            <path
              d='M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z'
              fill='#2eb67d'></path>
            <path
              d='M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z'
              fill='#ecb22e'></path>
          </SvgIcon>
        }
        target='_blank'
        variant='outlined'>
        Koble sammen med din Slack-bruker
      </Button>
    </Paper>
  );
};

type NotificationSettingProps = UserNotificationSettingsProps & {
  choice: UserNotificationSettingChoice;
  notificationSettings: Array<UserNotificationSetting>;
};

const NotificationSetting = ({ choice, notificationSettings, user }: NotificationSettingProps) => {
  const showSnackbar = useSnackbar();
  const setUserNotificationSetting = useUpdateUserNotificationSettings();
  const [setting, setSetting] = useState<UserNotificationSetting>(
    notificationSettings.find((setting) => setting.notification_type === choice.notification_type) || {
      email: true,
      slack: true,
      website: true,
      notification_type: choice.notification_type,
    },
  );

  const toggleSetting = (key: keyof Omit<UserNotificationSetting, 'notification_type'>, checked: boolean) => {
    const oldSetting = setting;
    const newSetting = { ...setting, [key]: checked };
    if (!newSetting.email && !newSetting.slack && !newSetting.website) {
      showSnackbar('Du må velge minst ett alternativ', 'warning');
      return;
    }
    setSetting(newSetting);
    setUserNotificationSetting.mutate(newSetting, {
      onSuccess: () => showSnackbar('Innstillingen ble oppdatert', 'success'),
      onError: (e) => {
        showSnackbar(e.detail, 'error');
        setSetting(oldSetting);
      },
    });
  };

  return (
    <>
      <Typography sx={{ alignSelf: 'center' }}>{choice.label}</Typography>
      <Switch checked={setting.email} onChange={(e) => toggleSetting('email', e.target.checked)} sx={{ m: 'auto' }} />
      <Switch checked={setting.website} onChange={(e) => toggleSetting('website', e.target.checked)} sx={{ m: 'auto' }} />
      <Switch checked={setting.slack} disabled={!user.slack_user_id} onChange={(e) => toggleSetting('slack', e.target.checked)} sx={{ m: 'auto' }} />
    </>
  );
};

export type UserNotificationSettingsProps = {
  user: User;
};

export const UserNotificationSettings = ({ user }: UserNotificationSettingsProps) => {
  const { data } = useUserNotificationSettings();
  const { data: choices = [] } = useUserNotificationSettingChoices();

  return (
    <>
      <ConnectWithSlack sx={{ mb: 2 }} />
      <Box sx={{ overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr repeat(3, auto)', gap: 1 }}>
        <Typography sx={{ fontWeight: 'bold' }}>Type</Typography>
        <Typography align='center' sx={{ fontWeight: 'bold', minWidth: 75 }}>
          Epost
        </Typography>
        <Typography align='center' sx={{ fontWeight: 'bold', minWidth: 75 }}>
          Nettsiden
        </Typography>
        <Typography align='center' sx={{ fontWeight: 'bold', minWidth: 75 }}>
          Slack
        </Typography>
        {data && choices.map((choice) => <NotificationSetting choice={choice} key={choice.notification_type} notificationSettings={data} user={user} />)}
      </Box>
    </>
  );
};

export default UserNotificationSettings;
