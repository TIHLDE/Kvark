import React, { createRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Icons
import Image from '../../assets/img/glad.jpg';
import Send from '@material-ui/icons/Send';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';
import Forum from './components/Forum';
import Paper from '../../components/layout/Paper';

import Text from '../../text/CompaniesText';

const styles = (theme) => ({
  root: {},
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'auto',
    margin: '0 auto',
    gridGap: '20px',
    justifyContent: 'center',
    '@media only screen and (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  section: {
    padding: '48px 0px 48px',
    maxWidth: 1200,
    margin: 'auto',
    '@media only screen and (max-width: 1200px)': {
      padding: '48px 0',
    },
  },
  topSection: {
    paddingBottom: 0,
    paddingTop: 24,
    '@media only screen and (max-width: 1200px)': {
      padding: '12px 0px 48px 0px',
    },
  },
  imageClass: {
    width: 400,
    maxWidth: 'none',
    maxHeight: 'none',
    height: 'auto',
    '@media only screen and (max-width: 800px)': {
      width: '100%',
    },
  },
  header: {
    marginTop: '2px',
    marginBottom: '20px',
    color: theme.palette.colors.text.main,
  },
  smoke: {
    backgroundColor: theme.palette.colors.background.smoke,
  },
  formWrapper: {
    margin: '15px 0',
  },
  flex: {
    display: 'flex',
    justifyContent: 'justify-content',
    alignItems: 'center',
  },
  toFormBtn: {
    margin: 'auto',
    width: '100%',
  },
  button: {
    width: '100%',
    color: theme.palette.colors.constant.smoke,
    borderColor: theme.palette.colors.constant.smoke + 'bb',
    minWidth: 200,
    '&:hover': {
      borderColor: theme.palette.colors.constant.smoke,
    },
  },
  sendIcon: {
    marginRight: 15,
  },
});

function Companies(props) {
  const { classes } = props;
  const formRef = createRef();
  const firstTextFieldRef = createRef();

  const focusFirstTextField = () => {
    const node = firstTextFieldRef.current;
    node.focus({ preventScroll: true });
  };

  const scrollToForm = () => {
    focusFirstTextField();
    const node = formRef.current;
    window.scroll({ top: node.offsetTop - 84, left: 0, behavior: 'smooth' });
  };

  return (
    <Navigation fancyNavbar whitesmoke>
      <Helmet>
        <title>For bedrifter - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <Banner text='<b>Alle arrangementer kan gjennomføres digitalt våren 2021<b/>' title={Text.bannnertitle}>
          <Button className={classes.button} color='primary' onClick={() => scrollToForm()} variant='outlined'>
            <div className={classes.flex}>
              <Send className={classes.sendIcon} />
              {Text.interesse}
            </div>
          </Button>
        </Banner>
        <div className={classes.section}>
          <Typography align='center' className={classes.header} color='inherit' variant='h4'>
            {Text.viTilbyr}
          </Typography>
          <div className={classNames(classes.container)}>
            <InfoCard header='Bedriftspresentasjon' justifyText text={Text.bedrifter} />
            <InfoCard header='Kurs / Workshop' justifyText text={Text.kurs} />
            <InfoCard header='Bedriftsbesøk' justifyText text={Text.bedriftstur} />
            <InfoCard header='Annonse' justifyText text={Text.jobbannonser} />
            <InfoCard header='Insta-takeover' justifyText text={Text.instatakeover} />
          </div>
        </div>

        <div className={classes.smoke}>
          <div className={classes.section}>
            <Typography align='center' className={classes.header} color='inherit' variant='h4'>
              {Text.studier}
            </Typography>
            <div className={classNames(classes.container)}>
              <InfoCard header='Dataingeniør' justifyText text={Text.data} />
              <InfoCard header='Digital infrastruktur og cybersikkerhet' justifyText text={Text.drift} />
              <InfoCard header='Digital forretningsutvikling' justifyText text={Text.support} />
              <InfoCard header='Digital samhandling' justifyText text={Text.IKT} />
            </div>
          </div>
        </div>
        <div className={classes.section} ref={formRef}>
          <Paper className={classes.formWrapper} noPadding>
            <Forum firstTextFieldRef={firstTextFieldRef} scrollToForm={scrollToForm} />
          </Paper>
        </div>

        <div className={classes.smoke}>
          <div className={classes.section}>
            <InfoCard header={'Om TIHLDE'} imageClass={classes.imageClass} src={Image} text={Text.omTIHLDE} />
          </div>
        </div>
      </div>
    </Navigation>
  );
}

Companies.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Companies);
