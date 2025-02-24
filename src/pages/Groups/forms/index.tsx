import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import ShareButton from '~/components/miscellaneous/ShareButton';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import { useGroup, useGroupForms } from '~/hooks/Group';
import { cn } from '~/lib/utils';
import AddGroupFormDialog from '~/pages/Groups/forms/AddGroupFormDialog';
import type { GroupForm } from '~/types';
import URLS from '~/URLS';
import { ArrowRight, CircleHelp, Eye, Infinity, Info, LockOpen, Settings, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';

const GroupFormAdminListItem = ({ form }: { form: GroupForm }) => {
  const navigate = useNavigate();

  const Description = () => (
    <div className='flex items-center space-x-2'>
      <LockOpen className={cn('w-4 h-4 stroke-[1.5px]', form.is_open_for_submissions ? 'text-emerald-500' : 'text-red-500')} />
      <Users className={cn('w-4 h-4 stroke-[1.5px]', form.only_for_group_members ? 'text-red-500' : 'text-emerald-500')} />
      <Infinity className={cn('w-4 h-4 stroke-[1.5px]', form.can_submit_multiple ? 'text-emerald-500' : 'text-red-500')} />
    </div>
  );

  return (
    <Expandable description={<Description />} icon={<CircleHelp />} title={form.title}>
      <div className='space-y-2'>
        {!form.is_open_for_submissions && (
          <Alert>
            <Info className='w-5 h-5' />
            <AlertTitle>Spørreskjemaet er ikke åpent for innsending av svar</AlertTitle>
            <AlertDescription>Du må åpne spørreskjemaet for innsending for å kunne svare på og dele skjemaet.</AlertDescription>
          </Alert>
        )}
        <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2'>
          <Button asChild className='w-full text-black dark:text-white' variant='outline'>
            <Link to={`${URLS.form}admin/${form.id}/`}>
              <Settings className='w-5 h-5 mr-2' />
              Administrer
            </Link>
          </Button>
          <Button
            className='w-full text-black dark:text-white'
            disabled={!form.is_open_for_submissions}
            onClick={() => navigate(`${URLS.form}${form.id}/`)}
            variant='outline'>
            <Eye className='w-5 h-5 mr-2' />
            Svar på/se skjema
          </Button>
          <ShareButton shareId={form.id} shareType='form' title={form.title} />
        </div>
      </div>
    </Expandable>
  );
};

const GroupForms = () => {
  const { slug } = useParams<'slug'>();
  const { data: group } = useGroup(slug || '-');
  const { data: forms } = useGroupForms(slug || '-');

  const isAdmin = group?.permissions.group_form;
  if (!forms || !slug || !group) {
    return null;
  }

  return (
    <>
      {isAdmin ? (
        <>
          <AddGroupFormDialog groupSlug={slug} />
          <div>
            <div className='space-y-2'>
              {forms.map((form) => (
                <GroupFormAdminListItem form={form} key={form.id} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className='space-y-2'>
          {forms.map((form) => (
            <Link
              className='flex items-center justify-between p-4 border rounded-md hover:bg-border transition-all duration-150 text-black dark:text-white'
              key={form.id}
              to={`${URLS.form}${form.id}/`}>
              <h1>{form.title}</h1>
              <ArrowRight className='w-5 h-5' />
            </Link>
          ))}
        </div>
      )}
      {!forms.length && <NotFoundIndicator header='Gruppen har ingen spørreskjemaer' />}
    </>
  );
};

export default GroupForms;
