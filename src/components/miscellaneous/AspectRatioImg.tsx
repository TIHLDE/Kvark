import { cn } from 'lib/utils';
import { useEffect, useState } from 'react';

import TIHLDE_LOGO from 'assets/img/TihldeBackground.jpg';

export type AspectRatioImgProps = {
  alt: string;
  className?: string;
  src?: string;
  ratio?: '21/9' | '16:9' | '16:7' | '4:3' | '1:1' | '3:4' | '9:16';
};

const AspectRatioImg = ({ alt, className, src, ratio = '21/9' }: AspectRatioImgProps) => {
  const [imgUrl, setImgUrl] = useState(src || TIHLDE_LOGO);

  useEffect(() => {
    setImgUrl(src || TIHLDE_LOGO);
  }, [src]);

  const setRatio = () => {
    switch (ratio) {
      case '21/9':
        return 'aspect-[21/9]';

      case '16:9':
        return 'aspect-[16/9]';

      case '16:7':
        return 'aspect-[16/7]';

      case '4:3':
        return 'aspect-[4/3]';

      case '1:1':
        return 'aspect-[1/1]';

      case '3:4':
        return 'aspect-[3/4]';

      case '9:16':
        return 'aspect-[9/16]';

      default:
        return 'aspect-[21/9]';
    }
  };

  return (
    <img alt={alt} className={cn('object-cover w-full rounded-md', className, setRatio())} loading='lazy' onError={() => setImgUrl(TIHLDE_LOGO)} src={imgUrl} />
  );
};

export default AspectRatioImg;
