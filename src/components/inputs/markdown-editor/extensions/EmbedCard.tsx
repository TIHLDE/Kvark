import { Button } from '~/components/ui/button';
import { eventByIdQuery } from '~/hooks/Event';
import { jobPostByIdQuery } from '~/hooks/JobPost';
import { newsByIdQuery } from '~/hooks/News';
import { useQuery } from '@tanstack/react-query';
import type { NodeViewProps } from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Briefcase, CalendarDays, Newspaper, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EmbedDialog, { type EmbedKind } from '../dialogs/EmbedDialog';

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

function useEmbedTitle(kind: EmbedKind, id: string): string | undefined {
  const valid = /^\d+$/.test(id) && Number(id) > 0;
  const numId = valid ? Number(id) : -1;
  const eventQ = useQuery({ ...eventByIdQuery(numId), enabled: valid && kind === 'event', retry: false });
  const jobQ = useQuery({ ...jobPostByIdQuery(numId), enabled: valid && kind === 'jobpost', retry: false });
  const newsQ = useQuery({ ...newsByIdQuery(numId), enabled: valid && kind === 'news', retry: false });
  const q = kind === 'event' ? eventQ : kind === 'jobpost' ? jobQ : newsQ;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (q.data as any)?.title;
}

function EmbedCardView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const kind = node.attrs.kind as EmbedKind;
  const id = String(node.attrs.id ?? '');
  const [open, setOpen] = useState(false);
  const Icon = KIND_ICON[kind] ?? CalendarDays;
  const title = useEmbedTitle(kind, id);

  return (
    <NodeViewWrapper as='div' className='my-2'>
      <div className='flex items-center gap-2 rounded-md border bg-card px-3 py-2'>
        <Icon className='size-4 shrink-0 text-muted-foreground' />
        <div className='min-w-0 flex-1'>
          <div className='truncate text-sm'>{title ?? `${KIND_LABEL[kind] ?? kind} #${id || '?'}`}</div>
          <div className='text-xs text-muted-foreground'>
            {KIND_LABEL[kind] ?? kind} · ID {id || '?'}
          </div>
        </div>
        <Button onClick={() => setOpen(true)} size='icon' title='Endre ID' type='button' variant='ghost'>
          <Pencil className='size-3.5' />
        </Button>
        <Button onClick={() => deleteNode()} size='icon' title='Fjern' type='button' variant='ghost'>
          <Trash2 className='size-3.5' />
        </Button>
      </div>
      {open && <EmbedDialog initialId={id} kind={kind} onOpenChange={setOpen} onSubmit={(newId) => updateAttributes({ id: newId })} open={open} />}
    </NodeViewWrapper>
  );
}

export const EmbedCard = Node.create({
  name: 'embedCard',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      kind: { default: 'event' },
      id: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-kvark-embed]',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false;
          const kind = el.getAttribute('data-kvark-embed') ?? 'event';
          const id = el.getAttribute('data-id') ?? '';
          return { kind, id };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-kvark-embed': HTMLAttributes.kind, 'data-id': HTMLAttributes.id })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedCardView);
  },

  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          const kind = node.attrs.kind || 'event';
          const id = node.attrs.id || '';
          state.write('```' + kind + '\n' + id + '\n```');
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },
});
