import { useEffect, useState } from 'react';
import classNames from 'classnames';

// Material UI Components
import { makeStyles } from '@mui/styles';
import { Theme, Skeleton, Box, BoxProps } from '@mui/material';

// Icons
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles<Theme, Pick<AspectRatioImgProps, 'ratio'>>((theme) => ({
  imgContainer: {
    position: 'relative',
    '&::before': {
      height: 0,
      content: '""',
      display: 'block',
      paddingBottom: (props) => `calc(100% / ( ${props.ratio} ))`,
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
  sx?: BoxProps['sx'];
};

const AspectRatioImg = ({ alt, className, imgClassName, ratio = 21 / 9, src, sx }: AspectRatioImgProps) => {
  const classes = useStyles({ ratio });
  const [imgUrl, setImgUrl] = useState(src || TIHLDELOGO);
  useEffect(() => {
    setImgUrl(src || TIHLDELOGO);
  }, [src]);
  return (
    <Box className={classNames(classes.imgContainer, className)} sx={sx}>
      <img alt={alt} className={classNames(classes.img, classes.jpg, imgClassName)} onError={() => setImgUrl(TIHLDELOGO)} src={imgUrl} />
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
  const classes = useStyles({ ratio });
  return (
    <Box className={classNames(classes.imgContainer, className)} sx={sx}>
      <Skeleton className={classNames(classes.img, imgClassName)} variant='rectangular' />
    </Box>
  );
};
