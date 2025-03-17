import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { useUserForms } from '~/hooks/User';
import { EventFormType, FormResourceType } from '~/types/Enums';
import URLS from '~/URLS';
import { formatDate } from '~/utils';
import { parseISO } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router';

const ProfileForms = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserForms({ unanswered: true });
  const forms = useMemo(() => (data !== undefined ? data.pages.flatMap((page) => page.results) : []), [data]);

  if (!data) {
    return <Skeleton className='h-20' />;
  } else if (!forms.length) {
    return <NotFoundIndicator header='Fant ingen spørreskjemaer' subtitle='Du har ingen spørreskjemaer du må svare på' />;
  } else {
    return (
      <div className='space-y-2'>
        <h1 className='text-center py-2'>Du må svare på følgende spørreskjemaer før du kan melde deg på arrangementer igjen</h1>
        <div className='space-y-2'>
          {forms?.map((form, index) => (
            <Link
              className='w-full flex items-center justify-between p-4 rounded-md border bg-card text-black dark:text-white'
              key={index}
              to={`${URLS.form}${form.id}/`}
            >
              <div className='space-y-2'>
                <h1>
                  {form.resource_type === FormResourceType.EVENT_FORM
                    ? `${form.event.title} - ${form.type === EventFormType.EVALUATION ? `Evaluering` : `Spørreskjema`}`
                    : form.title}
                </h1>
                <p className='text-sm text-muted-foreground'>
                  {form.resource_type === FormResourceType.EVENT_FORM &&
                    `Holdt ${formatDate(parseISO(form.event.start_date)).toLowerCase()} på ${form.event.location}`}
                </p>
              </div>

              <ArrowRight className='w-5 h-5' />
            </Link>
          ))}
        </div>

        {hasNextPage && <PaginateButton className='w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    );
  }
};

export default ProfileForms;
