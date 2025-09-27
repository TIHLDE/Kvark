import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateMembership } from '~/hooks/Membership';
import { Plus } from 'lucide-react';
import { useState } from 'react';
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

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
    },
    defaultValues: {
      user: {
        user_id: '',
      },
    } as z.infer<typeof formSchema>,

    async onSubmit({ value }) {
      try {
        await createMembership.mutateAsync({ groupSlug: groupSlug, userId: value.user.user_id });
        form.reset();
        setIsOpen(false);
        toast.success('Medlem lagt til');
      } catch (e) {
        toast.error(e.detail);
      }
    },
  });

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
      <form className='px-2 space-y-4' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='user.user_id'>{(field) => <field.UserField label='Søk etter bruker' />}</form.AppField>

        <Button className='w-full' disabled={createMembership.isPending}>
          {createMembership.isPending ? 'Legger til...' : 'Legg til medlem'}
        </Button>
      </form>
    </ResponsiveDialog>
  );
};

export default AddGroupMember;
