import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Serivce imports
import AuthService from '../../api/services/AuthService';

// Imgs
import http404img from '../../assets/img/http404.gif';
import http404ropeImg from '../../assets/img/http404rope.gif';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = (theme) => ({
  root: {
    minHeight: '101vh',
    backgroundColor: theme.palette.colors.background.main,
  },
  img: {
    width: '100%',
    maxHeight: '70vh',
    objectFit: 'contain',
  },
  imgPadding: {
    paddingTop: '25px',
  },
  center: {
    textAlign: 'center',
  },
  textContainer: {
    margin: '15px auto',
  },
});

function Http404(props) {
  const { classes } = props;

  return (
    <Navigation className={classes.root} whitesmoke>
      <Helmet>
        <title>404 - TIHLDE</title>
      </Helmet>
      <Grid alignItems='center' className={classes.root} container direction='column' wrap='nowrap'>
        <div className={classes.center}>
          {AuthService.isAuthenticated() ? (
            <img alt='404' className={classes.img} src={http404ropeImg} />
          ) : (
            <img alt='404' className={classNames(classes.img, classes.imgPadding)} src={http404img} />
          )}
        </div>
        <div className={classes.center}>
          <h3>Denne siden finnes ikke :(</h3>
          <Button color='primary' onClick={() => window.history.back()} variant='contained'>
            Tilbake
          </Button>
          <p className={classes.textContainer}>
            Send oss gjerne en{' '}
            <a
              href='https://docs.google.com/forms/d/e/1FAIpQLSfp8ZUm-GfzMla0Hg4AeX0iO8HME8ez7TttY2MgUfpC8MzBIQ/viewform'
              rel='noopener noreferrer'
              target='_blank'>
              tilbakemelding
            </a>{' '}
            om du fulgte en gyldig lenke hit
          </p>
        </div>
      </Grid>
    </Navigation>
  );
}

Http404.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Http404);
