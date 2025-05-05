import NotFoundIcon from '~/assets/icons/empty.svg';
import { cn } from '~/lib/utils';

export type NotFoundIndicatorProps = {
  header: string;
  subtitle?: string;
  className?: string;
};

const NotFoundIndicator = ({ header, subtitle, className }: NotFoundIndicatorProps) => {
  return (
    <div className={cn('space-y-2 max-w-xs md:max-w-lg w-full mx-auto', className)}>
      <div>
        <img alt={header} height={100} loading='lazy' src={NotFoundIcon} />
        <h1 className='text-center text-xl'>{header}</h1>
        {subtitle && <p className='text-center'>{subtitle}</p>}
      </div>
    </div>
  );
};

export default NotFoundIndicator;
