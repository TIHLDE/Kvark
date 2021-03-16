// Material UI Components
import Button from '@material-ui/core/Button';

import useShare from 'use-share';

export type ShareProps = {
  title?: string;
  type: 'event' | 'news' | 'jobpost' | 'pages';
  id: number | string;
};

const ShareButton = ({ type, id, title }: ShareProps) => {
  let typeToURL = '';

  switch (type) {
    case 'event':
      typeToURL = 'a';
      break;
    case 'news':
      typeToURL = 'n';
      break;
    case 'jobpost':
      typeToURL = 'k';
      break;
    case 'pages':
      typeToURL = 'om';
      break;
  }
  const { share, hasShared } = useShare({
    title: `${title}`,
    url: `https://s.tihlde.org/${typeToURL}/${id}/`,
  });
  return (
    <Button disabled={hasShared} onClick={share}>
      {hasShared ? 'Delt!' : 'Del'}
    </Button>
  );
};

export default ShareButton;
