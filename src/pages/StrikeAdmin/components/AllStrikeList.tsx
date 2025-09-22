import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import StrikeListItem from '~/components/miscellaneous/StrikeListItem';
import { PaginateButton } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { useStrikes } from '~/hooks/Strike';
import { Fragment, useMemo } from 'react';

const AllStrikesList = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useStrikes();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  return (
    <>
      {isLoading && (
        <div className='space-y-2'>
          {[...Array(5)].map((_, i) => (
            <Skeleton className='h-12' key={i} />
          ))}
        </div>
      )}
      {isEmpty && <NotFoundIndicator header='Fant ingen prikker' />}
      {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
      {data !== undefined && (
        <div className='space-y-2'>
          {data.pages.map((page, i) => (
            <Fragment key={i}>
              {page.results.map((strike) => (
                <StrikeListItem displayUserInfo key={strike.id} strike={strike} user={strike.user} />
              ))}
            </Fragment>
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </>
  );
};

export default AllStrikesList;
