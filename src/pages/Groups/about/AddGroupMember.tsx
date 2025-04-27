import { zodResolver } from '@hookform/resolvers/zod';
import { SingleUserSearch } from '~/components/inputs/UserSearch';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateMembership } from '~/hooks/Membership';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddMemberModalProps = {
  groupSlug: string;
};

const formSchema = z.object({
  user: z.object(
    {
      user_id: z.string(),
    },
    { required_error: 'Du må velge en bruker' },
  ),
});

const AddGroupMember = ({ groupSlug }: AddMemberModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const createMembership = useCreateMembership();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMembership.mutate(
      { groupSlug: groupSlug, userId: values.user.user_id },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
          toast.success('Medlem lagt til');
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  const OpenButton = (
    <Button variant='outline'>
      <Plus className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Legg til
    </Button>
  );

  return (
    <ResponsiveDialog
      className='w-full max-w-md'
      description='Brukeren vil motta en epost/varsel om at de er lagt til i gruppen.'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Legg til medlem'
      trigger={OpenButton}>
      <Form {...form}>
        <form className='px-2 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <SingleUserSearch form={form} label='Søk etter bruker' name='user' />

          <Button className='w-full' disabled={createMembership.isPending}>
            {createMembership.isPending ? 'Legger til...' : 'Legg til medlem'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default AddGroupMember;
