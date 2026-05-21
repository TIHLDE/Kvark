import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import type { NodeViewProps } from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';

function ExpandItemView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <NodeViewWrapper as='div' className='my-2 rounded-md border bg-card/40'>
      <div className='flex items-center gap-2 p-2'>
        <button
          className='flex size-7 items-center justify-center rounded hover:bg-muted'
          onClick={() => setExpanded((v) => !v)}
          title='Vis/skjul'
          type='button'>
          <ChevronDown className={`size-4 transition-transform ${expanded ? '' : '-rotate-90'}`} />
        </button>
        <Input
          className='h-8 flex-1'
          onChange={(e) => updateAttributes({ title: e.target.value })}
          placeholder='Tittel på utvid-boks'
          value={node.attrs.title ?? ''}
        />
        <Button onClick={() => deleteNode()} size='icon' title='Fjern' type='button' variant='ghost'>
          <Trash2 className='size-4' />
        </Button>
      </div>
      {expanded && (
        <div className='border-t p-2'>
          <Textarea
            className='min-h-[80px] w-full'
            onChange={(e) => updateAttributes({ content: e.target.value })}
            placeholder='Innhold (markdown støttes)'
            value={node.attrs.content ?? ''}
          />
        </div>
      )}
    </NodeViewWrapper>
  );
}

export const ExpandItem = Node.create({
  name: 'expandItem',
  group: 'expandItemGroup',
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      title: { default: '' },
      content: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-kvark-expand]',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false;
          return {
            title: el.getAttribute('data-title') ?? '',
            content: el.getAttribute('data-content') ?? '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-kvark-expand': '',
        'data-title': HTMLAttributes.title ?? '',
        'data-content': HTMLAttributes.content ?? '',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExpandItemView);
  },

  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          const title = (node.attrs.title ?? '').toString();
          const content = (node.attrs.content ?? '').toString();
          state.write('```expand\n' + title + '::' + content + '\n```');
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },
});
