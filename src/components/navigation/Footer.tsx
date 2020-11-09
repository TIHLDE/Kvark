import React, { useState } from 'react';
import URLS from 'URLS';
import classnames from 'classnames';
import ThemeSettings from 'components/miscellaneous/ThemeSettings';
import { Link } from 'react-router-dom';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Icons
import LightIcon from '@material-ui/icons/WbSunnyOutlined';

// Assets import
import SIT from 'assets/img/sit.svg';
import VERCEL from 'assets/img/vercel.svg';
import NEXTTRON from 'assets/img/Nextron.png';
import ACADEMICWORK from 'assets/img/aw_logo_main_green.svg';
import FACEBOOK from 'assets/icons/facebook.svg';
import TWITTER from 'assets/icons/twitter.svg';
import INSTAGRAM from 'assets/icons/instagram.svg';
import SNAPCHAT from 'assets/icons/snapchat.svg';
import SLACK from 'assets/icons/slack.svg';
import DISCORD from 'assets/icons/discord.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    backgroundColor: theme.palette.colors.footer.main,
    padding: theme.spacing(5, 0),
    display: 'grid',
    gridGap: theme.spacing(5),
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateAreas: "'sponsors about sosialMedia theme'",
    justifyItems: 'center',
    color: theme.palette.colors.footer.text,
    boxShadow: '0px -2px 5px 0px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('md')]: {
      gridTemplateRows: '1fr 1fr',
      gridTemplateAreas: "'about sosialMedia' 'sponsors theme'",
      gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateRows: 'auto auto auto auto',
      gridTemplateAreas: "'theme' 'about' 'sosialMedia' 'sponsors'",
      gridTemplateColumns: '100%',
    },
  },
  about: {
    gridArea: 'about',
  },
  sponsors: {
    gridArea: 'sponsors',
  },
  sosialMedia: {
    gridArea: 'sosialMedia',
  },
  themeWrapper: {
    gridArea: 'theme',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sosialMediaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: theme.spacing(1),
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  link: {
    color: 'white',
  },
  imgLink: {
    margin: '0 4px',
  },
  themeSettingsContainer: {
    height: 54,
    width: 54,
    marginTop: theme.spacing(2),
    color: theme.palette.colors.footer.text,
  },
  themeSettingsIcon: {
    fontSize: 30,
  },
}));

const Footer = () => {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);

  const mediaList = [
    { img: FACEBOOK, link: 'https://www.facebook.com/tihlde/' },
    { img: INSTAGRAM, link: 'https://www.instagram.com/tihlde/' },
    { img: TWITTER, link: 'https://twitter.com/tihlde' },
    { img: SNAPCHAT, link: 'https://www.snapchat.com/add/tihldesnap' },
    { img: SLACK, link: 'https://tihlde.slack.com' },
    { img: DISCORD, link: 'https://discord.gg/SZR9vTS' },
  ];

  return (
    <div className={classes.root}>
      {showModal && <ThemeSettings onClose={() => setShowModal(false)} open={showModal} />}
      <div className={classnames(classes.sponsors, classes.flexColumn)}>
        <Typography align='center' className={classes.marginBottom} color='inherit' variant='h3'>
          Samarbeid
        </Typography>
        <a href='https://vercel.com/?utm_source=kvark&utm_campaign=oss' rel='noopener noreferrer' target='_blank'>
          <img alt='Vercel' className={classes.marginBottom} src={VERCEL} width={150} />
        </a>
        <img alt='academicwork' className={classes.marginBottom} src={ACADEMICWORK} width={80} />
        <img alt='sit' className={classes.marginBottom} src={SIT} width={80} />
        <img alt='nextron' className={classes.marginBottom} src={NEXTTRON} width={80} />
      </div>
      <div className={classes.about}>
        <Typography align='center' className={classes.marginBottom} color='inherit' variant='h3'>
          TIHLDE
        </Typography>
        <Typography align='center' className={classes.marginBottom} color='inherit'>
          <a className={classes.link} href='mailto:hs@tihlde.org'>
            hs@tihlde.org
          </a>
        </Typography>
        <Typography align='center' className={classes.marginBottom} color='inherit'>
          c/o IDI NTNU
        </Typography>
        <Typography align='center' className={classes.marginBottom} color='inherit'>
          OrgNr: 989 684 183
        </Typography>
        <Typography align='center' className={classes.marginBottom} color='inherit'>
          <Link className={classes.link} to={URLS.contactInfo}>
            Kontaktinfo
          </Link>
        </Typography>
      </div>
      <div className={classes.sosialMedia}>
        <Typography align='center' className={classes.marginBottom} color='inherit' variant='h3'>
          Sosiale medier
        </Typography>
        <div className={classes.sosialMediaGrid}>
          {mediaList.map((media, index) => (
            <a className={classes.link} href={media.link} key={index} rel='noopener noreferrer' target='_blank'>
              <img alt='sit' className={classes.marginBottom} src={media.img} width={40} />
            </a>
          ))}
        </div>
      </div>
      <div className={classnames(classes.themeWrapper, classes.flexColumn)}>
        <Typography align='center' className={classes.marginBottom} color='inherit' variant='h3'>
          Temavelger
        </Typography>
        <IconButton aria-label='delete' className={classes.themeSettingsContainer} onClick={() => setShowModal(true)}>
          <LightIcon className={classes.themeSettingsIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default Footer;
