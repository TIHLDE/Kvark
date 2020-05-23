import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Text Imports
import Text from '../../text/ContactText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
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
  socialgrid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    paddingTop: 2,
    paddingBottom: 2,
    gridGap: '15px',
    '& a': {
      backgroundColor: 'var(--tihlde-white)',
      color: 'black',
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
};

class ContactInfo extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {classes} = this.props;
    return (
      <Navigation footer whitesmoke fancyNavbar>
        <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
          <Banner title={Text.header} />

          <div className={classes.section}>
            <div className={classes.socialgrid}>
              <Button color='inherit' variant='contained' noPadding href='mailto:hs@tihlde.org'>E-post</Button>
              <Button color='inherit' variant='contained' noPadding target='_blank' href='https://www.facebook.com/messages/t/tihlde'>Messenger</Button>
              <Button color='inherit' variant='contained' noPadding target='_blank' href='https://tihlde.slack.com/'>Slack</Button>
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

}

ContactInfo.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ContactInfo);
