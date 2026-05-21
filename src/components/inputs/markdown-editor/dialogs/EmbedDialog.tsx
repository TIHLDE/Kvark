import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { eventByIdQuery } from '~/hooks/Event';
import { jobPostByIdQuery } from '~/hooks/JobPost';
import { newsByIdQuery } from '~/hooks/News';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Briefcase, CalendarDays, Loader2, Newspaper } from 'lucide-react';
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

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useEmbedPreview(kind: EmbedKind, id: string) {
  const valid = /^\d+$/.test(id) && Number(id) > 0;
  const numId = valid ? Number(id) : -1;

  const eventQ = useQuery({ ...eventByIdQuery(numId), enabled: valid && kind === 'event', retry: false });
  const jobQ = useQuery({ ...jobPostByIdQuery(numId), enabled: valid && kind === 'jobpost', retry: false });
  const newsQ = useQuery({ ...newsByIdQuery(numId), enabled: valid && kind === 'news', retry: false });

  const q = kind === 'event' ? eventQ : kind === 'jobpost' ? jobQ : newsQ;
  return { valid, ...q };
}

export default function EmbedDialog({ open, onOpenChange, kind, initialId, onSubmit }: EmbedDialogProps) {
  const [id, setId] = useState(initialId ?? '');
  const debouncedId = useDebouncedValue(id, 300);
  const preview = useEmbedPreview(kind, debouncedId);

  useEffect(() => {
    if (open) setId(initialId ?? '');
  }, [open, initialId]);

  const Icon = KIND_ICON[kind];
  const trimmed = id.trim();
  const validId = /^\d+$/.test(trimmed) && Number(trimmed) > 0;
  const canSubmit = validId && (preview.isSuccess || preview.isError);

  const submit = () => {
    if (!validId) return;
    onSubmit(trimmed);
    onOpenChange(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = preview.data as any;
  const title: string | undefined = data?.title;
  const image: string | undefined = data?.image;

  return (
    <ResponsiveDialog
      description={`Skriv inn ID-en til ${KIND_LABEL[kind].toLowerCase()} du vil vise. Du finner ID-en i URL-en til ${KIND_LABEL[kind].toLowerCase()}en.`}
      onOpenChange={onOpenChange}
      open={open}
      title={`${initialId ? 'Endre' : 'Sett inn'} ${KIND_LABEL[kind].toLowerCase()}-kort`}
      trigger={<span style={{ display: 'none' }} />}>
      <form
        className='space-y-3'
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}>
        <div className='space-y-1'>
          <Label htmlFor='embed-id'>ID</Label>
          <Input autoFocus id='embed-id' inputMode='numeric' onChange={(e) => setId(e.target.value.replace(/[^\d]/g, ''))} placeholder='F.eks. 19' value={id} />
        </div>

        <div className='rounded-md border bg-muted/30 p-3'>
          <div className='mb-2 text-xs text-muted-foreground'>Forhåndsvisning</div>
          {!trimmed && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Icon className='size-4' />
              Skriv inn en ID for å se {KIND_LABEL[kind].toLowerCase()}en.
            </div>
          )}
          {trimmed && !validId && (
            <div className='flex items-center gap-2 text-sm text-destructive'>
              <AlertCircle className='size-4' /> Ugyldig ID. Bruk kun tall.
            </div>
          )}
          {validId && preview.isPending && debouncedId === trimmed && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Loader2 className='size-4 animate-spin' /> Henter {KIND_LABEL[kind].toLowerCase()}...
            </div>
          )}
          {validId && debouncedId !== trimmed && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Loader2 className='size-4 animate-spin' /> Søker...
            </div>
          )}
          {validId && preview.isError && debouncedId === trimmed && (
            <div className='flex items-center gap-2 text-sm text-destructive'>
              <AlertCircle className='size-4' />
              Fant ikke {KIND_LABEL[kind].toLowerCase()} med ID {trimmed}.
            </div>
          )}
          {validId && preview.isSuccess && data && (
            <div className='flex items-center gap-3'>
              {image ? (
                <img alt='' className='size-16 rounded-md object-cover' src={image} />
              ) : (
                <div className='flex size-16 items-center justify-center rounded-md bg-muted'>
                  <Icon className='size-6 text-muted-foreground' />
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <div className='truncate text-sm font-medium'>{title ?? `${KIND_LABEL[kind]} #${trimmed}`}</div>
                <div className='text-xs text-muted-foreground'>
                  {KIND_LABEL[kind]} · ID {trimmed}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          <Button onClick={() => onOpenChange(false)} type='button' variant='ghost'>
            Avbryt
          </Button>
          <Button disabled={!canSubmit} type='submit'>
            {initialId ? 'Oppdater' : 'Sett inn'}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
