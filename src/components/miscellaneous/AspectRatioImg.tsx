import { useEffect, useState } from 'react';
import { Skeleton, styled, BoxProps } from '@mui/material';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

export type AspectRatioImgProps = {
  alt: string;
  borderRadius?: boolean;
  className?: string;
  ratio?: number;
  src?: string;
  sx?: BoxProps['sx'];
};

const Img = styled('img', { shouldForwardProp: (prop) => prop !== 'borderRadius' && prop !== 'ratio' })<Pick<AspectRatioImgProps, 'borderRadius' | 'ratio'>>(
  ({ theme, borderRadius, ratio }) => ({
    ...(borderRadius && { borderRadius: `${theme.shape.borderRadius}px` }),
    aspectRatio: ratio ? String(ratio) : '21 / 9',
    objectFit: 'cover',
    width: '100%',
    '&:not([src*=".jpg"])': {
      background: theme.palette.common.white,
    },
  }),
);

const AspectRatioImg = ({ alt, borderRadius, className, ratio = 21 / 9, src, sx }: AspectRatioImgProps) => {
  const [imgUrl, setImgUrl] = useState(src || TIHLDELOGO);
  useEffect(() => {
    setImgUrl(src || TIHLDELOGO);
  }, [src]);
  return (
    <Img alt={alt} borderRadius={borderRadius} className={className} loading='lazy' onError={() => setImgUrl(TIHLDELOGO)} ratio={ratio} src={imgUrl} sx={sx} />
  );
};

export default AspectRatioImg;

export const AspectRatioLoading = ({
  borderRadius,
  className,
  ratio = 21 / 9,
  sx,
}: Pick<AspectRatioImgProps, 'borderRadius' | 'className' | 'ratio' | 'sx'>) => (
  <Skeleton
    className={className}
    sx={{ height: 'auto', borderRadius: borderRadius ? (theme) => `${theme.shape.borderRadius}px` : undefined, aspectRatio: String(ratio), ...sx }}
    variant='rectangular'
  />
);
