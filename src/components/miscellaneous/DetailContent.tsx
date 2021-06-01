import { ReactNode } from 'react';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  text: {
    color: theme.palette.text.primary,
  },
  skeleton: {
    maxWidth: '100%',
  },
}));

export type DetailContentProps = {
  title: string | ReactNode;
  info: string | ReactNode;
};

const DetailContent = ({ title, info }: DetailContentProps) => {
  const classes = useStyles();
  return (
    <Typography className={classes.text} variant='subtitle1'>
      <b>{title}</b> {info}
    </Typography>
  );
};

export default DetailContent;

export const DetailContentLoading = () => {
  const classes = useStyles();
  return (
    <DetailContent
      info={<Skeleton className={classes.skeleton} height={30} width={140} />}
      title={<Skeleton className={classes.skeleton} height={30} width={80} />}
    />
  );
};
