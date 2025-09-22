import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useDeleteUser, useLogout } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import type { User } from '~/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type UserDeleteDialogProps = {
  user: User;
  isAdmin?: boolean;
};

const formSchema = z.object({
  userId: z.string({ required_error: 'Feltet er påkrevd' }).min(1, { message: 'Feltet er påkrevd' }),
});

export const UserDeleteDialog = ({ isAdmin, user }: UserDeleteDialogProps) => {
  const { event } = useAnalytics();
  const deleteUser = useDeleteUser();
  const logOut = useLogout();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isAdmin && values.userId !== user.user_id) {
      return form.setError('userId', { message: 'Brukernavn matcher ikke bruker' });
    }
    deleteUser.mutate(isAdmin ? user.user_id : undefined, {
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
  };

  const OpenButton = (
    <Button className='w-full' variant='destructive'>
      Slett konto
    </Button>
  );

  return (
    <ResponsiveDialog
      description={`Det er ikke mulig å angre denne handlingen. Bekreft ved å skrive inn ${isAdmin ? '' : 'ditt'} brukernavn.`}
      onOpenChange={setIsOpen}
      open={isOpen}
      title={`Slett ${isAdmin && 'din'} konto`}
      trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput form={form} label='Brukernavn' name='userId' required />

          <Button className='w-full' type='submit'>
            {deleteUser.isPending ? 'Sletter...' : 'Slett'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default UserDeleteDialog;
