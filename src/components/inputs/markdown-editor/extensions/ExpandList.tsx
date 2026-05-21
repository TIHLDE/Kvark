import { Button } from '~/components/ui/button';
import type { NodeViewProps } from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Plus } from 'lucide-react';

function ExpandListView({ editor, getPos, node }: NodeViewProps) {
  return (
    <NodeViewWrapper as='div' className='my-3 rounded-md border-2 border-dashed bg-background p-2'>
      <div className='mb-2 flex items-center justify-between'>
        <span className='text-xs font-medium uppercase text-muted-foreground'>Utvid-liste</span>
        <Button
          onClick={() => {
            const pos = getPos();
            if (typeof pos !== 'number') return;
            const end = pos + node.nodeSize - 1;
            editor
              .chain()
              .focus()
              .insertContentAt(end, {
                type: 'expandItem',
                attrs: { title: '', content: '' },
              })
              .run();
          }}
          size='sm'
          type='button'
          variant='ghost'>
          <Plus className='size-4' />
          Legg til element
        </Button>
      </div>
      <NodeViewContent className='space-y-1' />
    </NodeViewWrapper>
  );
}

export const ExpandList = Node.create({
  name: 'expandList',
  group: 'block',
  content: 'expandItemGroup+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-kvark-expandlist]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-kvark-expandlist': '' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExpandListView);
  },

  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          state.write('~~~expandlist\n');
          state.renderContent(node);
          state.write('~~~');
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },
});
