import { ChevronRight, FileText, Loader2, Search } from 'lucide-react';
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Button, PaginateButton } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { analyticsEvent, useDebounce } from '~/hooks/Utils';
import { useWikiSearch } from '~/hooks/Wiki';
import type { WikiChildren } from '~/types';

const WikiSearch = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const filters = useMemo(() => {
    const _filters: Record<string, unknown> = {};
    if (debouncedSearch) {
      _filters.search = debouncedSearch;
      analyticsEvent('search', 'pages', `Search for: ${debouncedSearch}`);
    }
    return _filters;
  }, [debouncedSearch]);
  const { data, hasNextPage, fetchNextPage, isLoading } = useWikiSearch(filters);
  const pages = useMemo(() => (data !== undefined ? data.pages.flatMap((page) => page.results) : []), [data]);
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      className='w-full max-w-2xl'
      description='Søk etter ord eller setninger for å finne sider i Wiki. Eks: "Lambo"'
      onOpenChange={setOpen}
      open={open}
      title='Søk i Wiki'
      trigger={
        <Button className='text-lg' size='lg'>
          <Search className='mr-2 w-5 h-5 stroke-[1.5px]' />
          Søk
        </Button>
      }
    >
      <div className='px-2 py-4 space-y-8'>
        <Input onChange={(e) => setSearch(e.target.value)} placeholder='Søk...' value={search} />

        <ScrollArea className='h-[50vh] pr-4'>
          {isLoading && pages.length === 0 && (
            <div className='flex justify-center mt-12 items-center'>
              <Loader2 className='w-6 h-6 mr-2 animate-spin' />
              <h1>Søker...</h1>
            </div>
          )}

          {!isLoading && pages.length === 0 && debouncedSearch.length > 0 && (
            <h1 className='text-center mt-12'>Fant ingen sider som inneholder det du leter etter</h1>
          )}

          <div className='space-y-2 pb-6'>
            {pages.map((page, index) => (
              <PageListItem key={index} page={page} setOpen={setOpen} />
            ))}
            {hasNextPage && <PaginateButton className='w-full' isLoading={isLoading} nextPage={fetchNextPage} />}
          </div>
        </ScrollArea>
      </div>
    </ResponsiveDialog>
  );
};

type PageListItemProps = {
  page: WikiChildren;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const PageListItem = ({ page, setOpen }: PageListItemProps) => {
  return (
    <Button asChild className='block w-full rounded-md border h-auto' variant='outline'>
      <Link className='flex items-center justify-between' onClick={() => setOpen(false)} to={page.path}>
        <div className='flex items-center space-x-2'>
          <FileText className='w-6 h-6' />
          <h1 className='text-lg'>{page.title}</h1>
        </div>

        <ChevronRight className='w-5 h-5 stroke-[1.5px]' />
      </Link>
    </Button>
  );
};

export default WikiSearch;
