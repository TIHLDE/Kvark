import parseISO from 'date-fns/parseISO';
import { formatDate } from 'utils';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { usePalette } from 'react-palette';
import { News } from 'types/Types';
import { PermissionApp } from 'types/Enums';
import { HavePermission } from 'api/hooks/User';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

// Project Components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import Paper from 'components/layout/Paper';
import Container from 'components/layout/Container';
import ShareButton from 'components/miscellaneous/ShareButton';

const useStyles = makeStyles((theme) => ({
  image: {
    borderRadius: theme.shape.borderRadius,
  },
  top: {
    color: theme.palette.common.white,
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(20),
    background: theme.palette.colors.gradient.main.top,
    transition: '3s',
    [theme.breakpoints.down('md')]: {
      paddingBottom: theme.spacing(15),
    },
  },
  topContent: {
    padding: theme.spacing(0, 5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 3),
    },
  },
  content: {
    display: 'grid',
    gridGap: theme.spacing(2),
    marginTop: -theme.spacing(18),
    [theme.breakpoints.down('md')]: {
      marginTop: -theme.spacing(13),
      gridGap: theme.spacing(1),
    },
  },
  title: {
    wordWrap: 'break-word',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.3rem',
    },
    padding: theme.spacing(1, 0),
  },
  skeleton: {
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    height: 50,
  },
  shareButton: {
    width: 'fit-content',
    marginRight: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export type NewsRendererProps = {
  data: News;
  preview?: boolean;
};
const NewsRenderer = ({ data, preview = false }: NewsRendererProps) => {
  const classes = useStyles();

  // Find a dominant color in the image, uses a proxy to be able to retrieve images with CORS-policy until all images are stored in our own server
  const { data: palette } = usePalette(
    data?.image
      ? `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(data.image || '')}`
      : '',
  );

  return (
    <div>
      <div className={classes.top} style={{ background: palette.muted ? palette.muted : '' }}>
        <Container className={classes.topContent} maxWidth='lg'>
          <Typography className={classes.title} variant='h1'>
            {data.title}
          </Typography>
          <Typography gutterBottom variant='h3'>
            {data.header}
          </Typography>
        </Container>
      </div>
      <Container className={classes.content} maxWidth='lg'>
        <AspectRatioImg alt={data.image_alt || data.title} imgClassName={classes.image} src={data.image} />
        {!preview && (
          <HavePermission apps={[PermissionApp.NEWS]}>
            <Button className={classes.button} color='primary' component={Link} fullWidth to={`${URLS.newsAdmin}${data.id}/`} variant='outlined'>
              Endre nyhet
            </Button>
          </HavePermission>
        )}
        <div className={classes.flex}>
          <ShareButton className={classes.shareButton} shareId={data.id} shareType='news' title={data.title} />
          <Typography variant='subtitle2'>Publisert: {formatDate(parseISO(data.created_at))}</Typography>
        </div>
        <Paper>
          <MarkdownRenderer value={data.body} />
        </Paper>
      </Container>
    </div>
  );
};

export default NewsRenderer;

export const NewsRendererLoading = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.top}>
        <Container className={classes.topContent} maxWidth='lg'>
          <Skeleton className={classes.skeleton} width={200} />
          <Skeleton className={classes.skeleton} height={80} width='60%' />
          <Skeleton className={classes.skeleton} height={40} width={250} />
        </Container>
      </div>
      <Container className={classes.content} maxWidth='lg'>
        <AspectRatioLoading imgClassName={classes.image} />
        <Paper>
          <Skeleton className={classes.skeleton} width='80%' />
          <Skeleton className={classes.skeleton} width='85%' />
          <Skeleton className={classes.skeleton} width='75%' />
          <Skeleton className={classes.skeleton} width='90%' />
        </Paper>
      </Container>
    </div>
  );
};
