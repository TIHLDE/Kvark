import { useParams } from 'react-router-dom';
import { useGroup } from 'hooks/Group';
import { Divider } from '@mui/material';

// Project components
import MembersCard from 'pages/Groups/components/MembersCard';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import MembersHistoryCard from 'pages/Groups/components/MembersHistoryCard';

const GroupInfo = () => {
  const { slug } = useParams<'slug'>();
  const { data: group, isLoading } = useGroup((slug || '-').toLowerCase());
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
      <Divider sx={{ mb: 2, mt: 1 }} />
      <MembersHistoryCard slug={group.slug} />
    </>
  );
};

export default GroupInfo;
