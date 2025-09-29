import { zodResolver } from '@hookform/resolvers/zod';
import { authClientWithRedirect } from '~/api/auth';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateShortLink, useDeleteShortLink, useShortLinks } from '~/hooks/ShortLink';
import { useAnalytics, useShare } from '~/hooks/Utils';
import type { ShortLink } from '~/types';
import { Copy, Network, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Route } from './+types';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await authClientWithRedirect(request);
}

type ShortLinkItemProps = {
  shortLink: ShortLink;
};

const ShortLinkItem = ({ shortLink }: ShortLinkItemProps) => {
  const deleteShortLink = useDeleteShortLink();
  const { event } = useAnalytics();
  const clip = () => {
    navigator.clipboard.writeText(`https://s.tihlde.org/${shortLink.name}`);
    toast.success('Lenken ble kopiert til utklippstavlen');
  };
  const { share } = useShare(
    {
      title: shortLink.name,
      url: `https://s.tihlde.org/${shortLink.name}`,
    },
    'Linken ble kopiert til utklippstavlen',
    () => event(`share-shortlink`, 'share', `https://s.tihlde.org/${shortLink.name}`),
  );

  const handleDelete = () => {
    deleteShortLink.mutate(shortLink.name, {
      onSuccess: () => {
        toast.success('Lenken ble slettet');
      },
      onError: (e) => {
        toast.error(e.detail || 'Kunne ikke slette lenken');
      },
    });
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>{shortLink.name}</CardTitle>
        <div>
          <Button onClick={clip} size='icon' variant='ghost'>
            <Copy />
          </Button>
          <Button onClick={share} size='icon' variant='ghost'>
            <Network />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <Label className='text-muted-foreground'>Link:</Label>
          <h1>{`https://s.tihlde.org/${shortLink.name}`}</h1>
        </div>
        <div>
          <Label className='text-muted-foreground'>Leder til:</Label>
          <h1>{shortLink.url}</h1>
        </div>

        <ResponsiveAlertDialog
          action={handleDelete}
          description='Linken vil ikke lenger være tilgjenglig for deg selv og andre.'
          title='Er du sikker?'
          trigger={
            <Button className='w-full' variant='destructive'>
              <Trash className='w-5 h-5 stroke-[1.5px] mr-2' />
              Slett link
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

const formSchema = z.object({
  name: z.string().min(1, {
    error: 'Navn må fylles ut',
  }),
  url: z
    .url({
      error: 'Ugyldig URL',
    })
    .min(1, {
      error: 'URL må fylles ut',
    }),
});

const ShortLinks = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data, error } = useShortLinks();
  const createShortLink = useCreateShortLink();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createShortLink.mutate(values, {
      onSuccess: () => {
        toast.success('Lenken ble opprettet');
        form.reset();
        setIsOpen(false);
      },
      onError: (e) => {
        toast.error(e.detail || 'Kunne ikke opprette linken');
      },
    });
  };

  const CreateButton = (
    <Button>
      <Plus className='w-5 h-5 stroke-[1.5px] mr-2' />
      Opprett ny link
    </Button>
  );

  return (
    <Page className='space-y-12'>
      <div className='space-y-4 md:space-y-0 w-full md:flex md:justify-between md:items-center'>
        <div className='space-y-2'>
          <h1 className='text-3xl md:text-5xl font-bold'>Link-forkorter</h1>
          <p className='text-muted-foreground'>Opprett og administrer korte lenker</p>
        </div>

        <ResponsiveDialog
          className='max-w-lg'
          description='Opprett en ny kort lenke'
          onOpenChange={setIsOpen}
          open={isOpen}
          title='Ny lenke'
          trigger={CreateButton}>
          <Form {...form}>
            <form className='space-y-6 px-2' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Navn <span className='text-red-300'>*</span>
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
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URL <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormDescription>URL til lenken du vil forkorte</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' disabled={createShortLink.isPending} type='submit'>
                {createShortLink.isPending ? 'Oppretter...' : 'Opprett'}
              </Button>
            </form>
          </Form>
        </ResponsiveDialog>
      </div>

      <div className='w-full'>
        {error && <h1 className='text-center'>{error.detail}</h1>}
        {data !== undefined && (
          <>
            {!data.length && <NotFoundIndicator header='Fant ingen QR koder' />}
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {data.map((link, index) => (
                <ShortLinkItem key={index} shortLink={link} />
              ))}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default ShortLinks;
