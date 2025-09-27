import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { useCreateUserBio, useUpdateUserBio } from '~/hooks/UserBio';
import type { UserBio } from '~/types';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  description: z
    .string()
    .max(500, {
      message: 'Maks 500 tegn',
    })
    .optional()
    .or(z.literal('')),
  gitHub_link: z
    .string()
    .startsWith('https://github.com/', { message: 'URL må starte med "https://github.com/"' })
    .url({
      message: 'Må være en gyldig url',
    })
    .max(300, {
      message: 'Maks 300 tegn',
    })
    .optional()
    .or(z.literal('')),
  linkedIn_link: z
    .string()
    .startsWith('https://linkedin.com/', { message: 'URL må starte med "https://linkedin.com/"' })
    .url({
      message: 'Må være en gyldig url',
    })
    .max(300, {
      message: 'Maks 300 tegn',
    })
    .optional()
    .or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;

export type UserBioProps = {
  userBio: UserBio;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UserBioForm = ({ userBio, setOpen }: UserBioProps) => {
  const createUserBio = useCreateUserBio();
  const updateUserBio = useUpdateUserBio(userBio ? userBio.id : 0);

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    defaultValues: {
      description: userBio ? userBio.description : '',
      gitHub_link: userBio ? userBio.gitHub_link : '',
      linkedIn_link: userBio ? userBio.linkedIn_link : '',
    } as FormValues,
    async onSubmit({ value }) {
      if (!userBio) {
        await createUserBio.mutateAsync(value, {
          onSuccess: () => {
            toast.success('Profilbio ble opprettet');
            setOpen(false);
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        });
      } else {
        await updateUserBio.mutateAsync(value, {
          onSuccess: () => {
            toast.success('Profilbio ble oppdatert');
            setOpen(false);
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        });
      }
    },
  });

  return (
    <form className='space-y-6 px-4 pb-6' onSubmit={handleFormSubmit(form)}>
      <form.AppField name='description'>{(field) => <field.TextareaField label='Beskrivelse' />}</form.AppField>
      <form.Subscribe selector={(s) => s.values.description as string}>
        {(desc) => <p className='text-sm text-muted-foreground'>Tegn igjen: {500 - (desc?.length || 0)}</p>}
      </form.Subscribe>

      <form.AppField name='gitHub_link'>{(field) => <field.InputField label='GitHub' description='Din GitHub profil.' />}</form.AppField>

      <form.AppField name='linkedIn_link'>{(field) => <field.InputField label='LinkedIn' description='Din LinkedIn profil.' />}</form.AppField>

      <form.AppForm>
        <form.SubmitButton className='w-full' type='submit'>
          {!userBio ? 'Opprett' : 'Oppdater'}
        </form.SubmitButton>
      </form.AppForm>
    </form>
  );
};

export default UserBioForm;
