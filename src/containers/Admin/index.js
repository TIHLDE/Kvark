import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import URLS from '../../URLS';
import Helmet from 'react-helmet';

// API and store import
import UserService from '../../api/services/UserService';

// Text imports
import Text from '../../text/AdminText';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import EventAdminIcon from '../../assets/icons/eventadmin.svg';
import JobPostAdminIcon from '../../assets/icons/jobpostadmin.svg';
import UserAdminIcon from '../../assets/icons/UserAdminIcon.svg';
import NewsAdminIcon from '../../assets/img/news.svg';

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

function Admin(props) {
  const { classes } = props;
  const [groups, setGroups] = useState(null);

  const loadIsGroupMember = () => {
    UserService.getUserData().then((user) => {
      if (user) {
        setGroups(user.groups);
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top
    loadIsGroupMember();
  }, []);

  return (
    <Navigation fancyNavbar footer whitesmoke>
      <Helmet>
        <title>Admin - TIHLDE</title>
      </Helmet>
      <Banner title={Text.header} />
      <Grid alignItems='center' className={classes.root} container direction='column' wrap='nowrap'>
        <div className={classes.grid}>
          {groups && (groups.includes('HS') || groups.includes('Promo') || groups.includes('NoK') || groups.includes('DevKom')) && (
            <InfoCard classes={{ children: classes.flex }} header='Arrangementer' justifyText src={EventAdminIcon} text={Text.events}>
              <Link className={classes.buttonLink} to={URLS.eventAdmin}>
                <Button className={classes.button} color='primary' variant='contained'>
                  Administrer arrangementer
                </Button>
              </Link>
            </InfoCard>
          )}
          {groups && (groups.includes('HS') || groups.includes('NoK') || groups.includes('DevKom')) && (
            <InfoCard classes={{ children: classes.flex }} header='Jobbannonser' justifyText src={JobPostAdminIcon} text={Text.jobposts}>
              <Link className={classes.buttonLink} to={URLS.jobpostsAdmin}>
                <Button className={classes.button} color='primary' variant='contained'>
                  Administrer jobbannonser
                </Button>
              </Link>
            </InfoCard>
          )}
          {groups && (groups.includes('HS') || groups.includes('DevKom')) && (
            <InfoCard classes={{ children: classes.flex }} header='Nyheter' justifyText src={NewsAdminIcon} text={Text.news}>
              <Link className={classes.buttonLink} to={URLS.newsAdmin}>
                <Button className={classes.button} color='primary' variant='contained'>
                  Administrer nyheter
                </Button>
              </Link>
            </InfoCard>
          )}
          {groups && (groups.includes('HS') || groups.includes('DevKom')) && (
            <InfoCard classes={{ children: classes.flex }} header='Medlemmer' justifyText src={UserAdminIcon} text={Text.users}>
              <Link className={classes.buttonLink} to={URLS.userAdmin}>
                <Button className={classes.button} color='primary' variant='contained'>
                  Administrer medlemmer
                </Button>
              </Link>
            </InfoCard>
          )}
        </div>
      </Grid>
    </Navigation>
  );
}

Admin.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Admin);
