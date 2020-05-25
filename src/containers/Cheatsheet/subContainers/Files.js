import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Hidden from '@material-ui/core/Hidden';

// API and store imports
import CheatsheetService from '../../../api/services/CheatsheetService';

// Project Components
import Pageination from '../../../components/layout/Pageination';
import ListFiles from './ListFiles';
import LinkButton from '../../../components/navigation/LinkButton';
import Banner from '../../../components/layout/Banner';
import Navigation from '../../../components/navigation/Navigation';

// Images
import CheatSheetBanner from '../../../assets/img/cheatsheetbanner.jpg';

const styles = () => ({

  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: '15px',
    paddingTop: '10px',
    paddingBottom: '30px',
    width: '90%',
    position: 'relative',
    margin: 'auto',
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr',
      justifyContent: 'center',
      gridAutoFlow: 'row dense',
      padding: '60px 0px 48px 0px',
    },
  },
  containter: {
    border: '1px solid #ddd',
    borderRadius: 5,
    backgroundColor: 'white',
    overflow: 'hidden',
    textAlign: 'center',
  },

  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,

    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  grid: {
    gridAutoFlow: 'column',
    display: 'grid',
    width: '100%',
    textAlign: 'left',
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
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    width: '25%',

  },
  box: {
    margin: 5,
  },
});

const getClass = (i) => {
  switch (i) {
    case '1': return 'FIRST';
    case '2': return 'SECOND';
    case '3': return 'THIRD';
    case '4': return 'FOURTH';
    case '5': return 'FIFTH';
    default: return '?';
  }
};

const Files = (props) => {
  const {classes} = props;
  const {studyId, classId} = props.match.params;

  const [state, setState] = useState({
    files: [],
    isLoading: false,
    isFetching: false,
    search: '',
    nextPage: null,

  });

  const loadFiles = (filters, replace) => {
    let urlParameters = filters ? {...filters} : {};

    // Decide if we should go to next page or not.
    if (state.nextPage) {
      urlParameters = {
        page: state.nextPage,
        ...urlParameters,
      };
    }

    CheatsheetService.getCheatsheets(
        urlParameters, studyId.toString().toUpperCase(), getClass(classId))
        .then((data) => {
          const nextPageUrl = data.next;
          let displayedFiles = data.results;
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

          const nextPage = urlParameters['page'] ? urlParameters['page'] : null;

          setState((oldState) => {
            if (replace) {
              displayedFiles = oldState.files.concat(displayedFiles);
            }

            return {files: displayedFiles, nextPage: nextPage, isLoading: false, isFetching: false};
          });
        });
  };

  const filterFiles = async (event, search) => {
    event.preventDefault();

    await setState({isFetching: true, nextPage: null, files: [], expiredShown: false});
    if (search === '') {
      loadFiles();
    } else {
      const filters = {};
      filters.search = search;
      loadFiles(filters, false);
    }
  };

  const searchForFiles = (event) => {
    event.preventDefault();
    filterFiles(event, state.search);
  };

  const getNextPage = () => {
    const search = state.search;
    const filters = {};
    if (search) {
      filters.search = search;
    }
    loadFiles(filters, true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setState({isLoading: true});
    loadFiles();
    // eslint-disable-next-line
  }, []);

  return (
    <Navigation footer>
      <div className={classes.wrapper}>
        <Banner title='Kokebok' image={CheatSheetBanner} />
        <div className={classes.containter}>
          <div className={classes.filterContainer}>
            <TextField className={classes.box} value={state.search} label='Søk' fullWidth placeholder='Søk...' onChange={(e) => {
              setState({search: e.target.value}); searchForFiles(e);
            }}/>
          </div>
          {state.isFetching ? <CircularProgress className={classes.progress} /> :
                    <Grow in={!state.isFetching}>
                      <div>
                        <Hidden xsDown>
                          <ListItem className={classes.btn}>
                            <Grid className={classNames(classes.grid)} container direction='row' wrap='nowrap' alignItems='center'>
                              <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'>Title:</Typography>
                              <Typography className={classes.title} variant='subtitle1'>Beskrivelse:</Typography>
                              <Typography className={classes.title} variant='subtitle1'>av:</Typography>
                              <Typography className={classNames(classes.title, classes.class)} variant='subtitle1'>fag:</Typography>
                            </Grid>
                          </ListItem>
                        </Hidden>
                        <Divider></Divider>
                        <Pageination nextPage={getNextPage} page={state.nextPage} fullWidth>
                          {state.files && state.files.map((value, index) => (
                            <div key={index}>
                              <LinkButton to={value.url}>
                                <ListFiles classId={classId} studyId={studyId} data={value}/>
                              </LinkButton>
                              <Divider/>
                            </div>
                          ))}
                        </Pageination>
                      </div>

                    </Grow>
          }
        </div>

      </div>
    </Navigation>
  );
};

Files.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

export default withStyles(styles)(Files);
