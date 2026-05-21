import API from '~/api/api';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { eventByIdQuery } from '~/hooks/Event';
import { jobPostByIdQuery } from '~/hooks/JobPost';
import { newsByIdQuery } from '~/hooks/News';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Briefcase, CalendarDays, Loader2, Newspaper, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export type EmbedKind = 'event' | 'jobpost' | 'news';

const KIND_LABEL: Record<EmbedKind, string> = {
  event: 'Arrangement',
  jobpost: 'Jobbannonse',
  news: 'Nyhet',
};

const KIND_ICON: Record<EmbedKind, React.ComponentType<{ className?: string }>> = {
  event: CalendarDays,
  jobpost: Briefcase,
  news: Newspaper,
};

export type EmbedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: EmbedKind;
  initialId?: string;
  onSubmit: (id: string) => void;
};

type SearchResult = { id: number; title: string; image?: string };

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useIdPreview(kind: EmbedKind, id: string) {
  const valid = /^\d+$/.test(id) && Number(id) > 0;
  const numId = valid ? Number(id) : -1;
  const eventQ = useQuery({ ...eventByIdQuery(numId), enabled: valid && kind === 'event', retry: false });
  const jobQ = useQuery({ ...jobPostByIdQuery(numId), enabled: valid && kind === 'jobpost', retry: false });
  const newsQ = useQuery({ ...newsByIdQuery(numId), enabled: valid && kind === 'news', retry: false });
  return kind === 'event' ? eventQ : kind === 'jobpost' ? jobQ : newsQ;
}

function useTitleSearch(kind: EmbedKind, query: string) {
  const trimmed = query.trim();
  const enabled = trimmed.length >= 2;
  return useQuery({
    queryKey: ['embedSearch', kind, trimmed],
    enabled,
    retry: false,
    staleTime: 30_000,
    queryFn: async (): Promise<SearchResult[]> => {
      const filters = { search: trimmed, page: 1 };
      const res = kind === 'event' ? await API.getEvents(filters) : kind === 'jobpost' ? await API.getJobPosts(filters) : await API.getNewsItems(filters);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (res?.results ?? []) as any[];
      return items.slice(0, 8).map((it) => ({ id: it.id, title: it.title ?? `#${it.id}`, image: it.image }));
    },
  });
}

export default function EmbedDialog({ open, onOpenChange, kind, initialId, onSubmit }: EmbedDialogProps) {
  const [query, setQuery] = useState(initialId ?? '');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (open) setQuery(initialId ?? '');
  }, [open, initialId]);

  const Icon = KIND_ICON[kind];
  const trimmed = query.trim();
  const isNumeric = /^\d+$/.test(trimmed) && Number(trimmed) > 0;

  const idPreview = useIdPreview(kind, isNumeric ? trimmed : '');
  const titleSearch = useTitleSearch(kind, isNumeric ? '' : debouncedQuery);

  const submitId = (id: string) => {
    onSubmit(id);
    onOpenChange(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idData = idPreview.data as any;
  const idTitle: string | undefined = idData?.title;
  const idImage: string | undefined = idData?.image;

  const canSubmitNumeric = isNumeric && (idPreview.isSuccess || idPreview.isError);

  const searchPending = !isNumeric && trimmed.length >= 2 && (titleSearch.isPending || debouncedQuery !== query);
  const searchResults = !isNumeric ? (titleSearch.data ?? []) : [];

  return (
    <ResponsiveDialog
      description={`Søk etter ${KIND_LABEL[kind].toLowerCase()} på tittel, eller skriv inn en ID direkte.`}
      onOpenChange={onOpenChange}
      open={open}
      title={`${initialId ? 'Endre' : 'Sett inn'} ${KIND_LABEL[kind].toLowerCase()}-kort`}
      trigger={<span style={{ display: 'none' }} />}>
      <form
        className='space-y-3'
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmitNumeric) submitId(trimmed);
        }}>
        <div className='space-y-1'>
          <Label htmlFor='embed-query'>Søk eller ID</Label>
          <div className='relative'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              autoFocus
              className='pl-9'
              id='embed-query'
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`F.eks. "vårfest" eller en ID som 19`}
              value={query}
            />
          </div>
        </div>

        <div className='rounded-md border bg-muted/30 p-2'>
          {!trimmed && (
            <div className='flex items-center gap-2 p-2 text-sm text-muted-foreground'>
              <Icon className='size-4' />
              Start å skrive for å søke etter {KIND_LABEL[kind].toLowerCase()}.
            </div>
          )}

          {trimmed && !isNumeric && trimmed.length < 2 && <div className='p-2 text-sm text-muted-foreground'>Skriv minst 2 tegn for å søke.</div>}

          {/* Numeric → ID preview */}
          {isNumeric && idPreview.isPending && (
            <div className='flex items-center gap-2 p-2 text-sm text-muted-foreground'>
              <Loader2 className='size-4 animate-spin' /> Henter {KIND_LABEL[kind].toLowerCase()}...
            </div>
          )}
          {isNumeric && idPreview.isError && (
            <div className='flex items-center gap-2 p-2 text-sm text-destructive'>
              <AlertCircle className='size-4' /> Fant ikke {KIND_LABEL[kind].toLowerCase()} med ID {trimmed}.
            </div>
          )}
          {isNumeric && idPreview.isSuccess && idData && (
            <button className='flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted' onClick={() => submitId(trimmed)} type='button'>
              {idImage ? (
                <img alt='' className='size-12 rounded-md object-cover' src={idImage} />
              ) : (
                <div className='flex size-12 items-center justify-center rounded-md bg-muted'>
                  <Icon className='size-5 text-muted-foreground' />
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <div className='truncate text-sm font-medium'>{idTitle ?? `${KIND_LABEL[kind]} #${trimmed}`}</div>
                <div className='text-xs text-muted-foreground'>ID {trimmed}</div>
              </div>
            </button>
          )}

          {/* Title search → result list */}
          {!isNumeric && searchPending && (
            <div className='flex items-center gap-2 p-2 text-sm text-muted-foreground'>
              <Loader2 className='size-4 animate-spin' /> Søker...
            </div>
          )}
          {!isNumeric && !searchPending && trimmed.length >= 2 && titleSearch.isSuccess && searchResults.length === 0 && (
            <div className='p-2 text-sm text-muted-foreground'>Ingen treff. Prøv et annet søkeord, eller skriv inn en ID.</div>
          )}
          {!isNumeric && !searchPending && titleSearch.isError && (
            <div className='flex items-center gap-2 p-2 text-sm text-destructive'>
              <AlertCircle className='size-4' /> Klarte ikke å søke. Prøv igjen.
            </div>
          )}
          {!isNumeric && searchResults.length > 0 && (
            <ul className='max-h-72 space-y-1 overflow-y-auto'>
              {searchResults.map((r) => (
                <li key={r.id}>
                  <button
                    className='flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted'
                    onClick={() => submitId(String(r.id))}
                    type='button'>
                    {r.image ? (
                      <img alt='' className='size-12 rounded-md object-cover' src={r.image} />
                    ) : (
                      <div className='flex size-12 items-center justify-center rounded-md bg-muted'>
                        <Icon className='size-5 text-muted-foreground' />
                      </div>
                    )}
                    <div className='min-w-0 flex-1'>
                      <div className='truncate text-sm font-medium'>{r.title}</div>
                      <div className='text-xs text-muted-foreground'>
                        {KIND_LABEL[kind]} · ID {r.id}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          <Button onClick={() => onOpenChange(false)} type='button' variant='ghost'>
            Avbryt
          </Button>
          {isNumeric && (
            <Button disabled={!canSubmitNumeric} type='submit'>
              {initialId ? 'Oppdater' : 'Sett inn'}
            </Button>
          )}
        </div>
      </form>
    </ResponsiveDialog>
  );
}
