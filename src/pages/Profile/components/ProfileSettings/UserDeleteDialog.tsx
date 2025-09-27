import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useDeleteUser, useLogout } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import type { User } from '~/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export type UserDeleteDialogProps = {
  user: User;
  isAdmin?: boolean;
};

const formSchema = z.object({
  userId: z.string({ required_error: 'Feltet er påkrevd' }).min(1, { message: 'Feltet er påkrevd' }),
});

type FormValues = z.infer<typeof formSchema>;

export const UserDeleteDialog = ({ isAdmin, user }: UserDeleteDialogProps) => {
  const { event } = useAnalytics();
  const deleteUser = useDeleteUser();
  const logOut = useLogout();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: { userId: '' } as FormValues,
    async onSubmit({ value }) {
      if (isAdmin && value.userId !== user.user_id) {
        return;
      }

      await deleteUser.mutateAsync(isAdmin ? user.user_id : undefined, {
        onSuccess: (data) => {
          toast.success(data.detail);
          event('delete-user', 'profile', 'Deleted user');
          if (!isAdmin) logOut();
          setIsOpen(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    },
  });

  return (
    <ResponsiveDialog
      description={`Det er ikke mulig å angre denne handlingen. Bekreft ved å skrive inn ${isAdmin ? '' : 'ditt'} brukernavn.`}
      onOpenChange={setIsOpen}
      open={isOpen}
      title={`Slett ${isAdmin && 'din'} konto`}
      trigger={
        <Button className='w-full' variant='destructive'>
          Slett konto
        </Button>
      }>
      <form className='space-y-4' onSubmit={handleFormSubmit(form)}>
        <form.AppField
          validators={{
            onChange: ({ value }) => {
              if (isAdmin && value !== user.user_id) {
                return 'Brukernavn matcher ikke';
              }
            },
          }}
          name='userId'>
          {(field) => <field.InputField label='Brukernavn' required />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton loading='Sletter...' className='w-full' type='submit'>
            Slett
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default UserDeleteDialog;
