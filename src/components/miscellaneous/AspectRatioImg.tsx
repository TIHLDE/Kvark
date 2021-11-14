import { useEffect, useState } from 'react';

// Material UI Components
import { makeStyles } from 'makeStyles';
import { Skeleton } from '@mui/material';

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
};

const AspectRatioImg = ({ alt, className, imgClassName, ratio = 21 / 9, src }: AspectRatioImgProps) => {
  const { classes, cx } = useStyles({ ratio });
  const [imgUrl, setImgUrl] = useState(src || TIHLDELOGO);
  useEffect(() => {
    setImgUrl(src || TIHLDELOGO);
  }, [src]);
  return (
    <div className={cx(classes.imgContainer, className)}>
      <img alt={alt} className={cx(classes.img, classes.jpg, imgClassName)} loading='lazy' onError={() => setImgUrl(TIHLDELOGO)} src={imgUrl} />
    </div>
  );
};
export default AspectRatioImg;

export const AspectRatioLoading = ({ className, imgClassName, ratio = 21 / 9 }: Pick<AspectRatioImgProps, 'className' | 'imgClassName' | 'ratio'>) => {
  const { classes, cx } = useStyles({ ratio });
  return (
    <div className={cx(classes.imgContainer, className)}>
      <Skeleton className={cx(classes.img, imgClassName)} variant='rectangular' />
    </div>
  );
};
