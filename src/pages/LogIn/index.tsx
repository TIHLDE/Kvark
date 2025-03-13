import { zodResolver } from '@hookform/resolvers/zod';
import API from '~/api/api';
import { setCookie } from '~/api/cookie';
import Page from '~/components/navigation/Page';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { ACCESS_TOKEN } from '~/constant';
import { analyticsEvent } from '~/hooks/Utils';
import URLS from '~/URLS';
import { useForm } from 'react-hook-form';
import { data, href, Link, redirect, useSubmit } from 'react-router';
import { z } from 'zod';

import { queryClient } from '../MainLayout';
import { Route } from './+types';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Brukernavn er påkrevd' }),
  password: z.string().min(1, { message: 'Passorde er påkrevd' }),
});

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');

  const { data: safeData, success, error } = formSchema.safeParse({ username, password });

  if (!success) {
    return data({ errors: error }, { status: 400 });
  }

  const redirectUrl = new URL(request.url).searchParams.get('redirectTo') ?? href('/');

  try {
    const { token } = await API.authenticate(safeData.username, safeData.password);
    analyticsEvent('login', 'auth', 'Logged inn');
    setCookie(ACCESS_TOKEN, token);
    queryClient.invalidateQueries('user');
    queryClient.refetchQueries('user');
    return redirect(redirectUrl);
  } catch {
    return data({ errors: {} });
  }
}

export default function LoginPage() {
  // const { event } = useAnalytics();
  const submit = useSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onLogin = async (values: z.infer<typeof formSchema>) => {
    await submit(values, { method: 'POST' });
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
