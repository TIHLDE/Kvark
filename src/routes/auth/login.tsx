import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { loginUser } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { analyticsEvent } from '~/hooks/Utils';
import { RequestResponse } from '~/types';
import URLS from '~/URLS';
import { parseAsString, useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = createFileRoute('/_MainLayout/logg-inn')({
  component: LoginPage,
});

const formSchema = z.object({
  username: z.string().min(1, {
    error: 'Brukernavn er påkrevd',
  }),
  password: z.string().min(1, {
    error: 'Passorde er påkrevd',
  }),
});

function LoginPage() {
  const [redirectTo] = useQueryState('redirectTo', parseAsString.withDefault(''));
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function login({ username, password }: z.infer<typeof formSchema>) {
    const redirectUrl = redirectTo || '/';

    try {
      await loginUser(username, password);
      analyticsEvent('login', 'auth', 'Logged inn');
      navigate({ to: redirectUrl });
    } catch (e) {
      toast.error('Kunne ikke logge inn: ' + (e as RequestResponse).detail);
    }
  }

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Logg inn</CardTitle>
          <CardDescription>Logg inn med ditt TIHLDE brukernavn og passord</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(login)}>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Brukernavn <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' autoComplete='username' {...field} />
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
                      <Input placeholder='Skriv her...' type='password' autoComplete='current-password' {...field} />
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
