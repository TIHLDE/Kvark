import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { UserBio } from 'types';

import { useSnackbar } from 'hooks/Snackbar';
import { useCreateUserBio, useUpdateUserBio } from 'hooks/UserBio';

import LoadingSpinner from 'components/miscellaneous/LoadingSpinner';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { ScrollArea } from 'components/ui/scroll-area';
import { Textarea } from 'components/ui/textarea';

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
  const showSnackbar = useSnackbar();
  const createUserBio = useCreateUserBio();
  const updateUserBio = useUpdateUserBio(userBio ? userBio.id : 0);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: userBio ? userBio.description : '',
      gitHub_link: userBio ? userBio.gitHub_link : '',
      linkedIn_link: userBio ? userBio.linkedIn_link : '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoadingSave(true);
    if (!userBio) {
      createUserBio.mutate(values, {
        onSuccess: () => {
          showSnackbar('Profilbio ble opprettet', 'success');
          setOpen(false);
        },
        onSettled: () => {
          setIsLoadingSave(false);
        },
      });
    } else {
      updateUserBio.mutate(values, {
        onSuccess: () => {
          showSnackbar('Profilbio ble oppdatert', 'success');
          setOpen(false);
        },
      });
    }
  };

  return (
    <ScrollArea className='rounded-md'>
      <Form {...form}>
        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beskrivelse</FormLabel>
                <FormControl>
                  <Textarea className='resize-none h-[100px]' placeholder='Beskrivelse' {...field} />
                </FormControl>
                <FormDescription>En kort beskrivelse av deg.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gitHub_link'
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder='https://github.com/TIHLDE' {...field} />
                </FormControl>
                <FormDescription>Din GitHub profil.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='linkedIn_link'
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder='https://linkedin.com/TIHLDE' {...field} />
                </FormControl>
                <FormDescription>Din LinkedIn profil.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size='lg' type='submit'>
            {!isLoadingSave ? 'Lagre' : <LoadingSpinner />}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default UserBioForm;
