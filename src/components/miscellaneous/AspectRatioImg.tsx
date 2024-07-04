import { cn } from 'lib/utils';
import { useEffect, useState } from 'react';

import TIHLDE_LOGO from 'assets/img/TihldeBackground.jpg';

export type AspectRatioImgProps = {
  alt: string;
  className?: string;
  src?: string;
};

const AspectRatioImg = ({ alt, className, src }: AspectRatioImgProps) => {
  const [imgUrl, setImgUrl] = useState(src || TIHLDE_LOGO);

  useEffect(() => {
    setImgUrl(src || TIHLDE_LOGO);
  }, [src]);

  return <img alt={alt} className={cn('object-cover w-full', className)} loading='lazy' onError={() => setImgUrl(TIHLDE_LOGO)} src={imgUrl} />;
};

export default AspectRatioImg;
