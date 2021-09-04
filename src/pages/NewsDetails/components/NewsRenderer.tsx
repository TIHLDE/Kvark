import parseISO from 'date-fns/parseISO';
import { formatDate } from 'utils';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { usePalette } from 'react-palette';
import { News } from 'types/Types';
import { PermissionApp } from 'types/Enums';
import { HavePermission } from 'hooks/User';

// Material UI Components
import { makeStyles } from '@mui/styles';
import { Typography, Button, Skeleton } from '@mui/material';

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
    transition: 'background 1s',
    [theme.breakpoints.down('lg')]: {
      paddingBottom: theme.spacing(15),
    },
  },
  topContent: {
    padding: theme.spacing(0, 5),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0, 3),
    },
  },
  content: {
    display: 'grid',
    gridGap: theme.spacing(2),
    marginTop: `-${theme.spacing(18)}`,
    [theme.breakpoints.down('lg')]: {
      marginTop: `-${theme.spacing(13)}`,
      gridGap: theme.spacing(1),
    },
  },
  title: {
    wordWrap: 'break-word',
    [theme.breakpoints.down('lg')]: {
      fontSize: '2.3rem',
    },
    padding: theme.spacing(1, 0),
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
            <Button component={Link} fullWidth to={`${URLS.newsAdmin}${data.id}/`} variant='outlined'>
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
          <Skeleton height={80} width='60%' />
          <Skeleton height={40} width={250} />
        </Container>
      </div>
      <Container className={classes.content} maxWidth='lg'>
        <AspectRatioLoading imgClassName={classes.image} />
        <Skeleton height={40} width={250} />
        <Paper>
          <Skeleton width='80%' />
          <Skeleton width='85%' />
          <Skeleton width='75%' />
          <Skeleton width='90%' />
        </Paper>
      </Container>
    </div>
  );
};
