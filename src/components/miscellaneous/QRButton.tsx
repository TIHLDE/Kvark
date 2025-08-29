import AppleAppStoreBadge from '~/assets/img/apple-appstore-badge.svg';
import GooglePlayBadge from '~/assets/img/google-play-badge.svg';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { cn } from '~/lib/utils';
import { MOBILE_APP } from '~/URLS';
import { QrCodeIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

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
      <p className='text-center md:hidden'>Medlemsbeviset er også tilgjengelig i TIHLDE-appen</p>
      <div className='grid grid-cols-2 place-items-center gap-4 px-4 my-4 md:hidden'>
        <a href={MOBILE_APP.iOS} target='_blank' rel='noopener noreferrer'>
          <img src={AppleAppStoreBadge} alt='Last ned iPhone-appen' className='inline-block w-auto h-14' />
        </a>{' '}
        <a href={MOBILE_APP.Android} target='_blank' rel='noopener noreferrer'>
          <img src={GooglePlayBadge} alt='Last ned Android-appen' className='inline-block w-auto h-14' />
        </a>
      </div>
      <QRCodeCanvas className='block !h-auto !w-full max-h-[70vh] mx-auto object-contain' size={1000} value={qrValue} />
      {subtitle && <h1 className='text-center my-1 text-xl'>{subtitle}</h1>}
    </ResponsiveDialog>
  );
};

export default QRButton;
