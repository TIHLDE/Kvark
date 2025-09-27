import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateForm } from '~/hooks/Form';
import type { Group, GroupFormCreate, RequestResponse } from '~/types';
import { FormResourceType } from '~/types/Enums';
import { Plus } from 'lucide-react';
import { href, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddGroupFormDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  title: z.string({ required_error: 'Tittel er påkrevd' }).min(1, { message: 'Navngi spørreskjemaet' }),
});

const AddGroupFormDialog = ({ groupSlug }: AddGroupFormDialogProps) => {
  const createGroupForm = useCreateForm();
  const navigate = useNavigate();

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: { title: '' },
    async onSubmit({ value }: { value: z.infer<typeof formSchema> }) {
      const newForm: GroupFormCreate = {
        title: value.title,
        group: groupSlug,
        resource_type: FormResourceType.GROUP_FORM,
        fields: [],
      };

      await toast.promise(createGroupForm.mutateAsync(newForm), {
        loading: 'Oppretter skjema...',
        success: (v) => {
          navigate(
            href('/sporreskjema/admin/:id', {
              id: v.id,
            }),
          );
          return 'Skjemaet ble opprettet';
        },
        error: (e) => `Kunne ikke opprette skjemaet: ${(e as RequestResponse).detail ?? 'Noe gikk galt'}`,
      });
    },
  });

  return (
    <ResponsiveDialog
      className='max-w-2xl'
      description='Alle TIHLDE-medlemmer vil kunne svare på skjemaet, flere ganger om de ønsker. Du kan legge til spørsmål etter at du har opprettet skjemaet. Spørsmålene kan endres helt til noen har svart på skjemaet.'
      title='Nytt spørreskjema'
      trigger={
        <Button className='w-full mb-4'>
          <Plus className='mr-2 h-5 w-5' />
          Nytt spørreskjema
        </Button>
      }>
      <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='title'>{(field) => <field.InputField label='Tittel' required />}</form.AppField>

        <form.AppForm>
          <form.SubmitButton className='w-full' loading='Oppretter skjema...' type='submit'>
            Opprett spørreskjema
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default AddGroupFormDialog;
