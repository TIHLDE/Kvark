import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';

// API and store imports
import UserService from '../../../api/services/UserService';

// Material Components
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,
  },
  notActivated: {
    gridAutoFlow: 'column',
    display: 'grid',
    gridGap: '10',
    width: '100%',
    textAlign: 'left',
    padding: 5,
    gridTemplateColumns: '3fr 2fr 2fr 2fr 48px',
    gridTemplateRows: '1fr',

    '@media only screen and (max-width: 800px)': {
      display: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
  },
  name: {
    minWidth: '65px',
    marginLeft: 15,
  },
  class: {
    minWidth: '60px',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
  box: {
    margin: 5,
  },
});

const Members = (props) => {
  const userClass = ['Alle', '1. klasse', '2. klasse', '3. klasse', '4. klasse', '5. klasse'];
  const userStudy = ['Alle', 'Dataing', 'DigFor', 'DigSec', 'DigSam', 'Drift'];
  const [memberList, setMemberList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userClassChoice, setUserClassChoice] = useState(0);
  const [userStudyChoice, setUserStudyChoice] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [search, setSearch] = useState('');

  const loadMembers = (filters, replace) => {
    // Add in filters if needed, and adds the is tihlde member filter
    let urlParameters = filters ? { ...filters } : {};
    if (props.isMember) {
      urlParameters.is_TIHLDE_member = true;
    } else {
      urlParameters.is_TIHLDE_member = false;
    }

    // Decide if we should go to next page or not.
    if (nextPage) {
      urlParameters = {
        page: nextPage,
        ...urlParameters,
      };
    }

    // Fetch members from server
    UserService.getUsers(urlParameters)
      .then((data) => {
        let displayedMembers = [];
        const nextPageUrl = data.next;
        displayedMembers = displayedMembers.concat(data.results);
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

        // If we allready have Members
        if (replace) {
          displayedMembers = memberList.concat(displayedMembers);
        }
        setMemberList(displayedMembers);
        setNextPage(nextPage);
      })
      .catch(() => {
        setMemberList([]);
        setNextPage(null);
      })
      .finally(() => {
        setIsFetching(false);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    loadMembers();
    // eslint-disable-next-line
  },[]);

  const filterMembers = async (searchInput, userClassChoiceInput, userStudyChoiceInput) => {
    setIsFetching(true);
    setNextPage(null);
    setMemberList([]);
    // If no filters requested, just load the members
    if (searchInput === '' && userStudyChoiceInput === 0 && userClassChoiceInput === 0) {
      loadMembers();
    } else {
      const filters = {};
      if (searchInput && searchInput !== '') {
        filters.search = searchInput;
      }
      if (userStudyChoiceInput && userStudyChoiceInput !== 0) {
        filters.user_study = userStudyChoiceInput;
      }
      if (userClassChoiceInput && userClassChoiceInput !== 0) {
        filters.user_class = userClassChoiceInput;
      }
      loadMembers(filters, false);
    }
  };

  useEffect(() => {
    const searchInput = search;
    const timer = setTimeout(() => filterMembers(searchInput, userClassChoice, userStudyChoice), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [search]);

  const handleStudieChange = (event) => {
    event.preventDefault();
    setUserStudyChoice(event.target.value);
    filterMembers(search, userClassChoice, event.target.value);
  };

  const handleClassChange = (event) => {
    event.preventDefault();
    setUserClassChoice(event.target.value);
    filterMembers(search, event.target.value, userStudyChoice);
  };

  const getNextPage = () => {
    const searchInput = search;
    const userClassChoiceInput = userClassChoice;
    const userStudyChoiceInput = userStudyChoice;
    const filters = {};
    if (searchInput || userClassChoiceInput || userStudyChoiceInput) {
      filters.search = searchInput;
      if (userStudyChoiceInput && userStudyChoiceInput !== 0) {
        filters.user_study = userStudyChoiceInput;
      }
      if (userClassChoiceInput && userClassChoiceInput !== 0) {
        filters.user_class = userClassChoiceInput;
      }
    }
    loadMembers(filters, true);
  };

  const handleMembers = (id, isMember) => {
    UserService.updateUserData(id, { is_TIHLDE_member: isMember });
    const newMembers = memberList.filter((x) => x.user_id !== id);
    setMemberList(newMembers);
  };

  const { classes } = props;
  return (
    <div className={classes.grid}>
      <div className={classes.filterContainer}>
        <TextField className={classes.box} fullWidth label='Klasser' onChange={handleClassChange} select value={userClassChoice} variant='filled'>
          {userClass.map((value, index) => (
            <MenuItem key={index} value={index}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField className={classes.box} fullWidth label='Studie' onChange={handleStudieChange} select value={userStudyChoice} variant='filled'>
          {userStudy.map((value, index) => (
            <MenuItem key={index} value={index}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={classes.box}
          fullWidth
          label='Søk'
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder='Søk...'
          value={search}
          variant='filled'
        />
      </div>
      {isFetching ? (
        <CircularProgress className={classes.progress} />
      ) : (
        <Grow in={!isFetching}>
          <div>
            <Hidden xsDown>
              <Grid alignItems='center' className={classes.notActivated} container direction='row' wrap='nowrap'>
                <Typography className={classNames(classes.title, classes.name)} variant='subtitle1'>
                  Navn:
                </Typography>
                <Typography className={classes.title} variant='subtitle1'>
                  Id:
                </Typography>
                <Typography className={classes.title} variant='subtitle1'>
                  Studie:
                </Typography>
                <Typography className={classes.title} variant='subtitle1'>
                  Klasse:
                </Typography>
              </Grid>
            </Hidden>
            <Pageination fullWidth nextPage={getNextPage} page={nextPage}>
              {memberList &&
                memberList.map((value, index) => <PersonListItem data={value} handleMembers={handleMembers} isMember={props.isMember} key={index} />)}
            </Pageination>
            {memberList && memberList.length === 0 && !isLoading && <NoPersonsIndicator />}
          </div>
        </Grow>
      )}
    </div>
  );
};

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

export default connect(stateValues)(withStyles(styles, { withTheme: true })(Members));
