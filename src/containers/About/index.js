import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import URLS from '../../URLS';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useTheme } from '@material-ui/core/styles';

// Text Imports
import Text from '../../text/AboutText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Icons
import SocialIcon from '../../assets/icons/social.svg';
import BusinessIcon from '../../assets/icons/business.svg';
import OperationIcon from '../../assets/icons/operations.png';
import PromoIcon from '../../assets/icons/promo.svg';
import IndexIcon from '../../assets/icons/index.svg';
import OrgMapLight from '../../assets/img/orgMapLight.jpg';
import OrgMapDark from '../../assets/img/orgMapDark.jpg';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import ClickableImage from '../../components/miscellaneous/ClickableImage';
import Banner from '../../components/layout/Banner';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    minHeight: '100vh',
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '15px',
    marginBottom: 40,

    '@media only screen and (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  padding: {
    padding: 30,

    '@media only screen and (max-width: 700px)': {
      padding: 15,
    },
  },
  section: {
    padding: '48px 0px',
    maxWidth: 1200,
    margin: 'auto',
    '@media only screen and (max-width: 1200px)': {
      padding: '48px 0',
    },
  },
  header: {
    marginTop: 30,
    marginBottom: 30,
    color: theme.palette.colors.text.main,
  },
  clickableImage: {
    padding: 10,
    width: '100%',
  },
  orgMap: {
    margin: 4,
  },
  smoke: {
    width: '100%',
    backgroundColor: theme.palette.colors.background.smoke,
  },
  button: {
    marginTop: 8,
    width: '100%',
    color: theme.palette.colors.constant.smoke,
    borderColor: theme.palette.colors.constant.smoke + 'bb',
    minWidth: 200,
    marginBottom: 8,
    '&:hover': {
      borderColor: theme.palette.colors.constant.smoke,
    },
  },
});

function About(props) {
  const { classes } = props;
  const theme = useTheme();
  const isDark = theme.palette.type === 'dark';

  return (
    <Navigation fancyNavbar whitesmoke>
      <Helmet>
        <title>Om TIHLDE - TIHLDE</title>
      </Helmet>
      <Grid alignItems='center' className={classes.root} container direction='column' wrap='nowrap'>
        <Banner text={Text.subheader} title={Text.header}>
          <>
            <Button className={classes.button} color='primary' component={Link} to={URLS.laws} variant='outlined'>
              TIHLDE&apos;s Lover
            </Button>
            <Button className={classes.button} color='primary' component={Link} to={URLS.services} variant='outlined'>
              Tjenester
            </Button>
          </>
        </Banner>

        <div>
          <div className={classes.section}>
            <Typography align='center' className={classes.header} color='inherit' variant='h4'>
              Undergrupper
            </Typography>
            <div className={classes.grid}>
              <InfoCard header='Drift' src={OperationIcon} text={Text.drift} />
              <InfoCard header='Sosialen' src={SocialIcon} text={Text.social} />
              <InfoCard header='Næringsliv og Kurs' src={BusinessIcon} text={Text.business} />
              <InfoCard header='Promo' src={PromoIcon} text={Text.promo} />
              <InfoCard header='Index' src={IndexIcon} text={Text.index} />
              <InfoCard header='Sommer' src={'https://i.ibb.co/9yV3P0Y/flag-a3262845-69a0-4e51-be70-0598d66b8fcf.gif'} text={Text.ctf} />
            </div>
          </div>
        </div>

        <div className={classes.smoke}>
          <div className={classes.section}>
            <Typography align='center' className={classes.header} color='inherit' variant='h4'>
              Komitéer
            </Typography>
            <div className={classes.grid}>
              <InfoCard header='Turkom' justifyText text={Text.turkom} />
              <InfoCard header='KontKom' justifyText text={Text.kontkom} />
            </div>
          </div>
        </div>

        <div>
          <div className={classes.section}>
            <Typography align='center' className={classes.header} color='inherit' variant='h4'>
              Organisasjonskart
            </Typography>
            <Paper className={classes.orgMap} noPadding>
              <ClickableImage alt='organisasjonskart' className={classes.clickableImage} image={isDark ? OrgMapDark : OrgMapLight} />
            </Paper>
          </div>
        </div>
        <div className={classes.smoke}>
          <div className={classes.section}>
            <InfoCard className={classes.header} header='Historie' justifyText subheader='Opptak' subText={Text.history2} text={Text.history} />
          </div>
        </div>
      </Grid>
    </Navigation>
  );
}

About.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(About);
