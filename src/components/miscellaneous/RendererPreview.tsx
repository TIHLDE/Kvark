import { useState, forwardRef, Ref, ReactElement, FunctionComponent } from 'react';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

const useStyles = makeStyles((theme: Theme) => ({
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

// eslint-disable-next-line comma-spacing
const RendererPreview = <Type,>({ className, getContent, renderer: Renderer }: RendererPreviewProps<Type>) => {
  const classes = useStyles();
  const [content, setContent] = useState<Type | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const Transition = forwardRef(function Transition(props: TransitionProps & { children?: ReactElement }, ref: Ref<unknown>) {
    return <Slide direction='up' ref={ref} {...props} />;
  });

  const handleClickOpen = () => {
    setContent(getContent());
    setIsOpen(true);
  };

  return (
    <>
      <Button className={className || ''} color='primary' onClick={handleClickOpen} variant='outlined'>
        Forhåndsvis
      </Button>
      {isOpen && content && (
        <Dialog fullWidth maxWidth='lg' onClose={() => setIsOpen(false)} open={isOpen} TransitionComponent={Transition}>
          <DialogTitle className={classes.appBar} disableTypography>
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
