import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Separator } from '~/components/ui/separator';
import { useIsAuthenticated } from '~/hooks/User';
import MembersCard from '~/pages/Groups/about/MembersCard';
import MembersHistoryCard from '~/pages/Groups/about/MembersHistoryCard';

import GroupStatistics from '../components/GroupStatistics';
import type { Route } from './+types/index';

export default function GroupInfo({ matches }: Route.ComponentProps) {
  const isAuthenticated = useIsAuthenticated();
  const { data: parentLoader } = matches[2];
  const { group } = parentLoader;

  // TODO: Auth this admin request. Should be in the loader
  const isAdmin = true;
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
