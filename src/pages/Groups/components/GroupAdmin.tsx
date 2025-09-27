import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useUpdateGroup } from '~/hooks/Group';
import type { FormGroupValues } from '~/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export type UpdateGroupModalProps = {
  group: FormGroupValues;
};

const formSchema = z.object({
  contact_email: z.union([z.string().email(), z.literal('')]),
  description: z.string(),
  fine_info: z.string(),
  fines_activated: z.boolean(),
  name: z.string().min(1, { message: 'Gruppen må ha et navn' }),
  fines_admin: z.union([z.object({ user_id: z.string() }), z.null()]),
  image: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const GroupAdmin = ({ group }: UpdateGroupModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updateGroup = useUpdateGroup();

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      contact_email: group.contact_email || '',
      description: group.description || '',
      fine_info: group.fine_info || '',
      fines_activated: group.fines_activated,
      name: group.name,
      fines_admin: group.fines_admin ? { user_id: group.fines_admin.user_id } : null,
      image: group.image ?? '',
    } as FormValues,
    async onSubmit({ value }) {
      await toast.promise(
        updateGroup.mutateAsync(
          { ...value, fines_admin: value.fines_admin?.user_id || null, slug: group.slug },
          {
            onSuccess: () => {
              setIsOpen(false);
              form.reset();
            },
          },
        ),
        {
          loading: 'Oppdaterer gruppe...',
          success: 'Gruppen ble oppdatert',
          error: (e) => `Kunne ikke oppdatere gruppen: ${e.detail ?? 'Noe gikk galt'}`,
        },
      );
    },
  });

  return (
    <ResponsiveDialog
      description='Her kan du redigere gruppenavn, beskrivelse, bilde og kontaktperson.'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Rediger gruppen'
      trigger={<Button className='w-full lg:w-auto'>Rediger gruppen</Button>}>
      <ScrollArea className='h-[60vh]'>
        <form className='py-6 px-2 space-y-4' onSubmit={handleFormSubmit(form)}>
          <form.AppField name='name'>{(field) => <field.InputField label='Gruppenavn' required />}</form.AppField>

          <form.AppField name='image'>{(field) => <field.ImageUploadField label='Velg bilde' />}</form.AppField>

          <form.AppField name='description'>{(field) => <field.TextareaField label='Gruppebeskrivelse' />}</form.AppField>

          <form.AppField name='contact_email'>{(field) => <field.InputField label='Kontakt e-post' type='email' />}</form.AppField>

          <form.AppField name='fines_activated'>{(field) => <field.SwitchField className='pt-4' label='Botsystem' />}</form.AppField>

          <form.Subscribe selector={(s) => s.values.fines_activated as boolean}>
            {(fines) =>
              fines ? (
                <>
                  <form.AppField name='fines_admin.user_id'>{(field) => <field.UserField label='Botsjef' />}</form.AppField>

                  <form.AppField name='fine_info'>{(field) => <field.TextareaField label='Botsystem praktiske detaljer' />}</form.AppField>
                </>
              ) : null
            }
          </form.Subscribe>

          <form.AppForm>
            <form.SubmitButton className='w-full' disabled={updateGroup.isPending} type='submit'>
              {updateGroup.isPending ? 'Oppdaterer...' : 'Oppdater'}
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default GroupAdmin;
