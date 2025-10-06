import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateForm } from '~/hooks/Form';
import type { Group, GroupFormCreate } from '~/types';
import { FormResourceType } from '~/types/Enums';
import URLS from '~/URLS';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddGroupFormDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  title: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Tittel er påkrevd' : undefined),
    })
    .min(1, {
      error: 'Navngi spørreskjemaet',
    }),
});

const AddGroupFormDialog = ({ groupSlug }: AddGroupFormDialogProps) => {
  const createGroupForm = useCreateForm();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newForm: GroupFormCreate = {
      title: values.title,
      group: groupSlug,
      resource_type: FormResourceType.GROUP_FORM,
      fields: [],
    };
    createGroupForm.mutate(newForm, {
      onSuccess: (form) => {
        toast.success(`Skjemaet ble opprettet`);
        navigate(`${URLS.form}admin/${form.id}`);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const OpenButton = (
    <Button className='w-full mb-4'>
      <Plus className='mr-2 h-5 w-5' />
      Nytt spørreskjema
    </Button>
  );

  return (
    <ResponsiveDialog
      className='max-w-2xl'
      description='Alle TIHLDE-medlemmer vil kunne svare på skjemaet, flere ganger om de ønsker. Du kan legge til spørsmål etter at du har opprettet skjemaet. Spørsmålene kan endres helt til noen har svart på skjemaet.'
      title='Nytt spørreskjema'
      trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput form={form} label='Tittel' name='title' required />

          <Button className='w-full' type='submit'>
            {createGroupForm.isPending ? 'Oppretter skjema...' : 'Opprett spørreskjema'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default AddGroupFormDialog;
