import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import FormInput from '~/components/inputs/Input';
import { FormSelect } from '~/components/inputs/Select';
import { FormDetailSwitch } from '~/components/inputs/Switch';
import FormTextarea from '~/components/inputs/Textarea';
import { FormImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { useUpdateUser } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import type { User } from '~/types';

export type UserSettingsProps = {
  user: User;
  isAdmin?: boolean;
};

const formSchema = z.object({
  first_name: z.string({ required_error: 'Fornavn er påkrevd' }).min(1, { message: 'Fornavn er påkrevd' }),
  last_name: z.string({ required_error: 'Etternavn er påkrevd' }).min(1, { message: 'Etternavn er påkrevd' }),
  email: z.string().email({ message: 'Epost er ugyldig' }),
  image: z.string().optional(),
  gender: z.string(),
  allergy: z.string().optional(),
  tool: z.string().optional(),
  public_event_registrations: z.boolean(),
  accepts_event_rules: z.boolean(),
  allows_photo_by_default: z.boolean(),
});

export const UserSettings = ({ isAdmin, user }: UserSettingsProps) => {
  const { event } = useAnalytics();
  const updateUser = useUpdateUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...user, image: user.image || '', gender: user.gender.toString() },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (updateUser.isLoading) {
      return;
    }
    updateUser.mutate(
      { userId: user.user_id, user: { ...user, ...values, gender: Number.parseInt(values.gender) } },
      {
        onSuccess: () => {
          toast.success('Bruker oppdatert');
          event('update-settings', 'profile', 'Update');
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  if (!user) {
    return null;
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        {isAdmin && (
          <div className='space-y-4 lg:space-y-0 lg:flex lg:space-x-4'>
            <FormInput form={form} label='Fornavn' name='first_name' required />

            <FormInput form={form} label='Etternavn' name='last_name' required />

            <FormInput form={form} label='Epost' name='email' required type='email' />
          </div>
        )}

        <FormImageUpload form={form} label='Velg profilbilde' name='image' />

        <FormSelect
          form={form}
          label='Kjønn'
          name='gender'
          options={[
            { label: 'Mann', value: 1 },
            { label: 'Kvinne', value: 2 },
            { label: 'Annet', value: 3 },
          ]}
        />

        <FormInput form={form} label='Kjøkkenredskap' name='tool' />

        <FormTextarea description='Dine allergier vises til arrangører ved arrangementer' form={form} label='Dine allergier' name='allergy' />

        <FormDetailSwitch
          description='Bestemmer om du skal stå oppført med navnet ditt eller være anonym i deltagerlister på arrangementer, og om arrangement-kalenderen din skal være aktivert og mulig å abonnere på.'
          form={form}
          label='Offentlige arrangementspåmeldinger'
          name='public_event_registrations'
        />

        <FormDetailSwitch
          description={
            <Link className='text-primary' to='/wiki/arrangementsregler/'>
              Arrangementreglene
            </Link>
          }
          form={form}
          label='Aksepterer arrangementreglene'
          name='accepts_event_rules'
        />

        <FormDetailSwitch
          description='Godtar at bilder av deg kan deles på TIHLDE sine plattformer'
          form={form}
          label='Jeg godtar at bilder av meg kan deles på TIHLDE sine plattformer'
          name='allows_photo_by_default'
        />

        <Button className='w-full' type='submit'>
          {updateUser.isLoading ? 'Lagrer...' : 'Lagre'}
        </Button>
      </form>
    </Form>
  );
};

export default UserSettings;
