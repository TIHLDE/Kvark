import { loginUser } from '~/api/auth';
import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import Page from '~/components/navigation/Page';
import { buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { analyticsEvent } from '~/hooks/Utils';
import { RequestResponse } from '~/types';
import URLS from '~/URLS';
import { parseAsString, useQueryState } from 'nuqs';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Brukernavn er påkrevd' }),
  password: z.string().min(1, { message: 'Passorde er påkrevd' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [redirectUrl] = useQueryState('redirect', parseAsString.withDefault('/'));

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      username: '',
      password: '',
    } as LoginFormValues,
    async onSubmit({ value }) {
      try {
        await loginUser(value.username, value.password);
        analyticsEvent('login', 'auth', 'Logged inn');
        navigate(redirectUrl);
      } catch (e) {
        toast.error('Kunne ikke logge inn: ' + ((e as RequestResponse).detail ?? 'Noe gikk galt'));
      }
    },
  });

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Logg inn</CardTitle>
          <CardDescription>Logg inn med ditt TIHLDE brukernavn og passord</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
            <form.AppField name='username'>{(field) => <field.InputField label='Brukernavn' required placeholder='Skriv her...' />}</form.AppField>

            <form.AppField name='password'>{(field) => <field.InputField label='Passord' required placeholder='Skriv her...' type='password' />}</form.AppField>

            <form.AppForm>
              <form.SubmitButton className='w-full' size='lg'>
                Logg inn
              </form.SubmitButton>
            </form.AppForm>
          </form>

          <div className='flex items-center justify-center space-x-12 mt-6'>
            <Link className={buttonVariants({ variant: 'link' })} to={URLS.forgotPassword}>
              Glemt passord?
            </Link>

            <Link className={buttonVariants({ variant: 'link' })} to={URLS.signup}>
              Opprett bruker
            </Link>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
