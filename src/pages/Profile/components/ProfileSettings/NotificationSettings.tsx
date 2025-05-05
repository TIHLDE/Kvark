import DISCORD from '~/assets/icons/discord.svg';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';
import { useUpdateUserNotificationSettings, useUser, useUserNotificationSettingChoices, useUserNotificationSettings } from '~/hooks/User';
import type { User, UserNotificationSetting, UserNotificationSettingChoice } from '~/types';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

type ConnectWithSlackProps = {
  className?: string;
};

export const ConnectWithDiscord = ({ className }: ConnectWithSlackProps) => {
  const { data } = useUser();
  if (!data || data.slack_user_id) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Koble til Discord</CardTitle>
        <CardDescription>Hvis du har en Discord-konto kan du bli med i TIHLDE sin Discord. Da kan du motta varsler fra oss i Discord.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full' size='lg'>
          <Link className='flex items-center' to='https://discord.gg/HNt5XQdyxy'>
            <img alt='Discord' className='w-6 h-6 mr-2' src={DISCORD} />
            Koble til din Discord-bruker
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

type NotificationSettingProps = UserNotificationSettingsProps & {
  choice: UserNotificationSettingChoice;
  notificationSettings: Array<UserNotificationSetting>;
};

const NotificationSetting = ({ choice, notificationSettings }: NotificationSettingProps) => {
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
      toast.error('Du må velge minst ett alternativ');
      return;
    }
    setSetting(newSetting);
    setUserNotificationSetting.mutate(newSetting, {
      onSuccess: () => {
        toast.success('Innstillingene ble oppdatert');
      },
      onError: (e) => {
        toast.error(e.detail);
        setSetting(oldSetting);
      },
    });
  };

  return (
    <tr>
      <td className='text-sm md:text-md p-2'>{choice.label}</td>
      <td className='text-center p-2'>
        <Switch checked={setting.email} onCheckedChange={(checked) => toggleSetting('email', checked)} />
      </td>
      <td className='text-center p-2'>
        <Switch checked={setting.website} onCheckedChange={(checked) => toggleSetting('website', checked)} />
      </td>
    </tr>
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
      <ConnectWithDiscord className='mb-4' />
      <p className='text-sm mb-4'>For å være sikker på at du mottar nødvendig informasjon må du velge minst én informasjonskanal for hver type varsel</p>
      <table className='w-full'>
        <thead>
          <th className='text-sm md:text-md w-3/5 text-start p-1'>Type</th>
          <th className='text-sm md:text-md flex-auto p-1'>Epost</th>
          <th className='text-sm md:text-md flex-auto p-1'>Nettsiden</th>
        </thead>
        <tbody>
          {data && choices.map((choice) => <NotificationSetting choice={choice} key={choice.notification_type} notificationSettings={data} user={user} />)}
        </tbody>
      </table>
    </>
  );
};

export default UserNotificationSettings;
