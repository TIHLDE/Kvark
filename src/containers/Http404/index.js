import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
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
    backgroundColor: theme.colors.background.main,
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

class Http404 extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {classes} = this.props;
    return (
      <Navigation footer whitesmoke className={classes.root}>
        <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
          <div className={classes.center}>
            {AuthService.isAuthenticated() ?
              <img src={http404ropeImg} alt="404" className={classes.img} /> :
              <img src={http404img} alt="404" className={classNames(classes.img, classes.imgPadding)} />
            }
          </div>
          <div className={classes.center}>
            <h3>Denne siden finnes ikke :(</h3>
            <Button variant='contained' color='primary' onClick={() => window.history.back()}>Tilbake</Button>
            <p className={classes.textContainer}>Send oss gjerne en <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/e/1FAIpQLSfp8ZUm-GfzMla0Hg4AeX0iO8HME8ez7TttY2MgUfpC8MzBIQ/viewform">tilbakemelding</a> om du fulgte en gyldig lenke hit</p>
          </div>
        </Grid>
      </Navigation>
    );
  }
}

Http404.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Http404);
