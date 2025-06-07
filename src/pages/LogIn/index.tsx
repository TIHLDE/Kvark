import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { analyticsEvent } from '~/hooks/Utils';
import { RequestResponse } from '~/types';
import URLS from '~/URLS';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, redirect, useSubmit } from 'react-router';
import { z } from 'zod';

import { Route } from './+types';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Brukernavn er påkrevd' }),
  password: z.string().min(1, { message: 'Passorde er påkrevd' }),
});

export async function clientAction({ request }: Route.ClientActionArgs) {
  const redirectUrl = new URL(request.url)?.searchParams?.get('redirectTo') ?? '/';
  const result = formSchema.safeParse(await request.json());
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    } as const;
  }

  const { username, password } = result.data;
  try {
    await loginUser(username, password);
    analyticsEvent('login', 'auth', 'Logged inn');
    return redirect(redirectUrl);
  } catch (e) {
    return {
      success: false,
      errors: {
        username: (e as RequestResponse).detail ?? 'Noe gikk galt',
      },
    } as const;
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (actionData?.success === false) {
      for (const [key, value] of Object.entries(actionData.errors)) {
        form.setError(key as keyof z.infer<typeof formSchema>, { message: value });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Logg inn</CardTitle>
          <CardDescription>Logg inn med ditt TIHLDE brukernavn og passord</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit((v) => submit(v, { method: 'POST', encType: 'application/json' }))}>
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
