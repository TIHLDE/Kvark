import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import URLS from '../../URLS';

// API and store import
import UserService from '../../api/services/UserService';

// Text imports
import Text from '../../text/AdminText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import EventAdminIcon from '../../assets/icons/eventadmin.svg';
import JobPostAdminIcon from '../../assets/icons/jobpostadmin.svg';
import UserAdminIcon from '../../assets/icons/UserAdminIcon.svg';

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
  button: {
    marginBottom: 10,
    width: '100%',
  },
  buttonLink: {
    textDecoration: 'none',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
};

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: null,
    };
  }

  loadIsGroupMember() {
    UserService.isGroupMember().then((groups) => {
      this.setState({groups: groups});
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0); // Scrolls to the top
    this.loadIsGroupMember();
  }

  render() {
    const {classes} = this.props;
    return (
      <Navigation footer whitesmoke fancyNavbar>
        <Banner title={Text.header} />
        <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
          <div className={classes.grid}>
            { (this.state.groups && (this.state.groups.isHS || this.state.groups.isPromo || this.state.groups.isNok || this.state.groups.isDevkom)) &&
              <InfoCard header='Arrangementer' text={Text.events} src={EventAdminIcon} classes={{children: classes.flex}} justifyText>
                <Link to={URLS.eventAdmin} className={classes.buttonLink}><Button className={classes.button} variant='contained' color='primary'>Administrer arrangementer</Button></Link>
              </InfoCard>
            }
            { (this.state.groups && (this.state.groups.isHS || this.state.groups.isNok || this.state.groups.isDevkom)) &&
              <InfoCard header='Jobbannonser' text={Text.jobposts} src={JobPostAdminIcon} classes={{children: classes.flex}} justifyText>
                <Link to={URLS.jobpostsAdmin} className={classes.buttonLink}><Button className={classes.button} variant='contained' color='primary'>Administrer jobbannonser</Button></Link>
              </InfoCard>
            }
            {(this.state.groups && (this.state.groups.isHS || this.state.groups.isDevkom)) &&
              <InfoCard header='Medlemmer' text={Text.users} src={UserAdminIcon} classes={{children: classes.flex}} justifyText>
                <Link to={URLS.userAdmin} className={classes.buttonLink}><Button className={classes.button} variant='contained' color='primary'>Administrer medlemmer</Button></Link>
              </InfoCard>
            }
          </div>
        </Grid>
      </Navigation>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Admin);
