import classnames from 'classnames';
import parseISO from 'date-fns/parseISO';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils';
import { JobPost } from 'types/Types';
import { Groups } from 'types/Enums';
import URLS from 'URLS';
import { HavePermission } from 'api/hooks/User';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

// Project Components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import DetailContent, { DetailContentLoading } from 'components/miscellaneous/DetailContent';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridGap: theme.spacing(2),
    alignItems: 'self-start',
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  image: {
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  infoBox: {
    marginBottom: theme.spacing(2),
  },
  button: {
    height: 50,
    marginBottom: theme.spacing(2),
  },
  skeleton: {
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
  },
}));

export type JobPostRendererProps = {
  data: JobPost;
  preview?: boolean;
};

const JobPostRenderer = ({ data, preview = false }: JobPostRendererProps) => {
  const classes = useStyles();
  const deadline = formatDate(parseISO(data.deadline));
  const publishedAt = formatDate(parseISO(data.created_at));

  return (
    <div className={classes.grid}>
      <Paper>
        <Typography gutterBottom variant='caption'>
          Publisert: {publishedAt}
        </Typography>
        <Typography className={classes.title} gutterBottom variant='h1'>
          {data.title}
        </Typography>
        <MarkdownRenderer value={data.ingress} />
        <MarkdownRenderer value={data.body} />
      </Paper>
      <div>
        <div className={classes.infoBox}>
          <AspectRatioImg alt={data.image_alt || data.title} imgClassName={classes.image} src={data.image} />
        </div>
        <Paper className={classes.infoBox}>
          <DetailContent info={data.company} title='Bedrift: ' />
          <DetailContent info={deadline} title='Søknadsfrist: ' />
          <DetailContent info={data.location} title='Sted: ' />
          {data.email && (
            <DetailContent
              info={
                <a href={`mailto:${data.email}`} rel='noreferrer' target='_blank'>
                  {data.email}
                </a>
              }
              title='Kontakt: '
            />
          )}
        </Paper>
        {data.link && (
          <Button className={classes.button} color='primary' component='a' fullWidth href={data.link} rel='noreferrer' target='_blank' variant='contained'>
            Søk
          </Button>
        )}
        {!preview && (
          <HavePermission groups={[Groups.HS, Groups.INDEX, Groups.NOK]}>
            <Button className={classes.button} color='primary' component={Link} fullWidth to={`${URLS.jobpostsAdmin}${data.id}/`} variant='outlined'>
              Endre annonse
            </Button>
          </HavePermission>
        )}
      </div>
    </div>
  );
};

export default JobPostRenderer;

export const JobPostRendererLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      <Paper>
        <Skeleton className={classes.skeleton} width={200} />
        <Skeleton className={classes.skeleton} height={80} width='60%' />
        <Skeleton className={classes.skeleton} height={40} width={250} />
        <Skeleton className={classes.skeleton} height={40} width='80%' />
        <Skeleton className={classes.skeleton} height={40} width='85%' />
        <Skeleton className={classes.skeleton} height={40} width='75%' />
        <Skeleton className={classes.skeleton} height={40} width='90%' />
      </Paper>
      <div>
        <Skeleton className={classnames(classes.infoBox, classes.image)} height={150} variant='rect' width='100%' />
        <Paper className={classes.infoBox}>
          <DetailContentLoading />
          <DetailContentLoading />
        </Paper>
      </div>
    </div>
  );
};
