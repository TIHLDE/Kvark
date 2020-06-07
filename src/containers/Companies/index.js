import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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
    color: theme.colors.text.main,
  },
  smoke: {
    backgroundColor: theme.colors.background.smoke,
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
    color: theme.colors.constant.smoke,
    borderColor: theme.colors.constant.smoke + 'bb',
    minWidth: 200,
    '&:hover': {
      borderColor: theme.colors.constant.smoke,
    },
  },
  sendIcon: {
    marginRight: 15,
  },
});

class Companies extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formRef = React.createRef();
    this.firstTextFieldRef = React.createRef();
  }

  componentDidMount() {
    window.scrollTo({top: 0, left: 0});
  }

  focusFirstTextField = () => {
    const node = this.firstTextFieldRef.current;
    node.focus({preventScroll: true});
  };

  scrollToForm = () => {
    this.focusFirstTextField();
    const node = this.formRef.current;
    window.scroll({top: node.offsetTop - 84, left: 0, behavior: 'smooth'});
  };

  ToFormButton = (props) => {
    const {classes} = props;
    return (
      <Button
        className={classes.button}
        variant='outlined'
        color='primary'
        onClick={() => this.scrollToForm()}>
        <div className={classes.flex}>
          <Send className={classes.sendIcon}/>
          {Text.interesse}
        </div>
      </Button>
    );
  }

  render() {
    const {classes} = this.props;

    return (
      <Navigation whitesmoke footer fancyNavbar>
        <div className={classes.root}>
          <Banner title={Text.bannnertitle}>
            <this.ToFormButton classes={classes} />
          </Banner>
          <div className={classes.section}>
            <Typography
              variant='h4'
              color="inherit"
              align="center"
              className={classes.header}
            >
              {Text.viTilbyr}
            </Typography>
            <div className={classNames(classes.container)}>
              <InfoCard
                header="Stillingsannonser"
                text={Text.jobbannonser}
                justifyText
              />
              <InfoCard
                header="Bedriftspresentasjon"
                text={Text.bedrifter}
                justifyText
              />
            </div>
          </div>

          <div className={classes.smoke}>
            <div className={classes.section}>
              <Typography
                variant='h4'
                color="inherit"
                align="center"
                className={classes.header}
              >
                {Text.studier}
              </Typography>
              <div className={classNames(classes.container)}>
                <InfoCard header="Dataingeniør" text={Text.data} justifyText />
                <InfoCard
                  header="Digital infrastruktur og cybersikkerhet"
                  text={Text.drift}
                  justifyText
                />
                <InfoCard
                  header="Digital forretningsutvikling"
                  text={Text.support}
                  justifyText
                />
                <InfoCard
                  header="Digital samhandling"
                  text={Text.IKT}
                  justifyText
                />
              </div>
            </div>
          </div>
          <div className={classes.section}>
            <Paper className={classes.formWrapper} ref={this.formRef} noPadding>
              <Forum
                setMessage={this.setMessage}
                data={{
                  forumText1: Text.forumText2,
                  forumText2: Text.forumText2,
                }}
                firstTextFieldRef={this.firstTextFieldRef}
                scrollToForm={this.scrollToForm}
              />
            </Paper>
          </div>

          <div className={classes.smoke}>
            <div className={classes.section}>
              <InfoCard
                imageClass={classes.imageClass}
                header={'Om TIHLDE'}
                text={Text.omTIHLDE}
                src={Image}
              />
            </div>
          </div>
        </div>
      </Navigation>
    );
  }
}

Companies.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Companies);
