import { Divider } from '@mui/material';

// Project components
import MembersCard from 'pages/Groups/components/MembersCard';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import { Group } from 'types';
import MembersHistoryCard from 'pages/Groups/components/MembersHistoryCard';

export type GroupInfoProps = {
  group: Group;
};

const GroupInfo = ({ group }: GroupInfoProps) => (
  <>
    {(group.description || group.contact_email) && (
      <>
        <MarkdownRenderer value={`${group.description}${group.contact_email ? ` \nKontakt: ${group.contact_email}` : ''}`} />
        <Divider sx={{ my: 2 }} />
      </>
    )}
    <MembersCard showAdmin slug={group.slug} />
    <Divider sx={{ mb: 2, mt: 1 }} />
    <MembersHistoryCard slug={group.slug} />
  </>
);

export default GroupInfo;
