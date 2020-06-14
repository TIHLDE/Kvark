import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

// Icons
import MembersIcon from '@material-ui/icons/PlaylistAddCheck';
import WaitingIcon from '@material-ui/icons/PlaylistAdd';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';

// Components
import Members from './tabs/Members';

const styles = (theme) => ({
  top: {
    height: 220,
    background: theme.colors.gradient.main.top,
    paddingBottom: 5,
  },
  root: {
    minHeight: '100vh',
    maxWidth: 1200,
    margin: 'auto',
    paddingBottom: 30,
  },
  content: {
    width: '90%',
    maxWidth: 1200,
    margin: '-60px auto',
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 30,
    padding: '28px 10px',
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  tabs: {
    marginTop: '10px',
    marginBottom: 1,
    backgroundColor: theme.colors.background.light,
    color: theme.colors.text.light,
    width: '100%',
  },
  header: {
    color: theme.colors.text.main,
  },
});

class UserAdmin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabViewMode: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleChange(event, newValue) {
    this.setState({tabViewMode: newValue});
  }

  render() {
    const {classes} = this.props;

    return (
      <Navigation whitesmoke fancyNavbar>
        <div className={classes.top}></div>
        <Paper className={classes.content}>
          <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
            <Typography className={classes.header} variant='h4'>Brukeradmin</Typography>
            <Tabs variant="fullWidth" scrollButtons="on" centered className={classes.tabs} value={this.state.tabViewMode} onChange={this.handleChange}>
              <Tab id='0' icon={<MembersIcon />} label='Medlemmer' />
              <Tab id='1' icon={<WaitingIcon />} label='Ventende' />
            </Tabs>
            {this.state.tabViewMode === 0 && <Members isMember/>}
            {this.state.tabViewMode === 1 && <Members/>}
          </Grid>
        </Paper>
      </Navigation>
    );
  }
}

UserAdmin.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(UserAdmin);
