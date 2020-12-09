import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import URLS from '../../URLS';
import { usePalette } from 'react-palette';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from '../../utils';

// Service imports
import { useNewsById } from '../../api/hooks/News';

// Project components
import Navigation from '../../components/navigation/Navigation';
import NewsRenderer from './components/NewsRenderer';
import TIHLDELOGO from '../../assets/img/TihldeBackground.jpg';

const styles = (theme) => ({
  root: {
    minHeight: '90vh',
  },
  wrapper: {
    maxWidth: 1100,
    margin: 'auto',
    padding: '60px 48px 48px 48px',
    position: 'relative',

    '@media only screen and (max-width: 1000px)': {
      padding: '60px 0px 48px 0px',
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
    padding: 60,
    transition: '3s',
    background: theme.palette.colors.gradient.main.top,
    [theme.breakpoints.down('sm')]: {
      height: 230,
    },
    [theme.breakpoints.down('xs')]: {
      height: 200,
    },
  },
});

function NewsDetails(props) {
  const { classes } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsData, error] = useNewsById(Number(id));

  useEffect(() => {
    if (error) {
      navigate(URLS.news);
    }
    if (newsData) {
      navigate(`${URLS.news}${id}/${urlEncode(newsData.title)}/`, { replace: true });
    }
  }, [id, navigate, newsData, error]);

  // Find a dominant color in the image, uses a proxy to be able to retrieve images with CORS-policy until all images are stored in our own server
  const { data } = usePalette(
    newsData
      ? `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(newsData?.image)}`
      : '',
  );

  return (
    <Navigation fancyNavbar isLoading={!newsData} whitesmoke>
      {newsData && (
        <div className={classes.root}>
          <Helmet>
            <title>{newsData.title} - TIHLDE</title>
            <meta content={newsData.title} property='og:title' />
            <meta content='website' property='og:type' />
            <meta content={window.location.href} property='og:url' />
            <meta content={newsData.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
          </Helmet>
          <div className={classes.top}>
            <div className={classes.topInner} style={{ background: data.muted ? data.muted : '' }}></div>
          </div>
          <div className={classes.wrapper}>
            <NewsRenderer newsData={newsData} />
          </div>
        </div>
      )}
    </Navigation>
  );
}

NewsDetails.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NewsDetails);
