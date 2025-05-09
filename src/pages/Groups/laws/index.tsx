import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Expandable from '~/components/ui/expandable';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useGroup, useGroupLaws } from '~/hooks/Group';
import { useUser } from '~/hooks/User';
import AddLawDialog from '~/pages/Groups/laws/AddLawDialog';
import LawItem from '~/pages/Groups/laws/LawItem';
import { Scale } from 'lucide-react';
import { useParams } from 'react-router';

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
      <div className='space-y-4 lg:hidden'>
        {group.fine_info && (
          <Expandable icon={<Scale className='w-5 h-5 stroke-[1.5px]' />} title='Praktiske detaljer'>
            <MarkdownRenderer value={group.fine_info} />
          </Expandable>
        )}
        {isAdmin && <AddLawDialog groupSlug={group.slug} />}
        {!laws.length && (
          <NotFoundIndicator header='Gruppen har ingen lover' subtitle={isAdmin ? 'Lag en ny lov slik at medlemmene i gruppen kan gi bøter' : undefined} />
        )}
        <div className='space-y-2'>
          {laws.map((law) => (
            <LawItem groupSlug={group.slug} isAdmin={isAdmin} key={law.id} law={law} />
          ))}
        </div>
      </div>

      <div className='space-y-6 hidden lg:block'>
        {isAdmin && <AddLawDialog groupSlug={group.slug} />}

        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel>
            {!laws.length && (
              <NotFoundIndicator header='Gruppen har ingen lover' subtitle={isAdmin ? 'Lag en ny lov slik at medlemmene i gruppen kan gi bøter' : undefined} />
            )}
            {laws.length > 0 && (
              <ScrollArea className='h-[96vh] pr-4 pl-2 relative border-l border-b border-t rounded-l-lg'>
                <div className='pointer-events-none absolute top-0 left-0 right-0 h-4 dark:h-2 bg-gradient-to-b from-gray-50 dark:from-background to-transparent' />

                <div className='space-y-2 py-4'>
                  {laws.map((law) => (
                    <LawItem groupSlug={group.slug} isAdmin={isAdmin} key={law.id} law={law} />
                  ))}
                </div>

                <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-4 dark:h-2 bg-gradient-to-t from-gray-50 dark:from-background to-transparent' />
              </ScrollArea>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            {!group.fine_info && (
              <div className='flex items-center justify-center h-full w-full p-4'>
                <div className='text-center space-y-2'>
                  <h1 className='text-2xl font-bold'>Det er ingen informasjon om lovverket</h1>
                  <p className='text-muted-foreground font-medium'>Leder kan legge til informasjon om lovverket i denne gruppen ved å redigere gruppen.</p>
                </div>
              </div>
            )}

            {group.fine_info && (
              <ScrollArea className='h-[96vh] pr-4 pl-2 relative border-r border-b border-t rounded-r-lg'>
                <div className='pointer-events-none absolute top-0 left-0 right-0 h-4 dark:h-2 bg-gradient-to-b from-gray-50 dark:from-background to-transparent' />

                <div className='space-y-2 py-4'>
                  <MarkdownRenderer value={group.fine_info} />
                </div>

                <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-4 dark:h-2 bg-gradient-to-t from-gray-50 dark:from-background to-transparent' />
              </ScrollArea>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
};

export default GroupLaws;
