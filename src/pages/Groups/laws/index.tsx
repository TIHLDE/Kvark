import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGroup, useGroupLaws } from 'hooks/Group';
import { useUser } from 'hooks/User';

import { List, styled } from '@mui/material';

import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import Expand from 'components/layout/Expand';
import Pagination from 'components/layout/Pagination';
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
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useGroupLaws(slug || '-');
  const laws = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const isAdmin = (Boolean(user) && group?.fines_admin?.user_id === user?.user_id) || group?.permissions.write;

  if (isLoading || !slug || !group) {
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
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
        <List>
          {laws.map((law) => (
            <LawItem groupSlug={group.slug} isAdmin={isAdmin} key={law.id} law={law} />
          ))}
        </List>
      </Pagination>
    </>
  );
};

export default GroupLaws;
