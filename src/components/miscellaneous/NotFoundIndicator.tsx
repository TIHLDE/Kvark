import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Assets
import NotFoundIcon from 'assets/icons/empty.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    margin: theme.spacing(1),
  },
}));

export type NotFoundIndicatorProps = {
  header: string;
  subtitle?: string;
};

const NotFoundIndicator = ({ header, subtitle }: NotFoundIndicatorProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img alt={header} height={100} src={NotFoundIcon} />
      <Typography className={classes.header} variant='h3'>
        {header}
      </Typography>
      {subtitle && <Typography variant='subtitle1'>{subtitle}</Typography>}
    </div>
  );
};

export default NotFoundIndicator;
