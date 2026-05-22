import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { encodeQRCodePayload, QR_CODE_SHARE_PARAM, type LocalQRCode, type QRCodeSharePayload } from '~/hooks/QRCode';
import { Clipboard, Download, Share2, Trash } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';
import { toast } from 'sonner';

export type QRCodeItemProps = {
  qrCode: LocalQRCode | QRCodeSharePayload;
  onDelete?: () => void;
  preview?: boolean;
};

const QRCodeItem = ({ qrCode, onDelete, preview = false }: QRCodeItemProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const download = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');

      link.download = `${qrCode.name}.png`;
      link.href = image;
      link.click();
      return;
    }

    toast.error('Kunne ikke laste ned QR-koden');
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set(
      QR_CODE_SHARE_PARAM,
      encodeQRCodePayload({
        type: qrCode.type,
        name: qrCode.name,
        content: qrCode.content,
      }),
    );

    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success('Delingslenke kopiert');
    } catch {
      toast.error('Kunne ikke kopiere delingslenken');
    }
  };

  const copyImage = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      toast.error('Kunne ikke kopiere QR-koden');
      return;
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Kunne ikke kopiere QR-koden');
        return;
      }

      try {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        toast.success('QR-kode kopiert som bilde');
      } catch {
        toast.error('Kunne ikke kopiere QR-koden som bilde');
      }
    }, 'image/png');
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between gap-3'>
          <CardTitle>{preview ? `Delt QR-kode: ${qrCode.name}` : qrCode.name}</CardTitle>
          <Badge variant={qrCode.type === 'url' ? 'default' : 'secondary'}>{qrCode.type === 'url' ? 'URL' : 'Tekst'}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-center'>
          <QRCodeCanvas className='h-auto! w-full! max-w-64' ref={canvasRef} size={256} value={qrCode.content} />
        </div>

        <div className='rounded-md bg-muted p-3 text-sm'>
          <p className='mb-1 font-medium text-muted-foreground'>Innhold</p>
          <p className='break-all'>{qrCode.content}</p>
        </div>

        <div className='space-y-2'>
          <Button className='w-full' onClick={download}>
            <Download className='w-5 h-5 stroke-[1.5px] mr-2' />
            Last ned
          </Button>
          <div className='grid grid-cols-2 gap-2'>
            <Button className='w-full' onClick={share} variant='secondary'>
              <Share2 className='w-5 h-5 stroke-[1.5px] mr-2' />
              Kopier delingslenke
            </Button>
            <Button className='w-full' onClick={copyImage} variant='secondary'>
              <Clipboard className='w-5 h-5 stroke-[1.5px] mr-2' />
              Kopier bilde
            </Button>
          </div>
          {onDelete && (
            <ResponsiveAlertDialog
              action={onDelete}
              description='Denne QR koden vil bli slettet permanent.'
              title='Er du sikker?'
              trigger={
                <Button className='w-full' variant='destructive'>
                  <Trash className='w-5 h-5 stroke-[1.5px] mr-2' />
                  Slett QR kode
                </Button>
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeItem;
