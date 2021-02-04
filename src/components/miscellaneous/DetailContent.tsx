import { ReactNode } from 'react';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  detail: {
    width: 'auto',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
  },
  detailTitle: {
    marginRight: theme.spacing(0.5),
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  detailInfo: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
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
    <Grid alignItems='center' className={classes.detail} container justify='flex-start' wrap='nowrap'>
      <Typography className={classes.detailTitle} variant='subtitle1'>
        {title}
      </Typography>
      <Typography className={classes.detailInfo} variant='subtitle1'>
        {info}
      </Typography>
    </Grid>
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
