import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import ShareButton from '~/components/miscellaneous/ShareButton';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import { getGroupFormsQuery } from '~/api/queries/groups';
import { cn } from '~/lib/utils';
import AddGroupFormDialog from './components/AddGroupFormDialog';
import type { GroupForm } from '~/types';
import { ArrowRight, CircleHelp, Eye, Infinity as InfinityIcon, Info, LockOpen, Settings, Users } from 'lucide-react';

export const Route = createFileRoute('/_MainLayout/grupper/$slug/sporreskjemaer')({
  component: GroupForms,
});

function GroupFormAdminListItem({ form }: { form: GroupForm }) {
  const Description = () => (
    <div className='flex items-center space-x-2'>
      <LockOpen className={cn('w-4 h-4 stroke-[1.5px]', form.is_open_for_submissions ? 'text-emerald-500' : 'text-red-500')} />
      <Users className={cn('w-4 h-4 stroke-[1.5px]', form.only_for_group_members ? 'text-red-500' : 'text-emerald-500')} />
      <InfinityIcon className={cn('w-4 h-4 stroke-[1.5px]', form.can_submit_multiple ? 'text-emerald-500' : 'text-red-500')} />
    </div>
  );

  return (
    <Expandable description={<Description />} icon={<CircleHelp />} title={form.title}>
      <div className='space-y-2'>
        {!form.is_open_for_submissions && (
          <Alert>
            <Info className='w-5 h-5' />
            <AlertTitle>Sporreskjemaet er ikke apent for innsending av svar</AlertTitle>
            <AlertDescription>Du ma apne sporreskjemaet for innsending for a kunne svare pa og dele skjemaet.</AlertDescription>
          </Alert>
        )}
        <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2'>
          <Button asChild className='w-full text-black dark:text-white' variant='outline'>
            <Link to='/sporreskjema/admin/$id' params={{ id: form.id }}>
              <Settings className='w-5 h-5 mr-2' />
              Administrer
            </Link>
          </Button>
          <Button className='w-full text-black dark:text-white' disabled={!form.is_open_for_submissions} variant='outline' asChild>
            <Link to='/sporreskjema/$id' params={{ id: form.id }}>
              <Eye className='w-5 h-5 mr-2' />
              Svar pa/se skjema
            </Link>
          </Button>
          <ShareButton shareId={form.id} shareType='form' title={form.title} />
        </div>
      </div>
    </Expandable>
  );
}

function GroupForms() {
  const { slug } = Route.useParams();
  // Group data is already loaded by the parent layout route
  const { data: forms } = useQuery(getGroupFormsQuery(slug));

  // TODO: Re-add admin check when API includes permissions — previously checked group?.permissions?.group_form
  const isAdmin = false;
  const formsList = (forms ?? []) as unknown as GroupForm[];

  return (
    <>
      {isAdmin ? (
        <>
          <AddGroupFormDialog groupSlug={slug} />
          <div>
            <div className='space-y-2'>
              {formsList.map((form) => (
                <GroupFormAdminListItem form={form} key={form.id} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className='space-y-2'>
          {formsList.map((form) => (
            <Link
              className='flex items-center justify-between p-4 border rounded-md hover:bg-border transition-all duration-150 text-black dark:text-white'
              key={form.id}
              to='/sporreskjema/$id'
              params={{ id: form.id }}>
              <h1>{form.title}</h1>
              <ArrowRight className='w-5 h-5' />
            </Link>
          ))}
        </div>
      )}
      {!formsList.length && <NotFoundIndicator header='Gruppen har ingen sporreskjemaer' />}
    </>
  );
}
