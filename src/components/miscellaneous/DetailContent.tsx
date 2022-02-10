import { Skeleton, Typography } from '@mui/material';
import { ReactNode } from 'react';

export type DetailContentProps = {
  title: string | ReactNode;
  info: string | ReactNode;
};

const DetailContent = ({ title, info }: DetailContentProps) => (
  <Typography variant='subtitle1'>
    <b>{title}</b> {info}
  </Typography>
);

export default DetailContent;

export const DetailContentLoading = () => <DetailContent info={<Skeleton height={30} width={140} />} title={<Skeleton height={30} width={80} />} />;
