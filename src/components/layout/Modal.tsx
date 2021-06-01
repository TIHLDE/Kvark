import { ReactNode } from 'react';
import classNames from 'classnames';

// Material-ui
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import MaterialModal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    maxWidth: 460,
    minWidth: 320,
    maxHeight: '75%',
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    top: '50%',
    'overflow-y': 'auto',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  content: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    'overflow-y': 'auto',
  },
  header: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));
export type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  open: boolean;
  header?: string;
  closeText?: string;
};

const Modal = ({ className, open = false, onClose, children, header, closeText = 'Lukk' }: ModalProps) => {
  const classes = useStyles();
  return (
    <MaterialModal onClose={onClose} open={open}>
      <>
        <Paper className={classNames(classes.paper, className)} noPadding>
          <div className={classes.content}>
            {header && (
              <Typography className={classes.header} variant='h2'>
                {header}
              </Typography>
            )}
            {children}
            <Button className={classes.button} color='primary' onClick={onClose}>
              {closeText}
            </Button>
          </div>
        </Paper>
      </>
    </MaterialModal>
  );
};

export default Modal;
