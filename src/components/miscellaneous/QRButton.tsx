import { QrCodeIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { cn } from '~/lib/utils';

export type QRButtonProps = {
  children: React.ReactNode;
  qrValue: string;
  className?: string;
  subtitle?: string;
};

export const QRButton = ({ qrValue, subtitle, className, children }: QRButtonProps) => {
  const OpenButton = (
    <Button className={cn('w-full', className)} size='lg' variant='outline'>
      <QrCodeIcon className='mr-2 stroke-[1.5px]' /> {children}
    </Button>
  );

  return (
    <ResponsiveDialog title='QR-kode' trigger={OpenButton}>
      <QRCodeCanvas className='block !h-auto !w-full max-h-[70vh] mx-auto object-contain' size={1000} value={qrValue} />
      {subtitle && <h1 className='text-center my-1 text-xl'>{subtitle}</h1>}
    </ResponsiveDialog>
  );
};

export default QRButton;
