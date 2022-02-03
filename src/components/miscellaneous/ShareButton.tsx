import { useMemo } from 'react';
import URLS from 'URLS';
import { useGoogleAnalytics, useShare } from 'hooks/Utils';
import { Button, ButtonProps } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

export type ShareProps = ButtonProps & {
  title: string;
  shareType: 'event' | 'news' | 'jobpost' | 'pages' | 'form';
  shareId: number | string;
};

const ShareButton = ({ shareId, title, shareType, ...props }: ShareProps) => {
  const { event } = useGoogleAnalytics();
  const [urlFromType, useShortener] = useMemo(() => {
    switch (shareType) {
      case 'event':
        return ['a', true];
      case 'news':
        return ['n', true];
      case 'jobpost':
        return ['k', true];
      case 'pages':
        return ['om', true];
      case 'form':
        return [URLS.form, false];
    }
  }, [shareType]);
  const shareUrl = useMemo(
    () => (useShortener ? `https://s.tihlde.org/${urlFromType}/${shareId}${shareType === 'pages' ? '' : '/'}` : `${location.origin}${urlFromType}${shareId}/`),
    [shareId, shareType, urlFromType, useShortener],
  );

  const { share, hasShared } = useShare({ title: title, url: shareUrl }, 'Linken ble kopiert til utklippstavlen', () =>
    event(`share-${shareType}`, 'share', shareUrl),
  );

  return (
    <Button disabled={hasShared} endIcon={<ShareIcon />} onClick={share} variant='outlined' {...props}>
      {hasShared ? 'Delt!' : 'Del'}
    </Button>
  );
};

export default ShareButton;
