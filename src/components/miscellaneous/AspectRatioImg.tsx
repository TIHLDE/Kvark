import { BoxProps, Skeleton, styled } from '@mui/material';
import { useEffect, useState } from 'react';

import TIHLDE_LOGO from 'assets/img/TihldeBackground.jpg';

export type AspectRatioImgProps = {
  alt: string;
  borderRadius?: boolean;
  className?: string;
  ratio?: number;
  src?: string;
  sx?: BoxProps['sx'];
};

const Img = styled('img', { shouldForwardProp: (prop) => prop !== 'borderRadius' && prop !== 'ratio' && prop !== 'sx' })<
  Pick<AspectRatioImgProps, 'borderRadius' | 'ratio'>
>(({ theme, borderRadius, ratio }) => ({
  ...(borderRadius && { borderRadius: `${theme.shape.borderRadius}px` }),
  aspectRatio: ratio ? String(ratio) : '21 / 9',
  objectFit: 'cover',
  width: '100%',
  '&:not([src*=".jpg"])': {},
}));

const AspectRatioImg = ({ alt, borderRadius, className, ratio = 21 / 9, src, sx }: AspectRatioImgProps) => {
  const [imgUrl, setImgUrl] = useState(src || TIHLDE_LOGO);

  useEffect(() => {
    setImgUrl(src || TIHLDE_LOGO);
  }, [src]);

  return (
    <Img alt={alt} borderRadius={borderRadius} className={className} loading='lazy' onError={() => setImgUrl(TIHLDE_LOGO)} ratio={ratio} src={imgUrl} sx={sx} />
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
