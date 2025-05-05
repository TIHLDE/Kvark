import { zodResolver } from '@hookform/resolvers/zod';
import Page from '~/components/navigation/Page';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useLogin } from '~/hooks/User';
import { analyticsEvent } from '~/hooks/Utils';
import URLS from '~/URLS';
import { useForm } from 'react-hook-form';
import { href, Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Route } from './+types';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Brukernavn er påkrevd' }),
  password: z.string().min(1, { message: 'Passorde er påkrevd' }),
});

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const redirectUrl = new URL(request.url).searchParams.get('redirectTo') ?? href('/');
  return {
    redirectUrl,
  };
}

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  // const { event } = useAnalytics();
  const navigate = useNavigate();

  const login = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onLogin = async (values: z.infer<typeof formSchema>) => {
    login.mutate(values, {
      onSuccess: () => {
        analyticsEvent('login', 'auth', 'Logged inn');

        navigate(loaderData.redirectUrl);
      },
      onError: (e) => {
        form.setError('username', { message: e.detail || 'Noe gikk galt' });
      },
    });
  };

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Logg inn</CardTitle>
          <CardDescription>Logg inn med ditt TIHLDE brukernavn og passord</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onLogin)}>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Brukernavn <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Passord <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' disabled={form.formState.isSubmitting} size='lg' type='submit'>
                {form.formState.isSubmitting ? 'Logger inn...' : 'Logg inn'}
              </Button>
            </form>
          </Form>

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
