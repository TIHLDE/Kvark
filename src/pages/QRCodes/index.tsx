import { authClientWithRedirect } from '~/api/auth';
import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateQRCode, useQRCodes } from '~/hooks/QRCode';
import URLS from '~/URLS';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Route } from './+types';
import QRCodeItem from './components/QRCodeItem';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Navn må fylles ut' }),
  content: z.string().min(1, { message: 'Innhold må fylles ut' }).url({ message: 'Ugyldig URL' }),
});

type FormValues = z.infer<typeof formSchema>;

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await authClientWithRedirect(request);
}

const QRCodes = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data, error } = useQRCodes();
  const createQRCode = useCreateQRCode();

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
      async onSubmitAsync({ value }) {
        await createQRCode.mutateAsync(value, {
          onSuccess: () => {
            toast.success('QR koden ble opprettet');
            navigate(URLS.qrCodes);
            setIsOpen(false);
          },
          onError: (e) => {
            toast.error('Kunne ikke opprette QR koden: ' + e.detail);
          },
        });
      },
    },
    defaultValues: { name: '', content: '' } as FormValues,
  });

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
          trigger={
            <Button>
              <Plus className='w-5 h-5 stroke-[1.5px] mr-2' />
              Opprett ny kode
            </Button>
          }>
          <form className='space-y-6 px-2' onSubmit={handleFormSubmit(form)}>
            <form.AppField name='name'>{(field) => <field.InputField label='Navn' required />}</form.AppField>

            <form.AppField name='content'>
              {(field) => <field.InputField label='Innhold' description='En link eller tekst som QR koden skal lede til' required />}
            </form.AppField>

            <form.AppForm>
              <form.SubmitButton className='w-full' disabled={createQRCode.isPending} type='submit'>
                {createQRCode.isPending ? 'Oppretter...' : 'Opprett'}
              </form.SubmitButton>
            </form.AppForm>
          </form>
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
