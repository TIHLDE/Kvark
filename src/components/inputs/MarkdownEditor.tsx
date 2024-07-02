import { cn } from 'lib/utils';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import { Button } from 'components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from 'components/ui/form';
import { Label } from 'components/ui/label';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { ScrollArea } from 'components/ui/scroll-area';
import { Textarea } from 'components/ui/textarea';

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

  ## **Mellomrom**

  Tekst før mellomrom

  &nbsp;  

  Tekst etter mellomrom

  ~~~
  &nbsp;
  Det må være to mellomrom etter &nbsp; for at det skal fungere
  (&nbsp;  )
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

  ~~~
  Med tall:
  1. Første element
  2. Andre element
  3. Tredje element

  Uten tall:
  - Første element
  - Andre element
  - Tredje element
  ~~~

  ___

  ## **Delelinje**

  ___

  ~~~
  ___
  ~~~

  ___
  
  ## **Kodeblokk**

  \`Kodeblokk på en linje\`

  ~~~
  En linje:
  \`Kodeblokk på en linje\`

  Flere linjer:
  \`\`\`
  const party = new Party();
  party.start();

  party.stop();
  \`\`\`
  ~~~

  ___
  
  ## **Utvid**

  ~~~expandlist
  \`\`\`expand
  Tittel 1::Innhold som kan **styles** på samme måte som resten
  \`\`\`
  \`\`\`expand
  Tittel 2::Innhold som kan _styles_ på samme måte som resten
  \`\`\`
  ~~~

  Utvid-bokser må ligge inne i en \`expandlist\`:

  \`\`\`
  ~~~expandlist
  // Utvid-bokser her
  ~~~
  \`\`\`
  
  Utvid-bokser inneholder en tittel og innhold som separeres med \`::\`:

  \`\`\`
  ~~~expandlist
    \`\`\`expand
    Tittel 1::Innhold som kan **styles** på samme måte som resten
    \`\`\`
    \`\`\`expand
    Tittel 2::Innhold som kan _styles_ på samme måte som resten
    \`\`\`
  ~~~
  \`\`\`

  ___

  ## **Arrangement- / Nyhet- / Annonse-kort**
  
  \`\`\`event
  19
  \`\`\`
  
  Kort med link til arrangementer, nyheter og annonser kan opprettes ved å skrive \`type\` kort og \`id\` til for eksempel arrangement inni:

  *Arrangement:*
  ~~~
  \`\`\`event
  19
  \`\`\`
  ~~~
  
  *Jobbannonse:*
  ~~~
  \`\`\`jobpost
  19
  \`\`\`
  ~~~
  
  *Nyhet:*
  ~~~
  \`\`\`news
  19
  \`\`\`
  ~~~
  `;

type MarkdownEditorProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean;
  className?: string;
};

const MarkdownEditor = <TFormValues extends FieldValues>({ form, name, label, required, className }: MarkdownEditorProps<TFormValues>) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <Label>
              {label} {required && <span className='text-red-300'>*</span>}
            </Label>
            <FormControl>
              <Textarea className={cn('w-full h-[200px] md:h-[300px]', className)} placeholder='Skriv innhold her...' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ResponsiveDialog
        description='Markdown er en vanlig måte å formatere tekst på nettet og brukes også på tihlde.org. Her følger en rekke eksempler på hvordan du kan legge inn overskrifter, lister, linker, bilder, osv. ved hjelp av vanlig Markdown. I tillegg kan du vise arrangement-, nyhet- og jobbannonse-kort, samt en utvid-boks.'
        title='Formaterings-guide'
        trigger={
          <Button className='justify-start' variant='link'>
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
