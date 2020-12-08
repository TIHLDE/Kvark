import React, { useState } from 'react';
import classNames from 'classnames';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';

// Icons
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles<Theme, Pick<AspectRatioImgProps, 'ratio'>>(() => ({
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
    '&:not([src*=".jpg"])': {
      background: '#fff',
    },
  },
  imgContain: {
    objectFit: 'contain',
  },
}));

type AspectRatioImgProps = {
  alt: string;
  className?: string;
  imgClassName?: string;
  imgContain?: boolean;
  ratio?: number;
  src?: string;
};

function AspectRatioImg({ alt, className, imgClassName, imgContain = false, ratio = 21 / 9, src }: AspectRatioImgProps) {
  const classes = useStyles({ ratio });
  const [imgUrl, setImgUrl] = useState(src || TIHLDELOGO);
  return (
    <div className={classNames(classes.imgContainer, className)}>
      <img alt={alt} className={classNames(classes.img, imgClassName, imgContain && classes.imgContain)} onError={() => setImgUrl(TIHLDELOGO)} src={imgUrl} />
    </div>
  );
}
export default AspectRatioImg;
