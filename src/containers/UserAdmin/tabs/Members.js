import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';

// API and store imports
import UserService from '../../../api/services/UserService';

// Material Components
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

// Project components
import PersonListItem from './components/PersonListItem';
import Pageination from '../../../components/layout/Pageination';
import NoPersonsIndicator from './components/NoPersonsIndicator';

const styles = (theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    width: '100%',

    position: 'relative',

    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr',
      justifyContent: 'center',
      gridAutoFlow: 'row dense',
    },
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,

    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  notActivated: {
    gridAutoFlow: 'column',
    display: 'grid',
    gridGap: '10px',
    width: '100%',
    textAlign: 'left',
    gridTemplateColumns: 'auto 1fr auto auto auto 35px',
    gridTemplateRows: '1fr',

    '@media only screen and (max-width: 600px)': {
      display: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
  },
  id: {
    minWidth: '65px',
  },
  class: {
    minWidth: '60px',
  },
  vipps: {
    minWidth: '70px',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  box: {
    margin: 5,
  },
});

class Members extends Component {

  constructor() {
    super();
    this.state = {
      user_class: ['Alle', '1. klasse', '2. klasse', '3. klasse', '4. klasse', '5. klasse'],
      user_study: ['Alle', 'Dataing', 'DigFor', 'DigInc', 'DigSam', 'Drift'],
      members: [],
      isLoading: false,
      isFetching: false,

      user_study_choice: 0,
      user_class_choice: 0,
      nextPage: null,
      search: '',
    };
  }

    // Gets the event
    loadMembers = (filters, replace) => {
      // Add in filters if needed, and adds the is tihlde member filter
      let urlParameters = filters ? {...filters} : {};
      if (this.props.isMember) {
        urlParameters.is_TIHLDE_member = true;
      } else {
        urlParameters.is_TIHLDE_member = false;
      }

      // Decide if we should go to next page or not.
      if (this.state.nextPage) {
        urlParameters = {
          page: this.state.nextPage,
          ...urlParameters,
        };
      }
      // Fetch members from server
      UserService.getUsers(urlParameters).then((data) => {
        const nextPageUrl = data.next;
        let displayedMembers = data.results;
        urlParameters = {};

        // If we have a url for the next page convert it into a object
        if (nextPageUrl) {
          const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
          const parameterArray = nextPageUrlQuery.split('&');
          parameterArray.forEach((parameter) => {
            const parameterString = parameter.split('=');
            urlParameters[parameterString[0]] = parameterString[1];
          });
        }

        // Get the page number from the object if it exist
        const nextPage = urlParameters['page'] ? urlParameters['page'] : null;

        this.setState((oldState)=>{
          // If we allready have Members
          if (replace) {
            displayedMembers = oldState.members.concat(displayedMembers);
          }

          return {members: displayedMembers, nextPage: nextPage, isLoading: false, isFetching: false};
        });
        this.setState({isLoading: false, isFetching: false});
      });
    };

    componentDidMount() {
      window.scrollTo(0, 0);
      this.setState({isLoading: true});
      this.loadMembers();
    }

    filterMembers = async (event, search, userClassChoice, userStudyChoice) => {
      event.preventDefault();

      await this.setState({isFetching: true, nextPage: null, events: [], expiredShown: false});
      // If no filters requested, just load the members
      if ( search === '' && userStudyChoice === 0 && userClassChoice === 0) {
        this.loadMembers();
      } else {
        const filters = {};
        filters.search = search;
        if (userStudyChoice && userStudyChoice !== 0) filters.user_study = userStudyChoice;
        if (userClassChoice && userClassChoice !== 0) filters.user_class = userClassChoice;
        this.loadMembers(filters, false);
      }
    }

    searchForData = (event) => {
      event.preventDefault();
      this.filterMembers(event, this.state.search, this.state.user_class_choice, this.state.user_study_choice);
    }

    handleStudieChange = (event) => {
      this.setState({user_study_choice: event.target.value});
      this.filterMembers(event, this.state.search, this.state.user_class_choice, event.target.value);
    }

    handleClassChange = (event) => {
      this.setState({user_class_choice: event.target.value});
      this.filterMembers(event, this.state.search, event.target.value, this.state.user_study_choice);
    }

    getNextPage = () => {
      const search = this.state.search;
      const userClassChoice = this.state.user_class_choice;
      const userStudyChoice = this.state.user_study_choice;
      const filters = {};
      if (search || userClassChoice || userStudyChoice) {
        filters.search = search;
        if (userStudyChoice && userStudyChoice !== 0) filters.user_study = userStudyChoice;
        if (userClassChoice && userClassChoice !== 0) filters.user_class = userClassChoice;
      }
      this.loadMembers(filters, true );
    }

    handleDelete = async (id) => {
      UserService.updateUserData(id, {is_TIHLDE_member: false});
      const index = this.state.members.findIndex((x) => x.user_id === id);
      const newMembers = this.state.members;
      newMembers.splice(index, 1);
      this.setState({members: newMembers});
    }

    handleActivate = async (id) => {
      UserService.updateUserData(id, {is_TIHLDE_member: true});
      const index = this.state.members.findIndex((x) => x.user_id === id);
      const newMembers = this.state.members;
      newMembers.splice(index, 1);
      this.setState({members: newMembers});
    }

    render() {
      const {classes} = this.props;
      return (
        <div className={classes.grid}>
          <div className={classes.filterContainer}>
            <TextField className={classes.box} select fullWidth label='Klasser' value={this.state.user_class_choice} onChange={this.handleClassChange}>
              {this.state.user_class.map((value, index) => (
                <MenuItem key={index} value={index}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <TextField className={classes.box} select fullWidth label='Studie' value={this.state.user_study_choice} onChange={this.handleStudieChange}>
              {this.state.user_study.map((value, index) => (
                <MenuItem key={index} value={index}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <TextField className={classes.box} value={this.state.search} label='Søk' fullWidth placeholder='Søk...' onChange={(e)=>{
              this.setState({search: e.target.value}); this.searchForData(e);
            }}/>
          </div>
          {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
                    <Grow in={!this.state.isFetching}>
                      <div>
                        <Hidden xsDown>
                          <ListItem className={classes.btn}>
                            <Grid className={classNames(classes.notActivated)} container direction='row' wrap='nowrap' alignItems='center'>
                              <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'>Id:</Typography>
                              <Typography className={classes.title} variant='subtitle1'>Navn:</Typography>
                              <Typography className={classes.title} variant='subtitle1'>Studie:</Typography>
                              <Typography className={classNames(classes.title, classes.class)} variant='subtitle1'>Klasse:</Typography>
                              {!this.props.isMember &&
                                            <Typography className={classNames(classes.title, classes.vipps)} variant='subtitle1'>Vipps:</Typography>
                              }
                            </Grid>
                          </ListItem>
                        </Hidden>
                        <Pageination nextPage={this.getNextPage} page={this.state.nextPage}>
                          {this.state.members && this.state.members.map((value, index) => (
                            <div key={index}>
                              <PersonListItem isMember={this.props.isMember} data={value} handleDelete={this.handleDelete} handleActivate={this.handleActivate} />
                              <Divider/>
                            </div>
                          ))}
                        </Pageination>
                        {this.state.members.length === 0 && !this.state.isLoading &&
                                <NoPersonsIndicator />
                        }
                      </div>
                    </Grow>
          }
        </div>
      );
    }
}

Members.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  grid: PropTypes.object,
  isMember: PropTypes.bool,
};

Members.defaultProps = {
  id: '-1',
};

const stateValues = (state) => {
  return {
    grid: state.grid,
  };
};

export default connect(stateValues)(withStyles(styles, {withTheme: true})(Members));
