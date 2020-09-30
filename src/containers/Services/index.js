import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Text imports
import Text from '../../text/ServicesText';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import DatabaseIcon from '../../assets/icons/database.png';
import EmailIcon from '../../assets/icons/email.svg';
import HostingIcon from '../../assets/icons/hosting.png';
import VirtualIcon from '../../assets/icons/virtual.png';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';

const styles = {
  root: {
    minHeight: '100vh',
    maxWidth: 1200,
    margin: 'auto',
    paddingBottom: 100,
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '15px',

    marginTop: 10,
    marginBottom: 30,

    '@media only screen and (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  bottomSpacing: {
    marginBottom: 10,
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
};

function Services(props) {
  const { classes } = props;

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Navigation fancyNavbar whitesmoke>
      <Helmet>
        <title>Tjenester - TIHLDE</title>
      </Helmet>
      <Banner text={Text.colargol} title={Text.header} />
      <Grid alignItems='center' className={classes.root} container direction='column' wrap='nowrap'>
        <div className={classes.grid}>
          <InfoCard classes={{ children: classes.flex }} header='E-post' justifyText src={EmailIcon} text={Text.email}>
            <Button className={classes.bottomSpacing} color='primary' href='https://webmail.tihlde.org/' variant='contained'>
              Gå til webmail
            </Button>
          </InfoCard>
          <InfoCard classes={{ children: classes.flex }} header='Hosting' justifyText src={HostingIcon} text={Text.hosting}>
            <Button className={classes.bottomSpacing} color='primary' href='https://wiki.tihlde.org/landing/fantorangen' variant='contained'>
              Bestill domene
            </Button>
          </InfoCard>
          <InfoCard classes={{ children: classes.flex }} header='Virtuelle Maskiner' justifyText src={VirtualIcon} text={Text.virtual}>
            <Button className={classes.bottomSpacing} color='primary' href='https://wiki.tihlde.org/landing/fantorangen' variant='contained'>
              Bestill tjenesten
            </Button>
          </InfoCard>
          <InfoCard classes={{ children: classes.flex }} header='Database' justifyText src={DatabaseIcon} text={Text.database}>
            <Button className={classes.bottomSpacing} color='primary' href='https://wiki.tihlde.org/landing/fantorangen' variant='contained'>
              Bestill mer plass
            </Button>
          </InfoCard>
        </div>
      </Grid>
    </Navigation>
  );
}

Services.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Services);
