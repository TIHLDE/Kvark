import React, { useState } from 'react';
import { Event } from 'types/Types';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

// Project components
import EventRenderer from 'containers/EventDetails/components/EventRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.colors.text.main,
  },
  container: {
    padding: theme.spacing(2),
    background: theme.palette.colors.background.main,
  },
}));

export type EventPreviewProps = {
  className?: string;
  getEvent: () => Event;
};

const EventPreview = ({ className, getEvent }: EventPreviewProps) => {
  const classes = useStyles();
  const [event, setEvent] = useState<Event | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const Transition = React.forwardRef(function Transition(props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) {
    return <Slide direction='up' ref={ref} {...props} />;
  });

  const handleClickOpen = () => {
    setEvent(getEvent());
    setIsOpen(true);
  };

  return (
    <>
      <Button className={className || ''} color='primary' onClick={handleClickOpen} variant='outlined'>
        Forhåndsvis
      </Button>
      {isOpen && event && (
        <Dialog fullWidth maxWidth='lg' onClose={() => setIsOpen(false)} open={isOpen} TransitionComponent={Transition}>
          <DialogTitle className={classes.appBar} disableTypography>
            <Typography variant='h3'>Forhåndsvisning</Typography>
            <IconButton aria-label='close' className={classes.closeButton} color='inherit' edge='start' onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.container}>
            <EventRenderer event={event} preview />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EventPreview;
