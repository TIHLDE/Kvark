import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Briefcase,
  CalendarDays,
  ChevronsUpDown,
  Code,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Newspaper,
  Quote,
  SquareCode,
} from 'lucide-react';
import { useState } from 'react';
import EmbedDialog, { type EmbedKind } from './dialogs/EmbedDialog';
import ImageDialog from './dialogs/ImageDialog';
import LinkDialog from './dialogs/LinkDialog';

type Props = { editor: Editor };

const ToolbarButton = ({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <Button
    className={cn('size-8', active && 'bg-muted text-foreground')}
    disabled={disabled}
    onClick={onClick}
    size='icon'
    title={title}
    type='button'
    variant='ghost'>
    {children}
  </Button>
);

const Divider = () => <Separator className='mx-1 h-6' orientation='vertical' />;

export default function Toolbar({ editor }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [embedKind, setEmbedKind] = useState<EmbedKind | null>(null);

  const hasSelection = !editor.state.selection.empty;
  const existingHref = (editor.getAttributes('link').href as string | undefined) ?? '';

  const insertExpandList = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'expandList',
        content: [{ type: 'expandItem', attrs: { title: 'Tittel', content: 'Innhold' } }],
      })
      .run();
  };

  return (
    <>
      <div className='flex flex-wrap items-center gap-0.5 rounded-t-md border border-b-0 bg-muted/30 p-1'>
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title='Fet'>
          <Bold className='size-4' />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title='Kursiv'>
          <Italic className='size-4' />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title='Inline kode'>
          <Code className='size-4' />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title='Stor overskrift'>
          <Heading1 className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title='Mindre overskrift'>
          <Heading2 className='size-4' />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title='Sitat'>
          <Quote className='size-4' />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title='Punktliste'>
          <List className='size-4' />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title='Nummerliste'>
          <ListOrdered className='size-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title='Delelinje'>
          <Minus className='size-4' />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title='Kodeblokk'>
          <SquareCode className='size-4' />
        </ToolbarButton>
        <Divider />
        <ToolbarButton active={editor.isActive('link')} onClick={() => setLinkOpen(true)} title='Lenke'>
          <LinkIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => setImageOpen(true)} title='Bilde'>
          <ImageIcon className='size-4' />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={insertExpandList} title='Utvid-liste'>
          <ChevronsUpDown className='size-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => setEmbedKind('event')} title='Arrangement-kort'>
          <CalendarDays className='size-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => setEmbedKind('jobpost')} title='Jobbannonse-kort'>
          <Briefcase className='size-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => setEmbedKind('news')} title='Nyhet-kort'>
          <Newspaper className='size-4' />
        </ToolbarButton>
      </div>

      <LinkDialog
        hasSelection={hasSelection}
        initialUrl={existingHref || undefined}
        onOpenChange={setLinkOpen}
        onSubmit={({ url, text }) => {
          const chain = editor.chain().focus().extendMarkRange('link');
          if (hasSelection || existingHref) {
            chain.setLink({ href: url }).run();
          } else if (text) {
            chain.insertContent({ type: 'text', text, marks: [{ type: 'link', attrs: { href: url } }] }).run();
          } else {
            chain.insertContent({ type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url } }] }).run();
          }
        }}
        onUnset={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
        open={linkOpen}
      />

      <ImageDialog
        onOpenChange={setImageOpen}
        onSubmit={({ src, alt }) => {
          editor.chain().focus().setImage({ src, alt }).run();
        }}
        open={imageOpen}
      />

      {embedKind && (
        <EmbedDialog
          kind={embedKind}
          onOpenChange={(v) => {
            if (!v) setEmbedKind(null);
          }}
          onSubmit={(id) => {
            editor
              .chain()
              .focus()
              .insertContent({ type: 'embedCard', attrs: { kind: embedKind, id } })
              .run();
            setEmbedKind(null);
          }}
          open={Boolean(embedKind)}
        />
      )}
    </>
  );
}
