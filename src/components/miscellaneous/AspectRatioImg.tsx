import { useEffect, useState } from 'react';
import { makeStyles } from 'makeStyles';
import { Skeleton, Box, SkeletonProps, styled } from '@mui/material';

// Icons
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles<Pick<AspectRatioImgProps, 'ratio'>>()((theme, { ratio }) => ({
  imgContainer: {
    position: 'relative',
    '&::before': {
      height: 0,
      content: '""',
      display: 'block',
      paddingBottom: `calc(100% / ( ${ratio} ))`,
    },
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  jpg: {
    '&:not([src*=".jpg"])': {
      background: theme.palette.common.white,
    },
  },
}));

export type AspectRatioImgProps = {
  alt: string;
  className?: string;
  imgClassName?: string;
  ratio?: number;
  src?: string;
  sx?: SkeletonProps['sx'];
};

const Img = styled('img')({});

const AspectRatioImg = ({ alt, className, imgClassName, ratio = 21 / 9, src, sx }: AspectRatioImgProps) => {
  const { classes, cx } = useStyles({ ratio });
  const [imgUrl, setImgUrl] = useState(src || TIHLDELOGO);
  useEffect(() => {
    setImgUrl(src || TIHLDELOGO);
  }, [src]);
  return (
    <Box className={cx(classes.imgContainer, className)}>
      <Img alt={alt} className={cx(classes.img, classes.jpg, imgClassName)} loading='lazy' onError={() => setImgUrl(TIHLDELOGO)} src={imgUrl} sx={sx} />
    </Box>
  );
};
export default AspectRatioImg;

export const AspectRatioLoading = ({
  className,
  imgClassName,
  ratio = 21 / 9,
  sx,
}: Pick<AspectRatioImgProps, 'className' | 'imgClassName' | 'ratio' | 'sx'>) => {
  const { classes, cx } = useStyles({ ratio });
  return (
    <Box className={cx(classes.imgContainer, className)}>
      <Skeleton className={cx(classes.img, imgClassName)} sx={sx} variant='rectangular' />
    </Box>
  );
};
