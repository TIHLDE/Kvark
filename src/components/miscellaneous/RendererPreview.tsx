import CloseIcon from '@mui/icons-material/CloseRounded';
import { Button, ButtonProps, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { FunctionComponent, useState } from 'react';

export type RendererPreviewProps<Type> = ButtonProps & {
  /** Function to be runned to get the data which can be passed to the renderer-component */
  getContent: () => Type;
  /** Component which renders a preview of the given content */
  renderer: FunctionComponent<{ preview: boolean; data: Type }>;
};

/**
 * Preview content. Generic which means that is supports all types as long as it has a component
 * which can be passed the data to preview through the `data`-prop and a `preview`-prop set to `true`.
 */
const RendererPreview = <Type extends unknown>({ getContent, renderer: Renderer, ...props }: RendererPreviewProps<Type>) => {
  const [content, setContent] = useState<Type | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setContent(getContent());
    setIsOpen(true);
  };

  return (
    <>
      <Button variant='outlined' {...props} onClick={handleClickOpen}>
        Forhåndsvis
      </Button>
      {isOpen && content && (
        <Dialog fullWidth maxWidth='lg' onClose={() => setIsOpen(false)} open={isOpen}>
          <DialogTitle sx={{ p: 2 }}>
            <Typography variant='h3'>Forhåndsvisning</Typography>
            <IconButton
              aria-label='Lukk forhåndsvisning'
              color='inherit'
              edge='start'
              onClick={() => setIsOpen(false)}
              sx={{ position: 'absolute', right: ({ spacing }) => spacing(1), top: ({ spacing }) => spacing(1), color: ({ palette }) => palette.text.primary }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2, background: ({ palette }) => palette.background.default }}>
            <Renderer data={content} preview />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RendererPreview;
