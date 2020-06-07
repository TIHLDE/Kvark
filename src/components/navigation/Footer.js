import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';

// Components
import ThemeSettings from '../miscellaneous/ThemeSettings';

// Icons
import LightIcon from '@material-ui/icons/WbSunnyOutlined';

// Assets import
import SIT from '../../assets/img/sit.svg';
import NEXTTRON from '../../assets/img/Nextron.png';
import ACADEMICWORK from '../../assets/img/aw_logo_main_green.svg';
import FACEBOOK from '../../assets/icons/facebook.svg';
import TWITTER from '../../assets/icons/twitter.svg';
import INSTAGRAM from '../../assets/icons/instagram.svg';
import SNAPCHAT from '../../assets/icons/snapchat.svg';
import SLACK from '../../assets/icons/slack.svg';
import DISCORD from '../../assets/icons/discord.svg';

const styles = (theme) => ({
  root: {
    position: 'relative',
    bottom: 0, left: 0, right: 0,

    backgroundColor: theme.colors.footer.main,
    padding: '40px 0px',
    display: 'grid',
    gridGap: '40px',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateAreas: '\'Sponsorer OmTihlde SosialeMedier SponsorLogo\'', // SosialeMedier
    gridTemplateRows: 'auto',
    justifyItems: 'center',
    color: theme.colors.footer.text,
    boxShadow: '0px -2px 5px 0px rgba(0,0,0,0.1)',

    '@media only screen and (max-width: 900px)': {
      gridTemplateRows: 'auto auto',
      gridTemplateAreas: '\'OmTihlde SosialeMedier\' \'Sponsorer SponsorLogo\'',
      gridTemplateColumns: 'auto auto',
    },

    '@media only screen and (max-width: 600px)': {
      gridTemplateRows: 'auto auto auto auto auto',
      gridTemplateAreas: '\'SponsorLogo\' \'OmTihlde\' \'SosialeMedier\' \'Sponsorer\'',
      gridTemplateColumns: '100%',
    },
  },
  omTihlde: {
    gridArea: 'OmTihlde',
  },
  sponsorer: {
    gridArea: 'Sponsorer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sosialeMedier: {
    gridArea: 'SosialeMedier',
  },
  sosialeMedierFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

  },
  horSpacing: {
    marginBottom: 10,
  },
  a: {
    margin: '0 4px',
  },
  sponsorWrapper: {
    gridArea: 'SponsorLogo',
    verticalAlign: 'top',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    textDecoration: 'none',
  },
  sponsorLogo: {
    width: '14rem',
    height: 'auto',
  },
  sponsorText: {
    color: theme.colors.footer.text,
    fontSize: '10px',
    textAlign: 'center',
    opacity: 0.7,
  },
  themeSettingsContainer: {
    height: 54,
    width: 54,
    margin: 'auto',
    marginTop: 20,
    color: theme.colors.footer.text,
  },
  themeSettingsIcon: {
    fontSize: 30,
  },
});

const OmTihlde = (props) => {
  const {classes} = props;
  return (
    <div className={classes.omTihlde}>
      <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>TIHLDE</Typography>
      <Link color='inherit' href='mailto:hs@tihlde.org'>
        <Typography className={classes.horSpacing} align='center' color='inherit'>hs@tihlde.org</Typography>
      </Link>
      <Typography className={classes.horSpacing} align='center' color='inherit'>c/o IDI NTNU</Typography>
      <Typography className={classes.horSpacing} align='center' color='inherit'>OrgNr: 989 684 183</Typography>
      <Link color='inherit' href='/kontakt/'>
        <Typography className={classes.horSpacing} align='center' color='inherit'>Kontaktinfo</Typography>
      </Link>
    </div>
  );
};

OmTihlde.propTypes = {
  classes: PropTypes.object,
};

const Sponsorer = (props) => {
  const {classes} = props;
  return (
    <div className={classes.sponsorer}>
      <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>Samarbeid</Typography>
      <img className={classes.horSpacing} src={ACADEMICWORK} alt="academicwork" width={80} />
      <img className={classes.horSpacing} src={SIT} alt="sit" width={80} />
      <img className={classes.horSpacing} src={NEXTTRON} alt="nextron" width={80} />
    </div>
  );
};

Sponsorer.propTypes = {
  classes: PropTypes.object,
};

const SosialeMedier = (props) => {
  const {classes} = props;
  return (
    <div className={classes.sosialeMedier}>
      <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>Sosiale medier</Typography>
      <div className={classes.sosialeMedierFlex}>
        <a className={classes.a} target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/tihlde/">
          <img className={classes.horSpacing} src={FACEBOOK} alt="sit" width={40} />
        </a>
        <a className={classes.a} target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/tihlde/">
          <img className={classes.horSpacing} src={INSTAGRAM} alt="sit" width={40} />
        </a>
        <a className={classes.a} target="_blank" rel="noopener noreferrer" href="https://twitter.com/tihlde">
          <img className={classes.horSpacing} src={TWITTER} alt="sit" width={40} />
        </a>
      </div>
      <div className={classes.sosialeMedierFlex}>
        <a className={classes.a} target="_blank" rel="noopener noreferrer" href="https://www.snapchat.com/add/tihldesnap">
          <img className={classes.horSpacing} src={SNAPCHAT} alt="sit" width={40} />
        </a>
        <a className={classes.a} target="_blank" rel="noopener noreferrer" href="https://tihlde.slack.com">
          <img className={classes.horSpacing} src={SLACK} alt="sit" width={40} />
        </a>
        <a className={classes.a} target="_blank" rel="noopener noreferrer" href="https://discord.gg/SZR9vTS">
          <img className={classes.horSpacing} src={DISCORD} alt="sit" width={40} />
        </a>
      </div>
    </div>
  );
};

SosialeMedier.propTypes = {
  classes: PropTypes.object,
};

const ModeSelector = (props) => {
  const {classes, openModal} = props;
  return (
    <div className={classes.sponsorWrapper}>
      <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>Temavelger</Typography>
      <IconButton onClick={openModal} aria-label="delete" className={classes.themeSettingsContainer}>
        <LightIcon className={classes.themeSettingsIcon} />
      </IconButton>
    </div>
  );
};

ModeSelector.propTypes = {
  classes: PropTypes.object,
  openModal: PropTypes.func,
};

const Footer = (props) => {
  const {classes} = props;

  const [showModal, setShowModal] = useState(false);

  return (
    <div className={classes.root}>
      {showModal &&
        <ThemeSettings
          onClose={() => setShowModal(false)}
          open={showModal} />
      }
      <Sponsorer classes={classes} />
      <OmTihlde classes={classes} />
      <SosialeMedier classes={classes} />
      <ModeSelector classes={classes} openModal={() => setShowModal(true)} />
    </div>
  );
};

Footer.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Footer);
