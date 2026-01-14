import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { photonAuthClient } from '../../api/photon';

export const Route = createFileRoute('/_MainLayout/tilbakestill-passord')({
  component: ResetPassword,
  validateSearch: z.object({
    token: z.string().optional(),
  }),
});

const formSchema = z
  .object({
    password: z.string().min(8, 'Passordet må være minst 8 tegn'),
    confirmPassword: z.string().min(1, 'Feltet er påkrevd'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passordene må være like',
    path: ['confirmPassword'],
  });

function ResetPassword() {
  const { event } = useAnalytics();
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast.error('Ugyldig tilbakestillingslenke');
      return;
    }

    setIsLoading(true);
    const response = await photonAuthClient.resetPassword({ token, newPassword: values.password });
    setIsLoading(false);

    if (response.error) {
      toast.error(response.error.message || 'Kunne ikke tilbakestille passord');
      return;
    }

    toast.success('Passordet ditt har blitt tilbakestilt!');
    event('reset-password', 'auth', 'Password reset');
    navigate({ to: URLS.login });
  };

  if (!token) {
    return (
      <Page>
        <Card className='max-w-lg w-full mx-auto'>
          <CardHeader>
            <CardTitle>Ugyldig lenke</CardTitle>
            <CardDescription>Tilbakestillingslenken er ugyldig eller har utløpt.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link className={buttonVariants({ variant: 'default' })} to={URLS.forgotPassword}>
              Be om ny tilbakestillingslenke
            </Link>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Tilbakestill passord</CardTitle>
          <CardDescription>Skriv inn ditt nye passord.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nytt passord <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bekreft passord <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' disabled={isLoading} size='lg' type='submit'>
                {isLoading ? 'Tilbakestiller passord...' : 'Tilbakestill passord'}
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
