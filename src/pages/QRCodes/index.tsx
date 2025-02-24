import { zodResolver } from '@hookform/resolvers/zod';
import { authClientWithRedirect } from '~/api/auth';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateQRCode, useQRCodes } from '~/hooks/QRCode';
import URLS from '~/URLS';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Route } from './+types';
import QRCodeItem from './components/QRCodeItem';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Navn må fylles ut' }),
  content: z.string().min(1, { message: 'Innhold må fylles ut' }).url({ message: 'Ugyldig URL' }),
});

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await authClientWithRedirect(request);
}

const QRCodes = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data, error } = useQRCodes();
  const createQRCode = useCreateQRCode();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      content: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createQRCode.mutate(values, {
      onSuccess: () => {
        toast.success('QR koden ble opprettet');
        form.reset();
        navigate(URLS.qrCodes);
        setIsOpen(false);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const CreateButton = (
    <Button>
      <Plus className='w-5 h-5 stroke-[1.5px] mr-2' />
      Opprett ny kode
    </Button>
  );

  return (
    <Page className='space-y-12'>
      <div className='space-y-4 md:space-y-0 w-full md:flex md:justify-between md:items-center'>
        <div className='space-y-2'>
          <h1 className='text-3xl md:text-5xl font-bold'>QR koder</h1>
          <p className='text-muted-foreground'>Opprett og administrer QR koder</p>
        </div>

        <ResponsiveDialog
          className='max-w-lg'
          description='Opprett en ny QR kode'
          onOpenChange={setIsOpen}
          open={isOpen}
          title='Ny QR kode'
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
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Innhold <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormDescription>En link eller tekst som QR koden skal lede til</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' disabled={createQRCode.isLoading} type='submit'>
                {createQRCode.isLoading ? 'Oppretter...' : 'Opprett'}
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
              {data.map((qrCode, index) => (
                <QRCodeItem key={index} qrCode={qrCode} />
              ))}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default QRCodes;
