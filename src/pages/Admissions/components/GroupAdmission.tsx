import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import { Skeleton } from '~/components/ui/skeleton';
import { useGroupForms } from '~/hooks/Group';
import { cn } from '~/lib/utils';
import type { GroupForm, GroupList } from '~/types';
import URLS from '~/URLS';
import { ArrowRight, LoaderCircle, Lock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

type GroupAdmissionProps = {
  group: GroupList;
  disabled?: boolean;
};

const GroupAdmission = ({ group, disabled }: GroupAdmissionProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { data: forms, isLoading } = useGroupForms(group.slug, isExpanded);

  const filteredForms = useMemo(() => {
    if (!forms) {
      return [];
    }
    return forms.filter((form) => form.title.toLowerCase().includes('opptak'));
  }, [forms]);

  const Logo = () => (
    <AspectRatioImg alt={group.image_alt || ''} className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-md ratio-[1]' src={group.image || ''} />
  );

  const isDisabled = (form: GroupForm): boolean => {
    return !form.can_submit_multiple && form.viewer_has_answered;
  };

  if (disabled) {
    return (
      <Button asChild variant='outline'>
        <Link
          className='whitespace-normal py-8 w-full bg-white dark:bg-inherit dark:hover:bg-secondary flex justify-between items-center rounded-sm'
          to={URLS.groups.details(group.slug)}>
          <div className='flex items-center space-x-2 md:space-x-4 w-full overflow-hidden'>
            <Logo />
            <div className='text-start break-words'>
              <h1 className='text-sm md:text-base'>{group.name}</h1>
              <p className='text-xs md:text-sm'>{group.contact_email}</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <ArrowRight className='h-4' />
          </div>
        </Link>
      </Button>
    );
  }

  return (
    <Expandable className='z-10' description={group.contact_email} icon={<Logo />} onOpenChange={setIsExpanded} open={isExpanded} title={group.name}>
      <div>
        {isLoading && (
          <div className='flex justify-center space-x-2 items-center'>
            <LoaderCircle className='w-5 h-5 animate-spin' />
            <p className='text-muted-foreground'>Laster inn opptaksskjema...</p>
          </div>
        )}
        {filteredForms.length === 0 && !isLoading && <p className='text-muted-foreground text-center'>Ingen opptaksskjemaer funnet</p>}
        <div className={cn('grid grid-cols-2 gap-2', filteredForms.length === 0 && 'grid-cols-1')}>
          {filteredForms.length > 0 && (
            <div>
              {filteredForms[0].is_open_for_submissions ? (
                <Button asChild={!isDisabled(filteredForms[0])} className='w-full bg-sky-500 text-white' disabled={isDisabled(filteredForms[0])}>
                  {isDisabled(filteredForms[0]) ? (
                    <p>Søkt</p>
                  ) : (
                    <Link to={`${URLS.form}${filteredForms[0].id}`}>
                      Søk nå <ArrowRight className='h-4 stroke-[1.5px]' />
                    </Link>
                  )}
                </Button>
              ) : (
                <div className='flex items-center justify-between px-2 md:px-4 py-2 md:py-3 rounded-md border border-muted bg-muted text-muted-foreground'>
                  <p>Ikke åpnet</p>

                  <Lock className='w-4 h-4 md:w-5 md:h-5 stroke-[1.5px] text-red-500' />
                </div>
              )}
            </div>
          )}

          <Button asChild variant='ghost'>
            <Link to={URLS.groups.details(group.slug)}>
              Les mer <ArrowRight className='h-4' />
            </Link>
          </Button>
        </div>
      </div>
    </Expandable>
  );
};

export const GroupAdmissionLoading = () => (
  <div className='rounded-md bg-card border p-2 flex items-center space-x-4'>
    <Skeleton className='w-[50px] h-[50px] rounded-full' />
    <div className='space-y-2'>
      <Skeleton className='w-48 h-3' />
      <Skeleton className='w-32 h-2' />
    </div>
  </div>
);

export default GroupAdmission;
