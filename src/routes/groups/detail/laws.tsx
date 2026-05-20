import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Expandable from '~/components/ui/expandable';
import { getGroupBySlugQuery } from '~/api/queries/groups';
import LawItem from './components/LawItem';
import AddLawDialog from './components/AddLawDialog';
import { Scale } from 'lucide-react';

// TODO: Re-add group laws query — previously used useGroupLaws from ~/hooks/Group.
// The new query layer (~/api/queries/groups) does not yet have a group laws endpoint.

// TODO: Re-add user check — previously used useUser() from ~/hooks/User

export const Route = createFileRoute('/_MainLayout/grupper/$slug/lovverk')({
  component: GroupLaws,
});

function GroupLaws() {
  const { slug } = Route.useParams();
  const { data: group } = useSuspenseQuery(getGroupBySlugQuery(slug));

  // TODO: Replace with laws query when available
  const laws: { id: string; description: string; amount: number; title: string; paragraph: number }[] = [];

  // TODO: Re-add user check for fines admin — API does not include permissions
  const isAdmin = false;

  return (
    <>
      {group.finesInfo && (
        <Expandable icon={<Scale className='w-5 h-5 stroke-[1.5px]' />} title='Praktiske detaljer'>
          <MarkdownRenderer value={group.finesInfo} />
        </Expandable>
      )}
      {isAdmin && <AddLawDialog groupSlug={group.slug} />}
      <div className='space-y-2'>
        {!laws.length && (
          <NotFoundIndicator header='Gruppen har ingen lover' subtitle={isAdmin ? 'Lag en ny lov slik at medlemmene i gruppen kan gi boter' : undefined} />
        )}
        {laws.map((law) => (
          <LawItem groupSlug={group.slug} isAdmin={isAdmin} key={law.id} law={law as never} />
        ))}
      </div>
    </>
  );
}
