import { Box, Typography } from '@mui/material';
import { useState } from 'react';

import { User, UserNotificationSetting, UserNotificationSettingChoice } from 'types';

import { useSnackbar } from 'hooks/Snackbar';
import { useUpdateUserNotificationSettings, useUserNotificationSettingChoices, useUserNotificationSettings } from 'hooks/User';

import { Switch } from 'components/inputs/Bool';

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
    const newSetting = { ...setting, [key]: checked };
    if (!newSetting.email && !newSetting.slack && !newSetting.website) {
      showSnackbar('Du må velge minst ett alternativ', 'warning');
      return;
    }
    setSetting(newSetting);
    setUserNotificationSetting.mutate(newSetting, {
      onSuccess: () => showSnackbar('Innstillingen ble oppdatert', 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
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
