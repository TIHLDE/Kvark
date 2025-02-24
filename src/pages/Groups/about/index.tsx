import { getGroup } from '~/api/api.cached';
import { authClient, userHasWritePermission } from '~/api/auth';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Separator } from '~/components/ui/separator';
import MembersCard from '~/pages/Groups/about/MembersCard';
import MembersHistoryCard from '~/pages/Groups/about/MembersHistoryCard';
import { PermissionApp } from '~/types/Enums';

import GroupStatistics from '../components/GroupStatistics';
import type { Route } from './+types/index';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const auth = await authClient();
  const group = await getGroup(params.slug);
  return {
    group,
    isAuthenticated: Boolean(auth),
    isAdmin: userHasWritePermission(auth?.permissions ?? {}, PermissionApp.GROUP),
  };
}

export default function GroupInfo({ loaderData }: Route.ComponentProps) {
  const { group, isAuthenticated, isAdmin } = loaderData;

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
