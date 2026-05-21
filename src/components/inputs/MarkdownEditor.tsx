import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Button } from '~/components/ui/button';
import { FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/utils';
import { lazy, Suspense } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

const EditorBody = lazy(() => import('./markdown-editor/EditorBody'));

const guide = `
  ___

  ## **Overskrifter**

  # Stor overskrift
  ## Mindre overskrift

  ~~~
  # Stor overskrift
  ## Mindre overskrift
  ~~~

  ___

  ## **Typografi**

  **Fet tekst**
  _Kursiv tekst_
  _**Fet og kursiv tekst**_

  ~~~
  **Fet tekst**
  _Kursiv tekst_
  _**Fet og kursiv tekst**_
  ~~~

  ___

  ## **Link og bilde**

  [tihlde.org](https://tihlde.org)

  ~~~
  Link:
  [tihlde.org](https://tihlde.org)

  Bilde:
  ![alternativ tekst](https://tihlde.org/image.jpg)
  ~~~

  ___

  ## **Sitat**

  > Sitat som får et innrykk

  ~~~
  > Sitat som får et innrykk
  ~~~

  ___

  ## **Liste**

  Med tall:
  1. Første element
  2. Andre element
  3. Tredje element

  Uten tall:
  - Første element
  - Andre element
  - Tredje element

  ___

  ## **Utvid og kort**

  Bruk knappene i verktøylinjen for å sette inn utvid-lister og arrangement-, jobbannonse- eller nyhet-kort. Du kan også skrive det selv:

  ~~~expandlist
  \`\`\`expand
  Tittel 1::Innhold som kan **styles** på samme måte som resten
  \`\`\`
  ~~~

  \`\`\`event
  19
  \`\`\`
  `;

type MarkdownEditorProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean;
  className?: string;
};

const EditorFallback = ({ className }: { className?: string }) => (
  <div className={cn('rounded-md border bg-background', className)}>
    <Skeleton className='h-9 w-full rounded-b-none' />
    <Skeleton className='h-[200px] md:h-[300px] w-full rounded-t-none' />
  </div>
);

const MarkdownEditor = <TFormValues extends FieldValues>({ form, name, label, required, className }: MarkdownEditorProps<TFormValues>) => {
  return (
    <div className='space-y-1'>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <Label>
              {label} {required && <span className='text-red-300'>*</span>}
            </Label>
            <Suspense fallback={<EditorFallback className={className} />}>
              <EditorBody className={className} onBlur={field.onBlur} onChange={field.onChange} value={(field.value as string | undefined) ?? ''} />
            </Suspense>
            <FormMessage />
          </FormItem>
        )}
      />
      <ResponsiveDialog
        description='Bruk verktøylinjen for å formatere tekst, sette inn lenker og bilder, samt legge til utvid-lister og kort for arrangement, jobbannonse eller nyhet. Her er en oversikt over hva som er mulig.'
        title='Formaterings-guide'
        trigger={
          <Button className='justify-start px-0' variant='link'>
            Hvordan formaterer jeg teksten?
          </Button>
        }>
        <ScrollArea className='w-full h-[60vh] pr-4'>
          <MarkdownRenderer value={guide} />
        </ScrollArea>
      </ResponsiveDialog>
    </div>
  );
};

export default MarkdownEditor;
