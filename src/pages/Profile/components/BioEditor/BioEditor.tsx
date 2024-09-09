import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { UserBio } from 'types';

import { useCreateUserBio, useUpdateUserBio } from 'hooks/UserBio';

import FormInput from 'components/inputs/Input';
import FormTextarea from 'components/inputs/Textarea';
import { Button } from 'components/ui/button';
import { Form } from 'components/ui/form';

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
    .url({
      message: 'Ugyldig URL',
    })
    .max(300, {
      message: 'Maks 300 tegn',
    })
    .optional()
    .or(z.literal('')),
  linkedIn_link: z
    .string()
    .url({
      message: 'Ugyldig URL',
    })
    .max(300, {
      message: 'Maks 300 tegn',
    })
    .optional()
    .or(z.literal('')),
});

export type UserBioProps = {
  userBio: UserBio;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UserBioForm = ({ userBio, setOpen }: UserBioProps) => {
  const createUserBio = useCreateUserBio();
  const updateUserBio = useUpdateUserBio(userBio ? userBio.id : 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: userBio ? userBio.description : '',
      gitHub_link: userBio ? userBio.gitHub_link : '',
      linkedIn_link: userBio ? userBio.linkedIn_link : '',
    },
  });

  const description = form.watch('description') || '';

  const charactersLeft = 500 - description.length;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!userBio) {
      createUserBio.mutate(values, {
        onSuccess: () => {
          toast.success('Profilbio ble opprettet');
          setOpen(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    } else {
      updateUserBio.mutate(values, {
        onSuccess: () => {
          toast.success('Profilbio ble oppdatert');
          setOpen(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-6 px-4 pb-6' onSubmit={form.handleSubmit(onSubmit)}>
      <FormTextarea description={`Tegn igjen = ${charactersLeft}`} form={form} label='Beskrivelse' maxLength={500} name='description' />

        <FormInput description='Din GitHub profil.' form={form} label='GitHub' name='gitHub_link' />

        <FormInput description='Din LinkedIn profil.' form={form} label='LinkedIn' name='linkedIn_link' />

        <Button className='w-full' type='submit'>
          {!userBio ? 'Opprett' : 'Oppdater'}
        </Button>
      </form>
    </Form>
  );
};

export default UserBioForm;
