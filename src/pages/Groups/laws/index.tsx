import { createFileRoute, useParams } from '@tanstack/react-router';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Expandable from '~/components/ui/expandable';
import { useGroup, useGroupLaws } from '~/hooks/Group';
import { useUser } from '~/hooks/User';
import AddLawDialog from '~/pages/Groups/laws/AddLawDialog';
import LawItem from '~/pages/Groups/laws/LawItem';
import { Scale } from 'lucide-react';

export const Route = createFileRoute('/_MainLayout/grupper/$slug/lovverk')({
  component: GroupLaws,
});

function GroupLaws() {
  const { slug } = useParams({ strict: false });
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
        <Expandable icon={<Scale className='w-5 h-5 stroke-[1.5px]' />} title='Praktiske detaljer'>
          <MarkdownRenderer value={group.fine_info} />
        </Expandable>
      )}
      {isAdmin && <AddLawDialog groupSlug={group.slug} />}
      <div className='space-y-2'>
        {!laws.length && (
          <NotFoundIndicator header='Gruppen har ingen lover' subtitle={isAdmin ? 'Lag en ny lov slik at medlemmene i gruppen kan gi bøter' : undefined} />
        )}
        {laws.map((law) => (
          <LawItem groupSlug={group.slug} isAdmin={isAdmin} key={law.id} law={law} />
        ))}
      </div>
    </>
  );
}
