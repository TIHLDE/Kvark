import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { Skeleton } from '~/components/ui/skeleton';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import { useActivateUser, useDeclineUser, useUser } from '~/hooks/User';
import UserDeleteDialog from '~/pages/Profile/components/ProfileSettings/UserDeleteDialog';
import UserSettings from '~/pages/Profile/components/ProfileSettings/UserSettings';
import type { UserList } from '~/types';
import { getUserAffiliation } from '~/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  reason: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const DeclineUser = ({ user }: Pick<PersonListItemProps, 'user'>) => {
  const [showDialog, setShowDialog] = useState(false);
  const declineUser = useDeclineUser();

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
      async onSubmitAsync({ value }) {
        await declineUser.mutateAsync(
          { userId: user.user_id, reason: value.reason },
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
      },
    },
    defaultValues: { reason: '' } as FormValues,
  });
  return (
    <ResponsiveDialog
      description='Brukeren vil få beskjed via epost om at brukeren ble avslått sammen med begrunnelsen.'
      onOpenChange={setShowDialog}
      open={showDialog}
      title='Avslå bruker'
      trigger={
        <Button className='w-full' variant='outline'>
          Avslå
        </Button>
      }>
      <form className='space-y-4' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='reason'>{(field) => <field.TextareaField label='Begrunnelse (valgfri)' />}</form.AppField>
        <form.AppForm>
          <form.SubmitButton loading={'Avslår...'} className='w-full' type='submit'>
            Avslå bruker
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export type PersonListItemProps = {
  user: UserList;
  isMember?: boolean;
};

const PersonListItem = ({ user, isMember = true }: PersonListItemProps) => {
  const activateUser = useActivateUser();
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const [expanded, setExpanded] = useState(false);
  const { data } = useUser(user.user_id, { enabled: expanded && isMember });
  const activate = () =>
    activateUser.mutate(user.user_id, {
      onSuccess: (data) => {
        toast.success(data.detail);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  return (
    <Expandable
      description={(isDesktop && getUserAffiliation(user)) || undefined}
      icon={
        <Avatar>
          <AvatarImage alt={user.first_name} src={user.image} />
          <AvatarFallback>{user.first_name[0] + user.last_name[0]}</AvatarFallback>
        </Avatar>
      }
      onOpenChange={setExpanded}
      open={expanded}
      title={`${user.first_name} ${user.last_name}`}>
      <div>
        {isMember ? (
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
