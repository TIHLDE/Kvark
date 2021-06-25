import { useState } from 'react';

// Material UI Components
import { TextField, TextFieldProps, Dialog, DialogTitle, DialogContent, IconButton, Typography, styled } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseRounded';

// Project components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';

const guide = `
  *Markdown* er en vanlig måte å formatere tekst på nettet og brukes også tihlde.org. Her følger en rekke eksempler på hvordan du kan legge inn overskrifter, lister, linker, bilder, osv. ved hjelp av vanlig Markdown. I tillegg kan du vise arrangement-, nyhet- og jobbannonse-kort, samt en utvid-boks.

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

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const HelpText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  textDecoration: 'underline',
}));

const MarkdownEditor = (props: TextFieldProps) => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const HelperText = () => (
    <>
      {Boolean(props.error && props.helperText) && (
        <>
          {props.helperText}
          <br />
        </>
      )}
      <HelpText onClick={() => setHelpDialogOpen(true)}>Hvordan formaterer jeg teksten?</HelpText>
    </>
  );

  return (
    <>
      <TextField
        {...props}
        fullWidth
        helperText={<HelperText />}
        InputLabelProps={{ shrink: true }}
        label={props.label || 'Beskrivelse'}
        margin='normal'
        maxRows={25}
        minRows={5}
        multiline
        variant={props.variant || 'outlined'}
      />
      {helpDialogOpen && (
        <Dialog aria-labelledby='format-dialog-title' fullWidth maxWidth='md' onClose={() => setHelpDialogOpen(false)} open={helpDialogOpen}>
          <DialogTitle id='format-dialog-title' sx={{ p: 2, m: 0 }}>
            <Typography variant='h3'>Formaterings-guide</Typography>
            <CloseButton aria-label='close' onClick={() => setHelpDialogOpen(false)}>
              <CloseIcon />
            </CloseButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            <MarkdownRenderer value={guide} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MarkdownEditor;
