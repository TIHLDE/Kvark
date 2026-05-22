import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { decodeQRCodePayload, QR_CODE_SHARE_PARAM, useLocalQRCodes, type QRCodeSharePayload } from '~/hooks/QRCode';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import QRCodeItem from './components/QRCodeItem.tsx';

const urlSchema = z.url();

const isValidUrlInput = (value: string) => {
  if (/\s/.test(value)) return false;

  const url = value.includes('://') ? value : `https://${value}`;
  if (!urlSchema.safeParse(url).success) return false;

  const { hostname } = new URL(url);
  return hostname === 'localhost' || hostname.includes('.');
};

const formSchema = z
  .object({
    name: z.string().trim().min(1, {
      error: 'Navn må fylles ut',
    }),
    type: z.enum(['text', 'url']),
    content: z.string().trim().min(1, {
      error: 'Innhold må fylles ut',
    }),
  })
  .superRefine((values, ctx) => {
    if (values.type === 'url' && !isValidUrlInput(values.content.trim())) {
      ctx.addIssue({
        code: 'custom',
        message: 'Ugyldig URL',
        path: ['content'],
      });
    }
  });

export const Route = createFileRoute('/_MainLayout/qr-koder')({
  component: QRCodes,
});

function QRCodes() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sharedQRCode, setSharedQRCode] = useState<{ qrCode: QRCodeSharePayload | null; hasError: boolean }>({ qrCode: null, hasError: false });
  const { qrCodes, createQRCode, deleteQRCode } = useLocalQRCodes();

  useEffect(() => {
    const encodedPayload = new URLSearchParams(window.location.search).get(QR_CODE_SHARE_PARAM);
    if (!encodedPayload) return;

    const qrCode = decodeQRCodePayload(encodedPayload);
    setSharedQRCode({ qrCode, hasError: qrCode === null });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'text',
      content: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createQRCode({
      name: values.name.trim(),
      content: values.content.trim(),
      type: values.type,
    });

    toast.success('QR koden ble opprettet');
    form.reset();
    setIsOpen(false);
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
            <form autoComplete='off' className='space-y-6 px-2' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Navn <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input autoComplete='off' autoCorrect='off' spellCheck={false} placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <span className='text-red-300'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Velg type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='text'>Tekst</SelectItem>
                        <SelectItem value='url'>URL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Velg URL for lenker som f.eks. youtube.com.</FormDescription>
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
                      <Input autoComplete='off' autoCorrect='off' spellCheck={false} placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormDescription>En link eller tekst som QR koden skal lede til</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' type='submit'>
                Opprett
              </Button>
            </form>
          </Form>
        </ResponsiveDialog>
      </div>

      {sharedQRCode.hasError && <p className='text-center text-sm text-destructive'>Kunne ikke lese den delte QR-koden.</p>}

      {sharedQRCode.qrCode && <QRCodeItem preview qrCode={sharedQRCode.qrCode} />}

      <div className='w-full'>
        {!qrCodes.length && <NotFoundIndicator header='Fant ingen QR koder' />}
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {qrCodes.map((qrCode) => (
            <QRCodeItem key={qrCode.id} onDelete={() => deleteQRCode(qrCode.id)} qrCode={qrCode} />
          ))}
        </div>
      </div>
    </Page>
  );
}
