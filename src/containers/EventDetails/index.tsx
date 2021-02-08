import { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import URLS from 'URLS';
import { usePalette } from 'react-palette';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';
import { useEventById } from 'api/hooks/Event';

// Project components
import Http404 from 'containers/Http404';
import Navigation from 'components/navigation/Navigation';
import EventRenderer, { EventRendererLoading } from 'containers/EventDetails/components/EventRenderer';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    margin: 'auto',
    position: 'relative',
    color: theme.palette.text.primary,
    padding: theme.spacing(10),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(10, 5),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(10, 0, 5, 0),
    },
  },
  top: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',

    '&::after': {
      position: 'absolute',
      bottom: 0,
      borderBottom: 'solid 100px ' + theme.palette.background.default,
      borderLeft: '100vw solid rgba(0,0,0,0)',
      content: '""',
      [theme.breakpoints.down('sm')]: {
        borderBottom: 'solid 50px ' + theme.palette.background.default,
      },
    },
  },
  topInner: {
    height: 350,
    padding: theme.spacing(8),
    transition: '3s',
    background: theme.palette.colors.gradient.main.top,
    [theme.breakpoints.down('sm')]: {
      height: 230,
    },
    [theme.breakpoints.down('xs')]: {
      height: 200,
    },
  },
}));

function EventDetails() {
  const classes = useStyles();
  const { id } = useParams();
  const { data, isLoading, isError } = useEventById(Number(id));
  const navigate = useNavigate();
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    // To avoid scroll to top on every event-change. It only happens if the title has changed
    if (data && data.title !== eventTitle) {
      setEventTitle(data.title);
      navigate(`${URLS.events}${id}/${urlEncode(data.title)}/`, { replace: true });
    }
  }, [id, eventTitle, data, navigate]);

  // Find a dominant color in the image, uses a proxy to be able to retrieve images with CORS-policy until all images are stored in our own server
  const { data: palette } = usePalette(
    data
      ? `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(data.image || '')}`
      : '',
  );

  if (isError) {
    return <Http404 />;
  }

  return (
    <Navigation
      banner={
        <div className={classes.top}>
          <div className={classes.topInner} style={{ background: palette.muted ? palette.muted : '' }} />
        </div>
      }
      fancyNavbar>
      {data && (
        <Helmet>
          <title>{data.title} - TIHLDE</title>
          <meta content={data.title} property='og:title' />
          <meta content='website' property='og:type' />
          <meta content={window.location.href} property='og:url' />
          <meta content={data.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
        </Helmet>
      )}
      <div className={classes.wrapper}>{isLoading ? <EventRendererLoading /> : data !== undefined && <EventRenderer data={data} />}</div>
    </Navigation>
  );
}

export default EventDetails;
