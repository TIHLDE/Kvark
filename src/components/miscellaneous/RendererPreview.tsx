import CloseIcon from '@mui/icons-material/CloseRounded';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { makeStyles } from 'makeStyles';
import { forwardRef, FunctionComponent, ReactElement, Ref, useState } from 'react';

const useStyles = makeStyles()((theme) => ({
  appBar: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  container: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
}));

export type RendererPreviewProps<Type> = {
  className?: string;
  getContent: () => Type;
  renderer: FunctionComponent<{ preview: boolean; data: Type }>;
};

const RendererPreview = <Type extends unknown>({ className, getContent, renderer: Renderer }: RendererPreviewProps<Type>) => {
  const { classes } = useStyles();
  const [content, setContent] = useState<Type | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const Transition = forwardRef(function Transition(props: TransitionProps & { children: ReactElement }, ref: Ref<unknown>) {
    return <Slide direction='up' ref={ref} {...props} />;
  });

  const handleClickOpen = () => {
    setContent(getContent());
    setIsOpen(true);
  };

  return (
    <>
      <Button className={className || ''} onClick={handleClickOpen} variant='outlined'>
        Forhåndsvis
      </Button>
      {isOpen && content && (
        <Dialog fullWidth maxWidth='lg' onClose={() => setIsOpen(false)} open={isOpen} TransitionComponent={Transition}>
          <DialogTitle className={classes.appBar}>
            <Typography variant='h3'>Forhåndsvisning</Typography>
            <IconButton aria-label='close' className={classes.closeButton} color='inherit' edge='start' onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.container}>
            <Renderer data={content} preview />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RendererPreview;
