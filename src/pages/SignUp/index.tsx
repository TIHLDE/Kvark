import { loginUser } from '~/api/auth';
import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import Page from '~/components/navigation/Page';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useConfetti } from '~/hooks/Confetti';
import { useStudyGroups, useStudyyearGroups } from '~/hooks/Group';
import { useCreateUser } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import type { RequestResponse, UserCreate } from '~/types';
import URLS from '~/URLS';
import { Info } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z
  .object({
    class: z.string().min(1, { message: 'Feltet er påkrevd' }),
    email: z.string().email('Ugyldig e-post').min(1, { message: 'Feltet er påkrevd' }),
    first_name: z.string().min(1, { message: 'Feltet er påkrevd' }),
    last_name: z.string().min(1, { message: 'Feltet er påkrevd' }),
    study: z.string().min(1, { message: 'Feltet er påkrevd' }),
    user_id: z
      .string()
      .min(1, { message: 'Feltet er påkrevd' })
      .refine((value) => !value.includes('@'), { message: 'Brukernavn må være uten @stud.ntnu.no' }),
    password: z.string().min(8, { message: 'Minimum 8 karakterer' }),
    password_verify: z.string().min(8, { message: 'Minimum 8 karakterer' }),
  })
  .refine((data) => data.password === data.password_verify, {
    message: 'Passordene må være like',
    path: ['password_verify'],
  });

type FormValues = z.infer<typeof formSchema>;

const SignUp = () => {
  const confetti = useConfetti();
  const { event } = useAnalytics();
  const { data: studies } = useStudyGroups();
  const { data: studyyears } = useStudyyearGroups();
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const [redirectUrl] = useQueryState('redirect', parseAsString.withDefault('/'));

  const form = useAppForm({
    validators: { onBlur: formSchema },
    defaultValues: {
      class: '',
      email: '',
      first_name: '',
      last_name: '',
      study: '',
      user_id: '',
      password: '',
      password_verify: '',
    } as FormValues,
    async onSubmit({ value }) {
      const userData: UserCreate = {
        user_id: value.user_id.toLowerCase(),
        first_name: value.first_name,
        last_name: value.last_name,
        email: value.email,
        password: value.password,
        class: value.class,
        study: value.study,
      };

      try {
        await createUser.mutateAsync(userData);
        event('signup', 'auth', `Signed up`);
      } catch (e) {
        toast.error('En feil oppstod under opprettelse av bruker: ' + ((e as RequestResponse).detail ?? 'Noe gikk galt'));
      }

      try {
        await loginUser(userData.user_id, value.password);
        confetti.run();
        navigate(redirectUrl);
      } catch (e: unknown) {
        toast.error('Kunne ikke logge inn med ny bruker: ' + ((e as RequestResponse).detail ?? 'Noe gikk galt'));
      }
    },
  });

  return (
    <Page>
      <Card className='max-w-3xl w-full mx-auto'>
        <CardHeader>
          <CardTitle>Opprett bruker</CardTitle>
          <CardDescription>Opprett en bruker for å få tilgang til TIHLDE sine tjenester</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
            <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
              <form.AppField name='first_name'>{(field) => <field.InputField label='Fornavn' placeholder='Skriv her...' required />}</form.AppField>

              <form.AppField name='last_name'>{(field) => <field.InputField label='Etternavn' placeholder='Skriv her...' required />}</form.AppField>
            </div>

            <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
              <form.AppField name='user_id'>{(field) => <field.InputField label='Feide brukernavn' placeholder='Skriv her...' required />}</form.AppField>

              <form.AppField name='email'>{(field) => <field.InputField label='Epost' placeholder='Skriv her...' required type='email' />}</form.AppField>
            </div>

            <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
              <form.AppField name='study'>
                {(field) => (
                  <field.SelectField
                    label='Studie'
                    options={(studies ?? []).map((s) => ({ value: s.slug, content: s.name }))}
                    placeholder='Velg studie'
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name='class'>
                {(field) => (
                  <field.SelectField
                    label='Kull'
                    options={(studyyears ?? []).map((y) => ({ value: y.slug, content: y.name }))}
                    placeholder='Velg kull'
                    required
                  />
                )}
              </form.AppField>
            </div>

            <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
              <form.AppField name='password'>
                {(field) => <field.InputField label='Passord' placeholder='Skriv her...' required type='password' />}
              </form.AppField>

              <form.AppField name='password_verify'>
                {(field) => <field.InputField label='Gjenta passord' placeholder='Skriv her...' required type='password' />}
              </form.AppField>
            </div>

            <Alert variant='warning'>
              <Info className='w-4 h-4' />
              <AlertTitle className='pb-4'>Etter du har opprettet bruker må vi fortsatt godkjenne deg før du kan logge inn!</AlertTitle>
              <AlertDescription>
                For å unngå at vi får mange brukere som ikke er reelle TIHLDE-medlemmer, må vi aktivere nye brukere før de får logge inn. For å få aktivert
                brukeren din kan du ta kontakt med{' '}
                <a className='text-blue-500 hover:underline' href='mailto:hs@tihlde.org' rel='noopener noreferrer' target='_blank'>
                  hs@tihlde.org
                </a>
              </AlertDescription>
            </Alert>

            <form.AppForm>
              <form.SubmitButton className='w-full' loading='Oppretter bruker...' size='lg' type='submit'>
                Opprett bruker
              </form.SubmitButton>
            </form.AppForm>
          </form>

          <div className='flex items-center justify-center space-x-12 mt-6'>
            <Link className={buttonVariants({ variant: 'link' })} to={URLS.forgotPassword}>
              Glemt passord?
            </Link>

            <Link className={buttonVariants({ variant: 'link' })} to={URLS.login}>
              Logg inn
            </Link>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default SignUp;
