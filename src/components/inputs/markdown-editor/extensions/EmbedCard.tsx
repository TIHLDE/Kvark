import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import type { NodeViewProps } from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Briefcase, CalendarDays, Newspaper, Pencil } from 'lucide-react';
import { useState } from 'react';

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

function EmbedCardView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const kind = node.attrs.kind as EmbedKind;
  const id = String(node.attrs.id ?? '');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(id);
  const Icon = KIND_ICON[kind] ?? CalendarDays;

  return (
    <NodeViewWrapper as='div' className='my-2'>
      <div className='flex items-center gap-2 rounded-md border bg-card px-3 py-2'>
        <Icon className='size-4 text-muted-foreground' />
        <span className='text-sm'>
          {KIND_LABEL[kind] ?? kind} #{id || '?'}
        </span>
        <div className='ml-auto flex gap-1'>
          <ResponsiveDialog
            description={`Skriv inn ID-en til ${KIND_LABEL[kind]?.toLowerCase() ?? 'innholdet'} du vil vise.`}
            onOpenChange={(v) => {
              setOpen(v);
              if (v) setDraft(id);
            }}
            open={open}
            title={`Endre ${KIND_LABEL[kind]?.toLowerCase() ?? 'innhold'}`}
            trigger={
              <Button size='sm' title='Endre ID' type='button' variant='ghost'>
                <Pencil className='size-3.5' />
              </Button>
            }>
            <div className='space-y-3'>
              <div className='space-y-1'>
                <Label htmlFor='embed-id'>ID</Label>
                <Input id='embed-id' inputMode='numeric' onChange={(e) => setDraft(e.target.value)} value={draft} />
              </div>
              <div className='flex justify-end gap-2'>
                <Button onClick={() => setOpen(false)} type='button' variant='ghost'>
                  Avbryt
                </Button>
                <Button
                  onClick={() => {
                    updateAttributes({ id: draft.trim() });
                    setOpen(false);
                  }}
                  type='button'>
                  Lagre
                </Button>
              </div>
            </div>
          </ResponsiveDialog>
          <Button onClick={() => deleteNode()} size='sm' title='Fjern' type='button' variant='ghost'>
            Fjern
          </Button>
        </div>
      </div>
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
