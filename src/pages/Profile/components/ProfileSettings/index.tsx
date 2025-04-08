import { BellPlusIcon, CloudDownloadIcon, KeyRoundIcon, TrashIcon, UserCogIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import { useExportUserData, useForgotPassword } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import UserNotificationSettings, { ConnectWithDiscord } from '~/pages/Profile/components/ProfileSettings/NotificationSettings';
import UserDeleteDialog from '~/pages/Profile/components/ProfileSettings/UserDeleteDialog';
import UserSettings from '~/pages/Profile/components/ProfileSettings/UserSettings';
import type { User } from '~/types';

export type ProfileSettingsProps = {
  user: User;
};

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const { event } = useAnalytics();
  const forgotPassword = useForgotPassword();
  const exportUserData = useExportUserData();
  const runExportUserdata = () =>
    exportUserData.mutate(undefined, {
      onSuccess: (data) => {
        event('export-data', 'profile', 'Exported user data');
        toast.success(data.detail);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  const resetPassword = () => {
    forgotPassword.mutate(user.email, {
      onSuccess: () => {
        toast.success('Vi har sendt deg en epost med link til en side der du kan endre passordet ditt');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  return (
    <div className='space-y-2'>
      <ConnectWithDiscord />
      <Expandable
        className='dark:bg-card'
        description='Bestem hvor du ønsker å motta ulike typer varsler'
        icon={<BellPlusIcon className='stroke-[1.5px]' />}
        title='Varslingsinnstillinger'
      >
        <UserNotificationSettings user={user} />
      </Expandable>
      <Expandable
        className='dark:bg-card'
        description='Motta en link i din epost til side der du kan endre passord'
        icon={<KeyRoundIcon className='stroke-[1.5px]' />}
        title='Endre passord'
      >
        <Button className='w-full' disabled={forgotPassword.isLoading} onClick={resetPassword} size='lg' variant='outline'>
          Endre Passord
        </Button>
      </Expandable>
      <Expandable
        className='dark:bg-card'
        description='Endre informasjon om deg selv'
        icon={<UserCogIcon className='stroke-[1.5px]' />}
        title='Profil-innstillinger'
      >
        <UserSettings user={user} />
      </Expandable>
      <Expandable
        className='dark:bg-card'
        description='Få tilsendt alle data vi har lagret i tilknytning til din bruker'
        icon={<CloudDownloadIcon className='stroke-[1.5px]' />}
        title='Eksporter brukerdata'
      >
        <Button className='w-full' disabled={forgotPassword.isLoading} onClick={runExportUserdata} size='lg' variant='outline'>
          Eksporter brukerdata
        </Button>
      </Expandable>
      <Expandable
        className='dark:bg-card'
        description='Slett din bruker og alle tilhørende data vi har lagret'
        icon={<TrashIcon className='stroke-[1.5px]' />}
        title='Slett brukerkonto'
      >
        <div className='space-y-2'>
          <h1 className='text-destructive text-xl font-semibold'>Slett brukerkonto</h1>
          <p className='text-sm'>
            Slett din bruker og alle tilhørende data vi har lagret. Dine påmeldinger, medlemsskap, korte linker og badges er blant det som vil slettes for
            alltid. Det er ikke mulig å angre denne handlingen.
          </p>
          <UserDeleteDialog user={user} />
        </div>
      </Expandable>
    </div>
  );
};

export default ProfileSettings;
