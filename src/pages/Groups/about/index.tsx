import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useGroup } from 'hooks/Group';

import MembersCard from 'pages/Groups/about/MembersCard';
import MembersHistoryCard from 'pages/Groups/about/MembersHistoryCard';

import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';

const GroupInfo = () => {
  const { slug } = useParams<'slug'>();
  const { data: group, isLoading } = useGroup(slug || '-');
  if (isLoading || !group) {
    return null;
  }
  return (
    <>
      {(group.description || group.contact_email) && (
        <>
          <MarkdownRenderer value={`${group.description}${group.contact_email ? ` \n\n Kontakt: ${group.contact_email}` : ''}`} />
          <Divider sx={{ my: 2 }} />
        </>
      )}
      <MembersCard showAdmin slug={group.slug} />
      <MembersHistoryCard slug={group.slug} />
    </>
  );
};

export default GroupInfo;
