import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Separator } from '~/components/ui/separator';
import { getGroupBySlugQuery } from '~/api/queries/groups';

import GroupStatistics from './components/GroupStatistics';
import MembersCard from './components/MembersCard';
import MembersHistoryCard from './components/MembersHistoryCard';

// TODO: Re-add auth protection — previously used authClientWithRedirect() / userHasWritePermission(PermissionApp.GROUP)

export const Route = createFileRoute('/_MainLayout/grupper/$slug/')({
  component: GroupInfo,
});

function GroupInfo() {
  const { slug } = Route.useParams();
  const { data: group } = useSuspenseQuery(getGroupBySlugQuery(slug));

  // TODO: Re-add auth check — previously checked isAdmin via userHasWritePermission(PermissionApp.GROUP)
  // The new API schema does not include permissions on the group detail response
  const isAdmin = false;

  return (
    <>
      {isAdmin && <GroupStatistics slug={group.slug} />}
      {group.description && group.contactEmail && (
        <div className='mt-2'>
          <MarkdownRenderer value={`${group.description}${group.contactEmail ? ` \n\n Kontakt: ${group.contactEmail}` : ''}`} />
          <Separator className='my-2' />
        </div>
      )}
      <MembersCard groupSlug={group.slug} />
      <MembersHistoryCard groupSlug={group.slug} />
    </>
  );
}
