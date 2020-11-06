import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import URLS from 'URLS';
import { usePalette } from 'react-palette';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';

// Service imports
import { useEventById } from 'api/hooks/Event';

// Project components
import Navigation from 'components/navigation/Navigation';
import EventRenderer from 'containers/EventDetails/components/EventRenderer';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    margin: 'auto',
    padding: theme.spacing(10, 5, 5),
    position: 'relative',
    color: theme.palette.colors.text.main,
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
      borderBottom: 'solid 100px ' + theme.palette.colors.background.main,
      borderLeft: '100vw solid rgba(0,0,0,0)',
      content: '""',
      [theme.breakpoints.down('sm')]: {
        borderBottom: 'solid 50px ' + theme.palette.colors.background.main,
      },
    },
  },
  topInner: {
    height: 350,
    padding: theme.spacing(8),
    transition: '3s',
    background: theme.palette.colors.gradient.main.top,
    [theme.breakpoints.down('sm')]: {
      height: 250,
    },
    [theme.breakpoints.down('xs')]: {
      height: 200,
    },
  },
}));

function EventDetails() {
  const classes = useStyles();
  const { id } = useParams();
  const [event, error] = useEventById(Number(id));
  const navigate = useNavigate();
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    if (error) {
      navigate(URLS.events);
    }
    // To avoid scroll to top on every event-change. It only happens if the title has changed
    if (event && event.title !== eventTitle) {
      setEventTitle(event.title);
      navigate(`${URLS.events}${id}/${urlEncode(event.title)}/`, { replace: true });
    }
  }, [id, eventTitle, event, navigate, error]);

  // Find a dominant color in the image, uses a proxy to be able to retrieve images with CORS-policy until all images are stored in our own server
  const { data } = usePalette(
    event
      ? `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(event.image || '')}`
      : '',
  );

  return (
    <Navigation
      banner={
        <div className={classes.top}>
          <div className={classes.topInner} style={{ background: data.muted ? data.muted : '' }} />
        </div>
      }
      fancyNavbar
      isLoading={!event}
      whitesmoke>
      {event && (
        <>
          <Helmet>
            <title>{event.title} - TIHLDE</title>
            <meta content={event.title} property='og:title' />
            <meta content='website' property='og:type' />
            <meta content={window.location.href} property='og:url' />
            <meta content={event.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
          </Helmet>
          <div className={classes.wrapper}>
            <EventRenderer event={event} />
          </div>
        </>
      )}
    </Navigation>
  );
}

export default EventDetails;
