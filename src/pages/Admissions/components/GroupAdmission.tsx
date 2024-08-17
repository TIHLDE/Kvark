import { ArrowRight, LoaderCircle, Lock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { GroupList } from 'types';

import { useGroupForms } from 'hooks/Group';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Button } from 'components/ui/button';
import Expandable from 'components/ui/expandable';
import { Skeleton } from 'components/ui/skeleton';

type GroupAdmissionProps = {
  group: GroupList;
};

const GroupAdmission = ({ group }: GroupAdmissionProps) => {
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
        <div className='grid grid-cols-2 gap-2'>
          {filteredForms.length > 0 && (
            <div>
              {filteredForms[0].is_open_for_submissions ? (
                <Button asChild className='w-full bg-sky-500 text-white'>
                  <Link to={`${URLS.form}${filteredForms[0].id}`}>
                    Søk nå <ArrowRight className='h-4 stroke-[1.5px]' />
                  </Link>
                </Button>
              ) : (
                <div className='flex items-center justify-between px-2 md:px-4 py-2 md:py-3 rounded-md border border-,muted bg-muted text-muted-foreground'>
                  <p>{filteredForms[0].title}</p>

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
