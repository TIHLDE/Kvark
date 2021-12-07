import { useParams } from 'react-router-dom';
import { useGroup, useGroupLaws } from 'hooks/Group';
import { useUser } from 'hooks/User';

import { List, styled } from '@mui/material';

import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import Expand from 'components/layout/Expand';
import LawItem from 'pages/Groups/laws/LawItem';
import AddLawDialog from 'pages/Groups/laws/AddLawDialog';

const Expansion = styled(Expand)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const GroupLaws = () => {
  const { slug } = useParams<'slug'>();
  const { data: user } = useUser();
  const { data: group } = useGroup(slug || '-');
  const { data: laws } = useGroupLaws(slug || '-');

  const isAdmin = (Boolean(user) && group?.fines_admin?.user_id === user?.user_id) || group?.permissions.write;

  if (!laws || !slug || !group) {
    return null;
  }

  return (
    <>
      {group.fine_info && (
        <div>
          <Expansion header='Praktiske detaljer' sx={{ mb: 1 }}>
            <MarkdownRenderer value={group.fine_info} />
          </Expansion>
        </div>
      )}
      {isAdmin && <AddLawDialog groupSlug={group.slug} />}
      <List>
        {laws.map((law) => (
          <LawItem groupSlug={group.slug} isAdmin={isAdmin} key={law.id} law={law} />
        ))}
      </List>
    </>
  );
};

export default GroupLaws;
