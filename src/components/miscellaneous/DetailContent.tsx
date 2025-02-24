import { Skeleton } from '~/components/ui/skeleton';
import { ReactNode } from 'react';

export type DetailContentProps = {
  title: string | ReactNode;
  info: string | ReactNode;
};

const DetailContent = ({ title, info }: DetailContentProps) => (
  <h1>
    <b>{title}</b> {info}
  </h1>
);

export default DetailContent;

export const DetailContentLoading = () => <DetailContent info={<Skeleton className='w-full h-12' />} title={<Skeleton className='w-3/4 h-12' />} />;
