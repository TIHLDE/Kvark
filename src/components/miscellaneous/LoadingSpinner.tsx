import { LoaderCircleIcon } from 'lucide-react';

const LoadingSpinnner = ({ text }: { text?: string }) => {
  return (
    <div className='flex justify-center items-center'>
      <div className='flex gap-2'>
        <LoaderCircleIcon className='animate-spin size-6 ' />
        {text && <span>{text}</span>}
      </div>
    </div>
  );
};

export default LoadingSpinnner;
