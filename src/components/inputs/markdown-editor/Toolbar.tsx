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
  const promptInt = (label: string): string | null => {
    const v = window.prompt(label);
    if (v == null) return null;
    const trimmed = v.trim();
    if (!/^\d+$/.test(trimmed)) {
      window.alert('Vennligst skriv inn en gyldig ID (heltall).');
      return null;
    }
    return trimmed;
  };

  const insertEmbed = (kind: 'event' | 'jobpost' | 'news') => {
    const labels = { event: 'arrangement', jobpost: 'jobbannonse', news: 'nyhet' } as const;
    const id = promptInt(`ID til ${labels[kind]}:`);
    if (!id) return;
    editor.chain().focus().insertContent({ type: 'embedCard', attrs: { kind, id } }).run();
  };

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

  const promptLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL:', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = () => {
    const url = window.prompt('Bilde-URL:', 'https://');
    if (!url) return;
    const alt = window.prompt('Alternativ tekst:', '') ?? '';
    editor.chain().focus().setImage({ src: url, alt }).run();
  };

  return (
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
      <ToolbarButton active={editor.isActive('link')} onClick={promptLink} title='Lenke'>
        <LinkIcon className='size-4' />
      </ToolbarButton>
      <ToolbarButton onClick={insertImage} title='Bilde'>
        <ImageIcon className='size-4' />
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={insertExpandList} title='Utvid-liste'>
        <ChevronsUpDown className='size-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => insertEmbed('event')} title='Arrangement-kort'>
        <CalendarDays className='size-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => insertEmbed('jobpost')} title='Jobbannonse-kort'>
        <Briefcase className='size-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => insertEmbed('news')} title='Nyhet-kort'>
        <Newspaper className='size-4' />
      </ToolbarButton>
    </div>
  );
}
