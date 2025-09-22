import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { HavePermission } from '~/hooks/User';
import type { Toddel } from '~/types';
import { PermissionApp } from '~/types/Enums';
import { formatDate } from '~/utils';
import { parseISO } from 'date-fns';

import EditToddelDialog from './EditToddelDialog';

export type ToddelListItemProps = {
  toddel: Toddel;
};

const ToddelListItem = ({ toddel }: ToddelListItemProps) => {
  return (
    <Card>
      <CardHeader className='flex flex-row justify-between'>
        <div>
          <CardTitle>{toddel.title}</CardTitle>
          <CardDescription>
            Utgave {toddel.edition} - Publisert {formatDate(parseISO(toddel.published_at), { time: false, capitalizeFirstLetter: false, fullDayOfWeek: true })}
          </CardDescription>
        </div>

        <HavePermission apps={[PermissionApp.TODDEL]}>
          <EditToddelDialog toddel={toddel} />
        </HavePermission>
      </CardHeader>
      <CardContent className='px-0 pb-2'>
        <a href={toddel.pdf} rel='noreferrer' target='_blank'>
          <img alt={toddel.title} className='object-contain w-full' src={toddel.image} />
        </a>
      </CardContent>
    </Card>
  );
};

export default ToddelListItem;

export const ToddelListItemLoading = () => (
  <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {[...Array(6)].map((_, index) => (
      <div className='bg-card rounded-md border p-4 space-y-4' key={index}>
        <div className='space-y-2'>
          <Skeleton className='w-2/3 h-8' />
          <Skeleton className='w-full h-8' />
        </div>
        <Skeleton className='w-full h-72' />
      </div>
    ))}
  </div>
);
