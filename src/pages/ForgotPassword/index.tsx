import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import Page from '~/components/navigation/Page';
import { buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useForgotPassword } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Ugyldig e-post').min(1, { message: 'Feltet er påkrevd' }),
});

const ForgotPassword = () => {
  const { event } = useAnalytics();
  const forgotPassword = useForgotPassword();

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      async onSubmitAsync({ value }) {
        await forgotPassword.mutateAsync(value.email, {
          onSuccess({ detail }) {
            toast.success(detail);
            event('forgot-password', 'auth', 'Forgot password');
          },
          onError(e: unknown) {
            if (e instanceof Error) {
              return toast.error(e.message);
            }
            toast.error((e as { detail?: string }).detail ?? 'Noe gikk galt');
          },
        });
      },
    },
    defaultValues: { email: '' },
  });

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Glemt passord?</CardTitle>
          <CardDescription>Skriv inn din e-postadresse for å motta en e-post med et nytt passord.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
            <form.AppField name='email'>{(field) => <field.InputField label='Epost' placeholder='Skriv her...' required type='email' />}</form.AppField>

            <form.AppForm>
              <form.SubmitButton loading='Sender e-post...' className='w-full' size='lg' type='submit'>
                Send reset-lenke
              </form.SubmitButton>
            </form.AppForm>
          </form>

          <div className='flex items-center justify-center space-x-12 mt-6'>
            <Link className={buttonVariants({ variant: 'link' })} to={URLS.login}>
              Logg inn
            </Link>

            <Link className={buttonVariants({ variant: 'link' })} to={URLS.signup}>
              Opprett bruker
            </Link>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default ForgotPassword;
