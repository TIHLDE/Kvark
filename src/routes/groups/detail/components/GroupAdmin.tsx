import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import FormInput from '~/components/inputs/Input';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import FormBasicSwitch from '~/components/inputs/Switch';
import { FormImageUpload } from '~/components/inputs/Upload';
// TODO: Re-add SingleUserSearch for fines admin when needed
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { updateGroupMutation } from '~/api/queries/groups';
import type { FormGroupValues } from '~/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type UpdateGroupModalProps = {
  group: FormGroupValues;
};

const formSchema = z.object({
  contactEmail: z.email().optional(),
  description: z.string().optional(),
  finesInfo: z.string().optional(),
  finesActivated: z.boolean(),
  name: z.string().min(1, {
    error: 'Gruppen ma ha et navn',
  }),
  finesAdminId: z.string().nullable(),
  imageUrl: z.string().optional(),
});

const GroupAdmin = ({ group }: UpdateGroupModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactEmail: (group as unknown as Record<string, string>).contactEmail || '',
      description: group.description || '',
      finesInfo: (group as unknown as Record<string, string>).finesInfo || '',
      finesActivated: group.fines_activated,
      name: group.name,
      finesAdminId: group.fines_admin?.user_id || null,
      imageUrl: group.image ?? '',
    },
  });
  const watchFinesActivated = form.watch('finesActivated');
  const updateGroup = useMutation(updateGroupMutation);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateGroup.mutate(
      { slug: group.slug, data: values as never },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success('Gruppen ble oppdatert');
        },
        onError: (e) => {
          toast.error((e as unknown as { detail: string }).detail ?? e.message);
        },
      },
    );
  };

  const OpenButton = <Button className='w-full lg:w-auto'>Rediger gruppen</Button>;

  return (
    <ResponsiveDialog
      description='Her kan du redigere gruppenavn, beskrivelse, bilde og kontaktperson.'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Rediger gruppen'
      trigger={OpenButton}>
      <ScrollArea className='h-[60vh]'>
        <Form {...form}>
          <form className='py-6 px-2 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput form={form} label='Gruppenavn' name='name' required />

            <FormImageUpload form={form} label='Velg bilde' name='imageUrl' ratio='1:1' />

            <MarkdownEditor form={form} label='Gruppebeskrivelse' name='description' />

            <FormInput form={form} label='Kontakt e-post' name='contactEmail' type='email' />

            <FormBasicSwitch className='pt-4' form={form} label='Botsystem' name='finesActivated' />

            {watchFinesActivated && (
              <>
                {/* TODO: Re-add user search for fines admin */}
                <MarkdownEditor form={form} label='Botsystem praktiske detaljer' name='finesInfo' required />
              </>
            )}

            <Button className='w-full' disabled={updateGroup.isPending} type='submit'>
              {updateGroup.isPending ? 'Oppdaterer...' : 'Oppdater'}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default GroupAdmin;
