import { Download, Trash } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { useDeleteQRCode } from '~/hooks/QRCode';
import type { QRCode } from '~/types';

export type QRCodeItemProps = {
  qrCode: QRCode;
};

const QRCodeItem = ({ qrCode }: QRCodeItemProps) => {
  const deleteQRCode = useDeleteQRCode(qrCode.id || -1);

  const handleDelete = () => {
    deleteQRCode.mutate(null, {
      onSuccess: () => {
        toast.success('QR koden ble slettet');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const download = () => {
    const canvas = document.getElementById(qrCode.id.toString()) as HTMLCanvasElement | null;

    if (canvas) {
      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');

      link.download = `${qrCode.name}.png`;

      link.href = image;

      link.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{qrCode.name}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <QRCodeCanvas id={qrCode.id.toString()} size={256} value={qrCode.content} />
        </div>

        <div className='space-y-2'>
          <Button className='w-full' onClick={download}>
            <Download className='w-5 h-5 stroke-[1.5px] mr-2' />
            Last ned
          </Button>
          <ResponsiveAlertDialog
            action={handleDelete}
            description='Denne QR koden vil ikke lenger være tilgjenglig for deg selv og andre.'
            title='Er du sikker?'
            trigger={
              <Button className='w-full' variant='destructive'>
                <Trash className='w-5 h-5 stroke-[1.5px] mr-2' />
                Slett QR kode
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeItem;
