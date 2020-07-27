import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Text Imports
import Text from '../../text/ContactText';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';

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
  socialgrid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    paddingTop: 2,
    paddingBottom: 2,
    gridGap: '15px',
    '& a': {
      backgroundColor: theme.colors.background.light,
      color: theme.colors.text.main,
    },
    '@media only screen and (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  section: {
    maxWidth: 1200,
    margin: '15px auto 10px',
    width: '100%',
    '@media only screen and (max-width: 1200px)': {
      padding: '5px 0',
    },
  },
  button: {
    textAlign: 'center',
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88, 0px 0px 4px ' + theme.colors.border.main + '88',
    margin: 0,
    height: 50,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.light,
    '&:hover': {
      backgroundColor: theme.colors.background.light + 'bb',
    },
  },
});

function ContactInfo(props) {
  const {classes} = props;

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Navigation footer whitesmoke fancyNavbar>
      <Helmet>
        <title>Kontakt oss - TIHLDE</title>
      </Helmet>
      <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
        <Banner title={Text.header} />

        <div className={classes.section}>
          <div className={classes.socialgrid}>
            <Button className={classes.button} color='inherit' variant='contained' href='mailto:hs@tihlde.org'>E-post</Button>
            <Button className={classes.button} color='inherit' variant='contained' target='_blank' href='https://www.facebook.com/messages/t/tihlde'>Messenger</Button>
            <Button className={classes.button} color='inherit' variant='contained' target='_blank' href='https://tihlde.slack.com/'>Slack</Button>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.grid}>
            <InfoCard header='Besøksadresse' text={Text.visit} />
            <InfoCard header='Post- og faktureringsadresse' text={Text.invoice} />
          </div>
        </div>
      </Grid>
    </Navigation>
  );
}

ContactInfo.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ContactInfo);
