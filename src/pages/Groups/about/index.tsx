import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

import { PermissionApp } from 'types/Enums';

import { useGroup } from 'hooks/Group';
import { useHavePermission, useIsAuthenticated } from 'hooks/User';

import MembersCard from 'pages/Groups/about/MembersCard';
import MembersHistoryCard from 'pages/Groups/about/MembersHistoryCard';

import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';

import GroupStatistics from '../components/GroupStatistics';

const GroupInfo = () => {
  const { allowAccess: isAdmin } = useHavePermission([PermissionApp.GROUP]);
  const isAuthenticated = useIsAuthenticated();
  const { slug } = useParams<'slug'>();
  const { data: group, isLoading } = useGroup(slug || '-');
  if (isLoading || !group) {
    return null;
  }
  return (
    <>
      {isAdmin && <GroupStatistics slug={group.slug} />}
      {(group.description || group.contact_email) && (
        <>
          <MarkdownRenderer value={`${group.description}${group.contact_email ? ` \n\n Kontakt: ${group.contact_email}` : ''}`} />
          <Divider sx={{ my: 2 }} />
        </>
      )}
      <MembersCard groupSlug={group.slug} />
      {isAuthenticated && <MembersHistoryCard groupSlug={group.slug} />}
    </>
  );
};
export default GroupInfo;
