// Material UI Components
import Button, { ButtonProps } from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';

import useShare from 'use-share';
import { useMemo } from 'react';

export type ShareProps = ButtonProps & {
  title: string;
  shareType: 'event' | 'news' | 'jobpost' | 'pages';
  shareId: number | string;
};

const ShareButton = ({ shareId, title, shareType, ...props }: ShareProps) => {
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
    url: `https://s.tihlde.org/${urlType}/${shareId}/`,
  });
  return (
    <Button color='primary' disabled={hasShared} endIcon={<ShareIcon />} onClick={share} variant='outlined' {...props}>
      {hasShared ? 'Delt!' : 'Del'}
    </Button>
  );
};

export default ShareButton;
