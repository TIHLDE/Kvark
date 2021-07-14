import { useState } from 'react';
import classnames from 'classnames';
import URLS from 'URLS';
import ThemeSettings from 'components/miscellaneous/ThemeSettings';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import { Link } from 'react-router-dom';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Typography, Divider } from '@material-ui/core';

// Assets import
import VERCEL from 'assets/icons/vercel.svg';
import FACEBOOK from 'assets/icons/facebook.svg';
import TWITTER from 'assets/icons/twitter.svg';
import INSTAGRAM from 'assets/icons/instagram.svg';
import SNAPCHAT from 'assets/icons/snapchat.svg';
import SLACK from 'assets/icons/slack.svg';
import DISCORD from 'assets/icons/discord.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    backgroundColor: theme.palette.colors.footer,
    padding: theme.spacing(1, 0, 4),
    display: 'grid',
    gridGap: theme.spacing(3),
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateAreas: "'about main sponsors' 'index index index'",
    justifyItems: 'center',
    color: theme.palette.getContrastText(theme.palette.colors.footer),
    borderTop: `${theme.palette.borderWidth} solid ${theme.palette.divider}`,
    [theme.breakpoints.down('lg')]: {
      gridTemplateAreas: "'main main' 'about sponsors' 'index index'",
      gridTemplateColumns: '1fr 1fr',
      padding: theme.spacing(1, 0, 14),
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateRows: 'auto auto auto',
      gridTemplateAreas: "'main' 'about' 'sponsors' 'index'",
      gridTemplateColumns: '1fr',
    },
  },
  marginTopColumns: {
    marginTop: theme.spacing(12),
    [theme.breakpoints.down('lg')]: {
      marginTop: theme.spacing(4),
    },
  },
  about: {
    gridArea: 'about',
  },
  main: {
    gridArea: 'main',
  },
  sponsors: {
    gridArea: 'sponsors',
  },
  index: {
    gridArea: 'index',
    padding: theme.spacing(1, 0, 0),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  socialMediaWrapper: {
    alignItems: 'center',
    display: 'flex',
    margin: theme.spacing(1, 0),
    [theme.breakpoints.down('xl')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: theme.spacing(2),
    },
    [theme.breakpoints.down('lg')]: {
      alignItems: 'center',
      display: 'flex',
      margin: theme.spacing(1, 0),
    },
    [theme.breakpoints.down('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: theme.spacing(2),
    },
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  link: {
    color: 'white',
  },
  imgLink: {
    margin: theme.spacing(0, 2.5),
    [theme.breakpoints.down('lg')]: {
      margin: theme.spacing(0, 2),
    },
  },
  attribute: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  attributeName: {
    textTransform: 'uppercase',
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  logo: {
    minWidth: '250px',
    width: '46%',
    height: 'auto',
    [theme.breakpoints.down('md')]: {
      minWidth: '200px',
    },
  },
  divider: {
    margin: theme.spacing(1, 0, 2),
    backgroundColor: '#fff',
    width: 175,
  },
  soMeIcon: {
    width: 38,
    transition: 'transform .14s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
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

  const attributes = [
    { key: 'e-post', value: 'hs@tihlde.org' },
    { key: 'lokasjon', value: 'c/o IDI NTNU' },
    { key: 'organisasjonsnummer', value: '989 684 183' },
  ];

  const someAnalytics = (some: string) =>
    window.gtag('event', `open`, {
      event_category: 'social-media',
      event_label: `Click on: ${some}`,
    });

  return (
    <div className={classes.root}>
      {showModal && <ThemeSettings onClose={() => setShowModal(false)} open={showModal} />}
      <div className={classnames(classes.about, classes.flexColumn, classes.marginTopColumns)}>
        <Typography variant='h2'>Kontakt</Typography>
        <Divider className={classes.divider} />
        {attributes.map((attribute, index) => (
          <div className={classes.attribute} key={index}>
            <Typography className={classes.attributeName}>{attribute.key}</Typography>
            <Typography>{attribute.value}</Typography>
          </div>
        ))}
        <Typography className={classes.marginBottom} color='inherit'>
          <Link className={classes.link} to={URLS.contactInfo}>
            Kontakt oss
          </Link>
        </Typography>
      </div>
      <div className={classnames(classes.main, classes.flexColumn)}>
        <TihldeLogo className={classes.logo} darkColor='white' lightColor='white' size='small' />
        <Divider className={classes.divider} />
        <div className={classes.socialMediaWrapper}>
          {mediaList.map((media, index) => (
            <a className={classes.imgLink} href={media.link} key={index} onClick={() => someAnalytics(media.link)} rel='noopener noreferrer' target='_blank'>
              <img alt='SoMe' className={classes.soMeIcon} src={media.img} />
            </a>
          ))}
        </div>
      </div>
      <div className={classnames(classes.sponsors, classes.flexColumn, classes.marginTopColumns)}>
        <Typography variant='h2'>Samarbeid</Typography>
        <Divider className={classes.divider} />
        <a href='https://vercel.com/?utm_source=kvark&utm_campaign=oss' rel='noopener noreferrer' target='_blank'>
          <img alt='Vercel' className={classes.marginBottom} src={VERCEL} width={150} />
        </a>
      </div>
      <div className={classes.index}>
        <Typography>
          Feil på siden?{' '}
          <Link className={classes.link} to={URLS.aboutIndex}>
            Rapporter til Index
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default Footer;
