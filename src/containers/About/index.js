import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import URLS from '../../URLS';
import {Link} from 'react-router-dom';

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
import OrgMap from '../../assets/img/orgMap.svg';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import ClickableImage from '../../components/miscellaneous/ClickableImage';
import Banner from '../../components/layout/Banner';

const styles = {
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
  verticalMargin: {
    marginTop: 30,
    marginBottom: 30,
  },
  miniPadding: {
    padding: 10,
  },
  orgMap: {
    margin: 4,
    border: '1px solid #ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  smoke: {
    width: '100%',
    backgroundColor: '#Fefefe',
  },
  mt: {
    marginTop: 16,
    width: '100%',
  },
  buttonLink: {
    textDecoration: 'none',
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#f8f8fa',
    borderColor: '#f8f8fabb',
    minWidth: 200,
    marginBottom: 15,
    '&:hover': {
      borderColor: '#f8f8fa',
    },
  },
};

class About extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {classes} = this.props;
    return (
      <Navigation footer whitesmoke fancyNavbar>
        <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
          <Banner
            text={Text.subheader}
            title={Text.header}>
            <>
              <Link to={URLS.laws} className={classNames(classes.buttonLink, classes.mt)}>
                <Button
                  variant="outlined"
                  className={classes.button}
                  color='primary'>
                    TIHLDE&apos;s Lover
                </Button>
              </Link>
              <Link to={URLS.services} className={classNames(classes.buttonLink, classes.mt)}>
                <Button
                  variant="outlined"
                  className={classes.button}
                  color='primary'>
                    Tjenester
                </Button>
              </Link>
            </>
          </Banner>

          <div>
            <div className={classes.section}>
              <Typography className={classes.verticalMargin} variant='h4' color='inherit' align='center'>Undergrupper</Typography>
              <div className={classNames(classes.grid, classes.smoke)}>
                <InfoCard header='Drift' text={Text.drift} src={OperationIcon}/>
                <InfoCard header='Sosialen' text={Text.social} src={SocialIcon}/>
                <InfoCard header='Næringsliv og Kurs' text={Text.business} src={BusinessIcon}/>
                <InfoCard header='Promo' text={Text.promo} src={PromoIcon}/>
              </div>
            </div>
          </div>

          <div className={classes.smoke}>
            <div className={classes.section}>
              <Typography className={classes.verticalMargin}variant='h4' color='inherit' align='center'>Komitéer</Typography>
              <div className={classes.grid}>
                <InfoCard header='KontKom' text={Text.kontkom} justifyText/>
                <InfoCard header='Devkom' text={Text.devkom} justifyText/>
                <InfoCard header='Turkom' text={Text.turkom} justifyText/>
                <InfoCard header='Jubkom' text={Text.jubkom} justifyText/>
              </div>
            </div>
          </div>

          <div>
            <div className={classes.section}>
              <Typography className={classes.verticalMargin}variant='h4' color='inherit' align='center'>Organisasjonskart</Typography>
              <div className={classes.orgMap}>
                <ClickableImage className={classes.miniPadding} image={OrgMap} alt='organisasjonskart' width='100%'/>
              </div>
            </div>
          </div>

          <div className={classes.smoke}>
            <div className={classes.section}>
              <InfoCard className={classes.verticalMargin} header='Historie' text={Text.history} subheader='Opptak' subText={Text.history2} justifyText/>
            </div>
          </div>
        </Grid>
      </Navigation>
    );
  }

}

About.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(About);
