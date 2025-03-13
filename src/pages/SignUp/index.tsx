import { zodResolver } from '@hookform/resolvers/zod';
import Page from '~/components/navigation/Page';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useConfetti } from '~/hooks/Confetti';
import { useStudyGroups, useStudyyearGroups } from '~/hooks/Group';
import { useRedirectUrl } from '~/hooks/Misc';
import { useCreateUser } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import type { UserCreate } from '~/types';
import URLS from '~/URLS';
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
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

const SignUp = () => {
  const { run } = useConfetti();
  const { event } = useAnalytics();
  const { data: studies } = useStudyGroups();
  const { data: studyyears } = useStudyyearGroups();
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const [redirectURL, setLogInRedirectURL] = useRedirectUrl();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: '',
      email: '',
      first_name: '',
      last_name: '',
      study: '',
      user_id: '',
      password: '',
      password_verify: '',
    },
  });

  const onSignUp = async (values: z.infer<typeof formSchema>) => {
    const userData: UserCreate = {
      user_id: values.user_id.toLowerCase(),
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      class: values.class,
      study: values.study,
    };

    createUser.mutate(userData, {
      onSuccess: () => {
        run();
        event('signup', 'auth', `Signed up`);
        setLogInRedirectURL(undefined);
        navigate(redirectURL || URLS.login);
      },
      onError: (e) => {
        Object.keys(e.detail).forEach((key: string) => {
          if (key in userData) {
            const errorKey = key as keyof UserCreate;
            const errorMessage = (e.detail as unknown as Record<string, string | undefined>)[key];
            form.setError(errorKey, { message: errorMessage });
          }
        });
        toast.error('Det er en eller flere feil i skjemaet');
      },
    });
  };

  return (
    <Page>
      <Card className='max-w-3xl w-full mx-auto'>
        <CardHeader>
          <CardTitle>Opprett bruker</CardTitle>
          <CardDescription>Opprett en bruker for å få tilgang til TIHLDE sine tjenester</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSignUp)}>
              <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
                <FormField
                  control={form.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>
                        Fornavn <span className='text-red-300'>*</span>
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
                  name='last_name'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>
                        Etternavn <span className='text-red-300'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Skriv her...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
                <FormField
                  control={form.control}
                  name='user_id'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>
                        Feide brukernavn <span className='text-red-300'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Skriv her...' {...field} />
                      </FormControl>
                      <FormDescription className='text-xs'>Ditt brukernavn på NTNU</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>
                        Epost <span className='text-red-300'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Skriv her...' type='email' {...field} />
                      </FormControl>
                      <FormDescription className='text-xs'>Benytt en epost du sjekker regelmessig</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
                <FormField
                  control={form.control}
                  name='study'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>
                        Studie <span className='text-red-300'>*</span>
                      </FormLabel>
                      <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Velg studie' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studies?.map((study, index) => (
                            <SelectItem key={index} value={study.slug}>
                              {study.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='class'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>
                        Kull <span className='text-red-300'>*</span>
                      </FormLabel>
                      <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Velg kull' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studyyears?.map((year, index) => (
                            <SelectItem key={index} value={year.slug}>
                              {year.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className='text-xs'>
                        Hvilket år begynte du på studiet ditt? Om du går DigTrans, trekk fra 3 år i tillegg.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-6 md:space-y-0 md:flex md:space-x-4'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='w-full'>
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

                <FormField
                  control={form.control}
                  name='password_verify'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>
                        Gjenta passord <span className='text-red-300'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Skriv her...' type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              <Button className='w-full' disabled={createUser.isLoading} size='lg' type='submit'>
                {createUser.isLoading ? 'Oppretter bruker...' : 'Opprett bruker'}
              </Button>
            </form>
          </Form>

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
