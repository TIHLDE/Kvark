import { Share2Icon } from 'lucide-react';
import { useMemo } from 'react';
import URLS from 'URLS';

import { useAnalytics, useShare } from 'hooks/Utils';

import { Button } from 'components/ui/button';

export type ShareProps = {
  title: string;
  shareType: 'event' | 'news' | 'jobpost' | 'pages' | 'form';
  shareId: number | string;
};

const ShareButton = ({ shareId, title, shareType }: ShareProps) => {
  const { event } = useAnalytics();
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
    <Button className='w-full flex items-center space-x-2' disabled={hasShared} onClick={share} size='lg' variant='outline'>
      <Share2Icon className='w-4 h-4 md:w-5 md:h-5 stroke-[1.5px]' />
      <h1 className='text-sm md:text-md'>{hasShared ? 'Delt!' : 'Del'}</h1>
    </Button>
  );
};

export default ShareButton;
