import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { User, UserNotificationSetting, UserNotificationSettingChoice } from 'types';

import { useUpdateUserNotificationSettings, useUser, useUserNotificationSettingChoices, useUserNotificationSettings } from 'hooks/User';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Switch } from 'components/ui/switch';

// TODO: Find out if this is needed
// export const SlackConnectPage = () => {
//   const [searchParams] = useSearchParams();
//   const slackConnect = useSlackConnect();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const code = searchParams.get('code');
//     if (!code) {
//       return;
//     }
//     slackConnect.mutate(code, {
//       onSuccess: (data) => {
//         navigate(URLS.profile);
//       },
//       onError: (e) => {
//         setLoading(false);
//       },
//     });
//   }, [searchParams]);

//   return (
//     <Page options={{ title: 'Slack-tilkobling', gutterTop: true }}>
//       <Paper>
//         <Typography variant='h1'>Slack-tilkobling</Typography>
//         <Typography gutterBottom variant='body1'>
//           {searchParams.get('code')
//             ? loading
//               ? 'Kobler din Slack-konto til din TIHLDE-konto...'
//               : 'Noe gikk galt, vi kunne ikke koble sammen din Slack- og TIHLDE-konto.'
//             : 'Ugyldig lenke'}
//         </Typography>
//         {(!loading || !searchParams.get('code')) && (
//           <Button variant='outline'>
//             <Link to={URLS.landing}>Gå til forsiden</Link>
//           </Button>
//         )}
//       </Paper>
//     </Page>
//   );
// };

type ConnectWithSlackProps = {
  className?: string;
};

export const ConnectWithSlack = ({ className }: ConnectWithSlackProps) => {
  const { data } = useUser();
  if (!data || data.slack_user_id) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Koble til Slack</CardTitle>
        <CardDescription>
          Hvis du har en Slack-konto i TIHLDE sin Slack kan du koble den til din konto på TIHLDE.org. Da kan du motta varsler fra oss i Slack. Du kan selv
          bestemme hvilke varsler du vil motta hvor i varslingsinnstillingene.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full' size='lg' variant='outline'>
          <Link
            className='flex items-center'
            to={`https://slack.com/openid/connect/authorize?scope=openid&response_type=code&redirect_uri=${window.location.origin}/slack&client_id=${
              import.meta.env.VITE_SLACK_CLIENT_ID
            }`}>
            <svg className='w-5 h-5 mr-2' viewBox='0 0 122.8 122.8' xmlns='http://www.w3.org/2000/svg'>
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
            </svg>
            Koble til din Slack-bruker
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

const NotificationSetting = ({ choice, notificationSettings, user }: NotificationSettingProps) => {
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
      <td className='text-center p-2'>
        <Switch checked={setting.slack} disabled={!user.slack_user_id} onCheckedChange={(checked) => toggleSetting('slack', checked)} />
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
      <ConnectWithSlack className='mb-4' />
      <p className='text-sm mb-4'>For å være sikker på at du mottar nødvendig informasjon må du velge minst én informasjonskanal for hver type varsel</p>
      <table className='w-full'>
        <thead>
          <th className='text-sm md:text-md w-3/5 text-start p-1'>Type</th>
          <th className='text-sm md:text-md flex-auto p-1'>Epost</th>
          <th className='text-sm md:text-md flex-auto p-1'>Nettsiden</th>
          <th className='text-sm md:text-md flex-auto p-1'>Slack</th>
        </thead>
        <tbody>
          {data && choices.map((choice) => <NotificationSetting choice={choice} key={choice.notification_type} notificationSettings={data} user={user} />)}
        </tbody>
      </table>
    </>
  );
};

export default UserNotificationSettings;
