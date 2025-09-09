import { zodResolver } from '@hookform/resolvers/zod';
import FEIDE_ICON from '~/assets/icons/feide.svg';
import Page from '~/components/navigation/Page';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { authClient, useOptionalAuth } from '~/hooks/auth';
import URLS from '~/URLS';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSubmit } from 'react-router';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Brukernavn er påkrevd' }),
  password: z.string().min(1, { message: 'Passorde er påkrevd' }),
});

// export async function clientAction({ request }: Route.ClientActionArgs) {
//   const redirectUrl = new URL(request.url)?.searchParams?.get('redirectTo') ?? '/';
//   const result = formSchema.safeParse(await request.json());
//   if (!result.success) {
//     return {
//       success: false,
//       errors: result.error.flatten().fieldErrors,
//     } as const;
//   }

//   const { username, password } = result.data;

//   authClient.signIn.oauth2({});
//   // try {
//   //   await loginUser(username, password);

//   //   analyticsEvent('login', 'auth', 'Logged inn');
//   //   return redirect(redirectUrl);
//   // } catch (e) {
//   //   return {
//   //     success: false,
//   //     errors: {
//   //       username: (e as RequestResponse).detail ?? 'Noe gikk galt',
//   //     },
//   //   } as const;
//   // }
// }

export default function LoginPage() {
  const submit = useSubmit();
  const [redirectUrl] = useQueryState('redirectTo', parseAsString.withDefault(''));

  const session = authClient.useSession();
  const legacySession = useOptionalAuth();

  const [enableLegacyLogin, setEnableLegacyLogin] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function loginWithFeide() {
    const { data, error } = await authClient.signIn.oauth2({
      providerId: 'feide',
      callbackURL: new URL(redirectUrl, window.location.origin).toString(),
    });
    // TODO: This under here is actually correct, just not working with the current feide setup
    /*
    if (error) {
      console.error('Error logging in with Feide', error);
      return;
    }
    if (!data) {
      console.error('No data returned from Feide');
      return;
    }
    const feideUrl = new URL(data.url);
    const photonRedirectUrl = new URL('/api/auth/oauth2/callback/feide', env.PHOTON_API_URL);

    feideUrl.searchParams.set('redirect_uri', photonRedirectUrl.toString());
    window.location.assign(feideUrl.toString());
    */
  }

  return (
    <Page>
      <Card className='max-w-lg w-full mx-auto'>
        <CardHeader>
          <CardTitle>Logg inn</CardTitle>
          <CardDescription>Logg inn med ditt TIHLDE brukernavn og passord</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className='w-full' onClick={loginWithFeide} size='lg'>
            <img alt='Feide ikon' className='mr-2 w-5 h-5' src={FEIDE_ICON} />
            Logg inn med Feide
          </Button>
          <Label className='flex items-center gap-2 my-4'>
            <Checkbox checked={enableLegacyLogin} onCheckedChange={(v) => setEnableLegacyLogin(Boolean(v))} />
            Bruk gammel innlogging
          </Label>

          <pre>{JSON.stringify(session, null, 2)}</pre>

          {enableLegacyLogin && (
            <>
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
            </>
          )}
        </CardContent>
      </Card>
    </Page>
  );
}
