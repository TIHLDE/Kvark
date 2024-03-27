import { cn } from 'lib/utils';
import { QrCodeIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';

export type QRButtonProps = {
  children: React.ReactNode;
  qrValue: string;
  className?: string;
  subtitle?: string;
};

export const QRButton = ({ qrValue, subtitle, className, children }: QRButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn('w-full', className)} size='lg' variant='outline'>
          <QrCodeIcon className='mr-2 stroke-[1.5px]' /> {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <QRCodeCanvas className='block !h-auto !w-full max-h-[350px] mx-auto object-contain' size={1000} value={qrValue} />
        {subtitle && <h1 className='text-center my-1 text-xl'>{subtitle}</h1>}
      </DialogContent>
    </Dialog>
  );
};

export default QRButton;
