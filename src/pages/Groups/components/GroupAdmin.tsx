import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import FormBasicSwitch from '~/components/inputs/Switch';
import { FormImageUpload } from '~/components/inputs/Upload';
import { SingleUserSearch } from '~/components/inputs/UserSearch';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useUpdateGroup } from '~/hooks/Group';
import type { FormGroupValues } from '~/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type UpdateGroupModalProps = {
  group: FormGroupValues;
};

const formSchema = z.object({
  contact_email: z.string().email().optional(),
  description: z.string().optional(),
  fine_info: z.string().optional(),
  fines_activated: z.boolean(),
  name: z.string().min(1, { message: 'Gruppen må ha et navn' }),
  fines_admin: z.object({ user_id: z.string() }).nullable(),
  image: z.string().optional(),
});

const GroupAdmin = ({ group }: UpdateGroupModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_email: group.contact_email || '',
      description: group.description || '',
      fine_info: group.fine_info || '',
      fines_activated: group.fines_activated,
      name: group.name,
      fines_admin: group.fines_admin || null,
      image: group.image ?? '',
    },
  });
  const watchFinesActivated = form.watch('fines_activated');
  const updateGroup = useUpdateGroup();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateGroup.mutate(
      { ...values, fines_admin: values.fines_admin?.user_id || null, slug: group.slug },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success('Gruppen ble oppdatert');
        },
        onError: (e) => {
          toast.error(e.detail);
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

            <FormImageUpload form={form} label='Velg bilde' name='image' ratio='1:1' />

            <MarkdownEditor form={form} label='Gruppebeskrivelse' name='description' />

            <FormInput form={form} label='Kontakt e-post' name='contact_email' type='email' />

            <FormBasicSwitch className='pt-4' form={form} label='Botsystem' name='fines_activated' />

            {watchFinesActivated && (
              <>
                <SingleUserSearch form={form} inGroup={group.slug} label='Botsjef' name='fines_admin' user={group.fines_admin} />

                <MarkdownEditor form={form} label='Botsystem praktiske detaljer' name='fine_info' required />
              </>
            )}

            <Button className='w-full' disabled={updateGroup.isLoading} type='submit'>
              {updateGroup.isLoading ? 'Oppdaterer...' : 'Oppdater'}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default GroupAdmin;
