import { cn } from '~/lib/utils';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { useEffect, useRef } from 'react';
import { EmbedCard } from './extensions/EmbedCard';
import { ExpandItem } from './extensions/ExpandItem';
import { ExpandList } from './extensions/ExpandList';
import { preprocessMarkdown } from './serializer';
import Toolbar from './Toolbar';

export type EditorBodyProps = {
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  className?: string;
};

export default function EditorBody({ value, onChange, onBlur, className }: EditorBodyProps) {
  const lastEmitted = useRef<string>(value ?? '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // codeBlock kept; horizontalRule kept; we use default config otherwise
      }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Image,
      Placeholder.configure({ placeholder: 'Skriv innhold her...' }),
      Markdown.configure({
        html: true,
        tightLists: true,
        linkify: true,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      ExpandList,
      ExpandItem,
      EmbedCard,
    ],
    content: preprocessMarkdown(value ?? ''),
    onUpdate: ({ editor }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const md = (editor.storage as any).markdown?.getMarkdown?.() ?? '';
      lastEmitted.current = md;
      onChange(md);
    },
    onBlur: () => onBlur?.(),
    editorProps: {
      attributes: {
        class: cn('prose prose-sm max-w-none focus:outline-none px-3 py-2 min-h-[200px] md:min-h-[300px]', 'dark:prose-invert'),
      },
    },
  });

  // Sync external value updates (e.g. form reset) into the editor.
  useEffect(() => {
    if (!editor) return;
    const incoming = value ?? '';
    if (incoming === lastEmitted.current) return;
    lastEmitted.current = incoming;
    editor.commands.setContent(preprocessMarkdown(incoming), { emitUpdate: false });
  }, [value, editor]);

  return (
    <div className={cn('flex flex-col rounded-md border bg-background', className)}>
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
