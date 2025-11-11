import { createFileRoute } from '@tanstack/react-router';
import { authClient, userHasWritePermission } from '~/api/auth';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Separator } from '~/components/ui/separator';
import { getGroupQueryOptions } from '~/hooks/Group';
import { getQueryClient } from '~/integrations/tanstack-query';
import MembersCard from '~/pages/Groups/about/MembersCard';
import MembersHistoryCard from '~/pages/Groups/about/MembersHistoryCard';
import { PermissionApp } from '~/types/Enums';

import GroupStatistics from '../components/GroupStatistics';

export const Route = createFileRoute('/_MainLayout/grupper/$slug/')({
  loader: async ({ params }) => {
    const auth = await authClient();
    const group = await getQueryClient().ensureQueryData(getGroupQueryOptions(params.slug));
    return {
      group,
      isAuthenticated: Boolean(auth),
      isAdmin: userHasWritePermission(auth?.permissions ?? {}, PermissionApp.GROUP),
    };
  },
  component: GroupInfo,
});

function GroupInfo() {
  const { group, isAuthenticated, isAdmin } = Route.useLoaderData();

  return (
    <>
      {isAdmin && <GroupStatistics slug={group.slug} />}
      {group.description && group.contact_email && (
        <div className='mt-2'>
          <MarkdownRenderer value={`${group.description}${group.contact_email ? ` \n\n Kontakt: ${group.contact_email}` : ''}`} />
          <Separator className='my-2' />
        </div>
      )}
      <MembersCard groupSlug={group.slug} />
      {isAuthenticated && <MembersHistoryCard groupSlug={group.slug} />}
    </>
  );
}
