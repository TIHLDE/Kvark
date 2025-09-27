import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { useUpdateUser } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import type { User } from '~/types';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

export type UserSettingsProps = {
  user: User;
  isAdmin?: boolean;
};

const formSchema = z.object({
  first_name: z.string({ required_error: 'Fornavn er påkrevd' }).min(1, { message: 'Fornavn er påkrevd' }),
  last_name: z.string({ required_error: 'Etternavn er påkrevd' }).min(1, { message: 'Etternavn er påkrevd' }),
  email: z.string().email({ message: 'Epost er ugyldig' }),
  image: z.string(),
  gender: z.string(),
  allergy: z.string(),
  tool: z.string(),
  public_event_registrations: z.boolean(),
  accepts_event_rules: z.boolean(),
  allows_photo_by_default: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const UserSettings = ({ isAdmin, user }: UserSettingsProps) => {
  const { event } = useAnalytics();
  const updateUser = useUpdateUser();

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      image: user.image || '',
      gender: user.gender.toString(),
      allergy: user.allergy || '',
      tool: user.tool || '',
      public_event_registrations: user.public_event_registrations,
      accepts_event_rules: user.accepts_event_rules,
      allows_photo_by_default: user.allows_photo_by_default,
    } as FormValues,
    async onSubmit({ value }) {
      await updateUser.mutateAsync(
        { userId: user.user_id, user: { ...user, ...value, gender: parseInt(value.gender) } },
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
    },
  });

  if (!user) return null;

  return (
    <form className='space-y-4' onSubmit={handleFormSubmit(form)}>
      {isAdmin && (
        <div className='space-y-4 lg:space-y-0 lg:flex lg:space-x-4'>
          <form.AppField name='first_name'>{(field) => <field.InputField label='Fornavn' required />}</form.AppField>

          <form.AppField name='last_name'>{(field) => <field.InputField label='Etternavn' required />}</form.AppField>

          <form.AppField name='email'>{(field) => <field.InputField label='Epost' required type='email' />}</form.AppField>
        </div>
      )}

      <form.AppField name='image'>{(field) => <field.ImageUploadField label='Velg profilbilde' />}</form.AppField>

      <form.AppField name='gender'>
        {(field) => (
          <field.SelectField
            label='Kjønn'
            options={[
              { value: '1', content: 'Mann' },
              { value: '2', content: 'Kvinne' },
              { value: '3', content: 'Annet' },
            ]}
          />
        )}
      </form.AppField>

      <form.AppField name='tool'>{(field) => <field.InputField label='Kjøkkenredskap' />}</form.AppField>

      <form.AppField name='allergy'>
        {(field) => <field.TextareaField description='Dine allergier vises til arrangører ved arrangementer' label='Dine allergier' />}
      </form.AppField>

      <form.AppField name='public_event_registrations'>
        {(field) => (
          <field.SwitchField
            label='Offentlige arrangementspåmeldinger'
            description='Bestemmer om du skal stå oppført med navnet ditt eller være anonym i deltagerlister på arrangementer, og om arrangement-kalenderen din skal være aktivert og mulig å abonnere på.'
          />
        )}
      </form.AppField>

      <form.AppField name='accepts_event_rules'>
        {(field) => <field.SwitchField label='Aksepterer arrangementreglene' description='Se arrangementreglene i wiki' />}
      </form.AppField>
      <div className='text-sm'>
        <Link className='text-primary' to='/wiki/arrangementsregler/'>
          Arrangementreglene
        </Link>
      </div>

      <form.AppField name='allows_photo_by_default'>
        {(field) => (
          <field.SwitchField
            label='Jeg godtar at bilder av meg kan deles på TIHLDE sine plattformer'
            description='Godtar at bilder av deg kan deles på TIHLDE sine plattformer'
          />
        )}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton loading={'Lagrer...'} className='w-full' type='submit'>
          Lagre
        </form.SubmitButton>
      </form.AppForm>
    </form>
  );
};

export default UserSettings;
