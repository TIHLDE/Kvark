// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Icons
import CloseIcon from '@material-ui/icons/CloseRounded';

// Project components
import Container from 'components/layout/Container';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'auto',
    minHeight: 40,
    position: 'absolute',
  },
  flex: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
  },
  content: {
    width: '100%',
    height: '100%',
  },
  snackbar: {
    top: 0,
    left: '50%',
    right: 'auto',
    transform: 'translateX(-50%)',
  },
  color: {
    color: theme.palette.common.white,
  },
}));

export type SnackProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  className?: string;
};

const Snack = ({ open, message, onClose, className }: SnackProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} className={classes.snackbar} open={open}>
        <SnackbarContent
          className={className}
          message={
            <Container className={classes.flex}>
              <div className='pulse' />
              <Typography className={classes.color} color='inherit' variant='subtitle1'>
                {message}
              </Typography>
              <IconButton className={classes.color} color='inherit' onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Container>
          }
        />
      </Snackbar>
    </div>
  );
};

export default Snack;
