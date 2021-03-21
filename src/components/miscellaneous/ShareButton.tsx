// Material UI Components
import IconButton, { ButtonProps } from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';

import useShare from 'use-share';
import { useMemo } from 'react';

export type ShareProps = ButtonProps & {
  title: string;
  shareType: 'event' | 'news' | 'jobpost' | 'pages';
  id: number | string;
};

const ShareButton = ({ id, title, shareType, ...props }: ShareProps) => {
  const urlType = useMemo(() => {
    switch (shareType) {
      case 'event':
        return 'a';
      case 'news':
        return 'n';
      case 'jobpost':
        return 'k';
      case 'pages':
        return 'om';
    }
  }, [shareType]);

  const { share, hasShared } = useShare({
    title: `${title}`,
    url: `https://s.tihlde.org/${urlType}/${id}/`,
  });
  return (
    <IconButton color='primary' disabled={hasShared} onClick={share} variant='outlined' {...props}>
      {hasShared ? 'Delt!' : <ShareIcon />}
    </IconButton>
  );
};

export default ShareButton;
