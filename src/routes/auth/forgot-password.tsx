import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useForgotPassword } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { photonAuthClient } from '../../api/photon';

export const Route = createFileRoute('/_MainLayout/glemt-passord')({
  component: ForgotPassword,
});

const formSchema = z.object({
  email: z.email('Ugyldig e-post').min(1, {
    error: 'Feltet er påkrevd',
  }),
});

function ForgotPassword() {
  const { event } = useAnalytics();
  const forgotPassword = useForgotPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await photonAuthClient.requestPasswordReset({ email: values.email, redirectTo: window.location.origin + URLS.resetPassword });

    if (response.error) {
      form.setError('email', { message: response.error.message });
      return;
    }

    toast.success('E-post med instruksjoner for tilbakestilling av passord er sendt hvis adressen er registrert.');
    event('forgot-password', 'auth', 'Forgot password');
  };

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Glemt passord?</CardTitle>
          <CardDescription>Skriv inn din e-postadresse for å motta en e-post med et nytt passord.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Epost <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' disabled={forgotPassword.isPending} size='lg' type='submit'>
                {forgotPassword.isPending ? 'Henter nytt passord...' : 'Få nytt passord'}
              </Button>
            </form>
          </Form>

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
}
