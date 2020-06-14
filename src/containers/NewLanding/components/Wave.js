import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

// Services
import AuthService from '../../../api/services/AuthService';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Images
import TIHLDELOGO from '../../../assets/img/TIHLDE_LOGO.png';
import WaveTopLight from '../../../assets/img/waves/wave-top-light.png';
import WaveMidLight from '../../../assets/img/waves/wave-mid-light.png';
import WaveBottomLight from '../../../assets/img/waves/wave-bottom-light.png';
import WaveTopDark from '../../../assets/img/waves/wave-top-dark.png';
import WaveMidDark from '../../../assets/img/waves/wave-mid-dark.png';
import WaveBottomDark from '../../../assets/img/waves/wave-bottom-dark.png';

// Project Components
import URLS from '../../../URLS';

const style = (theme) => ({
  topInner: {
    margin: 'auto',
    maxWidth: '1000px',
    padding: '150px 15px 100px',
    position: 'relative',
    zIndex: '20',
  },
  topSmallText: {
    color: theme.colors.gradient.main.text,
    margin: '10px auto',
    '@media only screen and (max-width: 800px)': {
      fontSize: '1.05rem',
    },
  },
  topLogoContainer: {
    display: 'flex',
  },
  topLogo: {
    margin: '0 auto',
    width: '70vw',
    maxWidth: '450px',
    minWidth: '250px',
    objectFit: 'contain',
  },
  topButtonContainer: {
    margin: '20px auto 0',
    display: 'flex',
    justifyContent: 'center',
  },
  topButton: {
    color: theme.colors.text.main,
    backgroundColor: theme.colors.background.light,
    '&:hover': {
      backgroundColor: theme.colors.background.light + 'bb',
    },
    margin: 'auto 10px',
  },
  topLink: {
    textDecoration: 'none',
  },
  topButtonSecondary: {
    color: theme.colors.gradient.main.text,
    '&:hover': {
      color: theme.colors.gradient.main.text + 'bb',
    },
    textDecoration: 'none',
    margin: 'auto 10px',
  },
  '@keyframes moveWave': {
    '0%': {
      transform: 'translateX(0) translateZ(0) scaleY(1)',
    },
    '50%': {
      transform: 'translateX(-25%) translateZ(0) scaleY(0.55)',
    },
    '100%': {
      transform: 'translateX(-50%) translateZ(0) scaleY(1)',
    },
  },
  waveWrapper: {
    overflow: 'hidden',
    margin: 'auto',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  waveWrapperInner: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
    minHeight: 500,
    top: 0,
    background: 'linear-gradient(20deg, ' + theme.colors.gradient.main.bottom + ' 20%, ' + theme.colors.gradient.main.top + ' 80%)',
  },
  bgTop: {
    zIndex: 15,
    opacity: 0.5,
  },
  bgMiddle: {
    zIndex: 10,
    opacity: 0.75,
  },
  wave: {
    position: 'absolute',
    left: 0,
    width: '200%',
    height: '100%',
    backgroundRepeat: 'repeat no-repeat',
    backgroundPosition: '0 bottom',
    transformOrigin: 'center bottom',
  },
  waveTop: {
    backgroundSize: '80% 100px',
    backgroundImage: theme.palette.type === 'dark' ? `url(${WaveTopDark})` : `url(${WaveTopLight})`,
    // eslint-disable-next-line quotes
    animation: `$moveWave 60s linear alternate infinite`,
    '@media only screen and (max-width: 500px)': {
      backgroundSize: '80% 40px',
    },
  },
  waveMiddle: {
    backgroundSize: '60% 120px',
    backgroundImage: theme.palette.type === 'dark' ? `url(${WaveMidDark})` : `url(${WaveMidLight})`,
    // eslint-disable-next-line quotes
    animation: `$moveWave 20s linear alternate infinite`,
    '@media only screen and (max-width: 500px)': {
      backgroundSize: '60% 60px',
    },
  },
  waveBottom: {
    backgroundSize: '60% 100px',
    backgroundImage: theme.palette.type === 'dark' ? `url(${WaveBottomDark})` : `url(${WaveBottomLight})`,
    // eslint-disable-next-line quotes
    animation: `$moveWave 25s linear alternate infinite`,
    '@media only screen and (max-width: 500px)': {
      backgroundSize: '60% 50px',
    },
  },
});

const Wave = (props) => {
  const {classes} = props;

  return (
    <div className="waveWrapper waveAnimation">
      <div className={classes.topInner}>
        <div className={classes.topLogoContainer} style={{display: 'flex'}}>
          <img className={classes.topLogo} src={TIHLDELOGO} alt='TIHLDE_LOGO' />
        </div>
        <Typography variant='h6' align='center' className={classes.topSmallText}>Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Drift av datasystemer og Digital samhandling ved NTNU</Typography>
        {AuthService.isAuthenticated() ?
          <div className={classes.topButtonContainer}>
            <Button component={Link} to={URLS.profile} className={classes.topButton} variant='contained' color='inherit'>Min side</Button>
          </div> :
          <div className={classes.topButtonContainer}>
            <Button component={Link} to={URLS.login} className={classes.topButton} variant='contained' color='inherit'>Logg inn</Button>
            <Button component={Link} to={URLS.signup} className={classes.topButtonSecondary} color='inherit'>Opprett bruker</Button>
          </div>
        }
      </div>
      {/* <div className="rain rain--far"></div> */}
      {/* <div className="rain rain--mid"></div> */}
      {/* <div className="rain rain--near"></div> */}

      <div className={classNames(classes.waveWrapperInner, classes.bgTop)}>
        <div className={classNames(classes.wave, classes.waveTop)}></div>
      </div>
      <div className={classNames(classes.waveWrapperInner, classes.bgMiddle)}>
        <div className={classNames(classes.wave, classes.waveMiddle)}></div>
      </div>
      <div className={classNames(classes.waveWrapperInner, classes.bgBottom)}>
        <div className={classNames(classes.wave, classes.waveBottom)}></div>
      </div>
    </div>
  );
};

Wave.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(style)(Wave);
