import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { linkOptions, useNavigate } from '@tanstack/react-router';
import FormInput from '~/components/inputs/Input';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { createGroupFormMutation } from '~/api/queries/groups';
import type { Group } from '~/types';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddGroupFormDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  title: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Tittel er pakrevd' : undefined),
    })
    .min(1, {
      error: 'Navngi sporreskjemaet',
    }),
});

const AddGroupFormDialog = ({ groupSlug }: AddGroupFormDialogProps) => {
  const createGroupForm = useMutation(createGroupFormMutation);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createGroupForm.mutate(
      {
        slug: groupSlug,
        data: {
          title: values.title,
          fields: [],
        } as never,
      },
      {
        onSuccess: (result) => {
          toast.success('Skjemaet ble opprettet');
          const id = (result as unknown as { id: string }).id?.toString() ?? '';
          navigate(linkOptions({ to: '/sporreskjema/admin/$id', params: { id } }));
        },
        onError: (e) => {
          toast.error(e.message);
        },
      },
    );
  };

  const OpenButton = (
    <Button className='w-full mb-4'>
      <Plus className='mr-2 h-5 w-5' />
      Nytt sporreskjema
    </Button>
  );

  return (
    <ResponsiveDialog
      className='max-w-2xl'
      description='Alle TIHLDE-medlemmer vil kunne svare pa skjemaet, flere ganger om de onsker. Du kan legge til sporsmal etter at du har opprettet skjemaet. Sporsmalene kan endres helt til noen har svart pa skjemaet.'
      title='Nytt sporreskjema'
      trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput form={form} label='Tittel' name='title' required />

          <Button className='w-full' type='submit'>
            {createGroupForm.isPending ? 'Oppretter skjema...' : 'Opprett sporreskjema'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default AddGroupFormDialog;
