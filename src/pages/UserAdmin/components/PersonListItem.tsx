import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getUserAffiliation } from 'utils';
import { z } from 'zod';

import { UserList } from 'types';

import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';
import { useActivateUser, useDeclineUser, useUser } from 'hooks/User';

import UserDeleteDialog from 'pages/Profile/components/ProfileSettings/UserDeleteDialog';
import UserSettings from 'pages/Profile/components/ProfileSettings/UserSettings';

import FormTextarea from 'components/inputs/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import Expandable from 'components/ui/expandable';
import { Form } from 'components/ui/form';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { Skeleton } from 'components/ui/skeleton';

const formSchema = z.object({
  reason: z.string().optional(),
});

const DeclineUser = ({ user }: Pick<PersonListItemProps, 'user'>) => {
  const [showDialog, setShowDialog] = useState(false);
  const declineUser = useDeclineUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const decline = (values: z.infer<typeof formSchema>) =>
    declineUser.mutate(
      { userId: user.user_id, reason: values.reason || '' },
      {
        onSuccess: (data) => {
          setShowDialog(false);
          toast.success(data.detail);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      Avslå
    </Button>
  );

  return (
    <ResponsiveDialog
      description='Brukeren vil få beskjed via epost om at brukeren ble avslått sammen med begrunnelsen.'
      onOpenChange={setShowDialog}
      open={showDialog}
      title='Avslå bruker'
      trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(decline)}>
          <FormTextarea form={form} label='Begrunnelse (valgfri)' name='reason' />

          <Button className='w-full' disabled={declineUser.isLoading} type='submit'>
            {declineUser.isLoading ? 'Avslår...' : 'Avslå bruker'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export type PersonListItemProps = {
  user: UserList;
  is_TIHLDE_member?: boolean;
};

const PersonListItem = ({ user, is_TIHLDE_member = true }: PersonListItemProps) => {
  const activateUser = useActivateUser();
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const [expanded, setExpanded] = useState(false);
  const { data } = useUser(user.user_id, { enabled: expanded && is_TIHLDE_member });
  const activate = () =>
    activateUser.mutate(user.user_id, {
      onSuccess: (data) => {
        toast.success(data.detail);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  const UserAvatar = (
    <Avatar>
      <AvatarImage alt={user.first_name} src={user.image} />
      <AvatarFallback>{user.first_name[0] + user.last_name[0]}</AvatarFallback>
    </Avatar>
  );

  return (
    <Expandable
      description={(isDesktop && getUserAffiliation(user)) || undefined}
      icon={UserAvatar}
      onOpenChange={setExpanded}
      open={expanded}
      title={`${user.first_name} ${user.last_name}`}>
      <div>
        {is_TIHLDE_member ? (
          data && (
            <div className='space-y-2'>
              <UserSettings isAdmin user={data} />
              <UserDeleteDialog isAdmin user={data} />
            </div>
          )
        ) : (
          <div className='space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-4'>
            <Button className='w-full' onClick={activate} variant='outline'>
              Legg til medlem
            </Button>
            <DeclineUser user={user} />
          </div>
        )}
      </div>
    </Expandable>
  );
};

export default PersonListItem;

export const PersonListItemLoading = () => {
  return (
    <div className='space-y-2'>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton className='h-12' key={index} />
      ))}
    </div>
  );
};
