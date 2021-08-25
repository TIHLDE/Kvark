import { useMemo } from 'react';
import { useGoogleAnalytics, useShare } from 'api/hooks/Utils';

// Material UI Components
import Button, { ButtonProps } from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';

export type ShareProps = ButtonProps & {
  title: string;
  shareType: 'event' | 'news' | 'jobpost' | 'pages';
  shareId: number | string;
};

const ShareButton = ({ shareId, title, shareType, ...props }: ShareProps) => {
  const { event } = useGoogleAnalytics();
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
  const shareUrl = useMemo(() => `https://s.tihlde.org/${urlType}/${shareId}${shareType === 'pages' ? '' : '/'}`, [shareId, shareType]);

  const { share, hasShared } = useShare(
    {
      title: `${title}`,
      url: shareUrl,
    },
    'Linken ble kopiert til utklippstavlen',
    () => event(`share-${shareType}`, 'share', shareUrl),
  );

  return (
    <Button disabled={hasShared} endIcon={<ShareIcon />} onClick={share} variant='outlined' {...props}>
      {hasShared ? 'Delt!' : 'Del'}
    </Button>
  );
};

export default ShareButton;
