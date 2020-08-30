import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import URLS from '../../URLS';
import {useHistory, useParams} from 'react-router-dom';
import {getUserStudyShort, getUserClass} from '../../utils';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

// API and store imports
import CheatsheetService from '../../api/services/CheatsheetService';
import UserService from '../../api/services/UserService';

// Project Components
import Pageination from '../../components/layout/Pageination';
import Banner from '../../components/layout/Banner';
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';

import {Initial, Loading, Success} from 'lemons';

const styles = (theme) => ({
  wrapper: {
    maxWidth: 1200,
    position: 'relative',
    margin: 'auto',
    padding: 10,
    '@media only screen and (max-width: 800px)': {
      paddingTop: 20,
    },
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateAreas: '"filterStudy filterClass filterSearch"',
    gridGap: 10,
    paddingBottom: 20,
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateAreas:
        '"filterStudy filterClass" "filterSearch filterSearch"',
    },
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,
  },
  filesHeaderContainer: {
    display: 'grid',
    width: '100%',
    textAlign: 'left',
    paddingLeft: 16,
    paddingRight: 16,
    gridGap: 20,
    gridTemplateColumns: '4fr 2fr 3fr',
    '@media only screen and (max-width: 800px)': {
      display: 'none',
    },
  },
  filesHeader: {
    fontWeight: 'bold',
  },
  file: {
    display: 'grid',
    gridGap: '15px',
    width: '100%',
    gridTemplateColumns: '4fr 2fr 3fr',
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr 1fr',
      maxWidth: '100vw',
      gridGap: '0',
    },
  },
  listItem: {
    marginBottom: 10,
  },
  hide: {
    '@media only screen and (max-width: 800px)': {
      display: 'none',
    },
  },
});

const getClass = (i) => {
  switch (i) {
    case 1:
      return 'FIRST';
    case 2:
      return 'SECOND';
    case 3:
      return 'THIRD';
    case 4:
      return 'FOURTH';
    case 5:
      return 'FIFTH';
    default:
      return '?';
  }
};

const getStudy = (i) => {
  switch (i) {
    case 'Dataing':
      return 1;
    case 'DigFor':
      return 2;
    case 'DigInc':
      return 3;
    case 'DigSam':
      return 4;
    case 'Drift':
      return 5;
    default:
      return -1;
  }
};

const Cheetsheet = (props) => {
  const {classes} = props;
  const history = useHistory();
  const {studyId, classId} = useParams();
  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = useState(Initial());
  const [input, setInput] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [classChoice, setClassChoice] = useState(classId);
  const [studyChoice, setStudyChoice] = useState(getStudy(studyId));

  const loadFiles = (filters = {}, concat = false) => {
    if (!isURLValid()) return;
    let urlParameters = filters;

    // Decide if we should go to next page or not.
    if (nextPage) {
      urlParameters = {
        page: nextPage,
        ...urlParameters,
      };
    }
    const study = String(getUserStudyShort(studyChoice));
    const grade = String(getClass(Number(classChoice)));

    CheatsheetService.getCheatsheets(
        urlParameters, study.toUpperCase(), grade,
    ).then((data) => {
      let displayedFiles = [];
      if (data) {
        const nextPageUrl = data.next;
        displayedFiles = data.results;
        urlParameters = {};
        // If we have a url for the next page convert it into a object
        if (nextPageUrl) {
          const nextPageUrlQuery = nextPageUrl.substring(
              nextPageUrl.indexOf('?') + 1,
          );
          const parameterArray = nextPageUrlQuery.split('&');
          parameterArray.forEach((parameter) => {
            const parameterString = parameter.split('=');
            urlParameters[parameterString[0]] = parameterString[1];
          });
        }
      }
      const nextPage = urlParameters['page'] ? urlParameters['page'] : null;

      if (concat) {
        displayedFiles = submitFormLazy._r.result?.concat(displayedFiles);
      }
      setNextPage(nextPage);
      // eslint-disable-next-line new-cap
      setSubmitFormLazy(Success(displayedFiles));
    });
  };

  const loadUserData = () => {
    UserService.getUserData()
        .then((user) => {
          setClassChoice(user.user_class);
          setStudyChoice(user.user_study);
          history.replace(
              URLS.cheatsheet.concat(
                  getUserStudyShort(user.user_study), '/', user.user_class, '/',
              ),
          );
        })
        .catch(() => { })
        // eslint-disable-next-line new-cap
        .finally(() => setSubmitFormLazy(Success()));
  };

  const filterFiles = (searchInput = '') => {
    // eslint-disable-next-line new-cap
    setSubmitFormLazy(Loading());
    setNextPage(null);

    if (searchInput === '') {
      loadFiles();
    } else {
      const filters = {search: searchInput};
      loadFiles(filters, false);
    }
  };

  const getNextPage = () => {
    const filters = {};
    if (input) filters.search = input;
    loadFiles(filters, true);
  };

  const isURLValid = () => {
    if (!classChoice || !studyId || getStudy(studyId) < 1 ||
      (getStudy(studyId) === 4 && ![4, 5].includes(Number(classChoice))) ||
      ([1, 2, 3, 5].includes(getStudy(studyId)) && ![1, 2, 3].includes(Number(classChoice)))
    ) {
      loadUserData();
      return false;
    } else return true;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    if (studyChoice === 4) {
      if (![4, 5].includes(classChoice)) {
        setClassChoice(4);
      }
    } else if (![1, 2, 3].includes(classChoice)) {
      setClassChoice(1);
    }
    if (isURLValid()) {
      setInput('');
      history.replace(URLS.cheatsheet.concat(getUserStudyShort(studyChoice), '/', classChoice, '/'));
      filterFiles();
    }
    // eslint-disable-next-line
  }, [classChoice, studyChoice]);

  useEffect(() => {
    if (isURLValid()) {
      const searchInput = input;
      const timer = setTimeout(() => filterFiles(searchInput), 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [input]);

  return (
    <Navigation whitesmoke footer fancyNavbar>
      <Helmet>
        <title>Kokeboka - TIHLDE</title>
      </Helmet>
      <Banner
        title="Kokeboka"
        text={
          getUserStudyShort(studyChoice) +
          ' - ' +
          String(classChoice).concat('. klasse')
        }
      />

      {isURLValid() && (
        <div className={classes.wrapper}>
          <Paper>
            <div className={classes.filterContainer}>
              <TextField
                variant="outlined"
                style={{gridArea: 'filterStudy'}}
                className={classes.box}
                select
                fullWidth
                label="Studie"
                value={studyChoice}
                onChange={(e) => setStudyChoice(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <MenuItem key={i} value={i}>
                    {getUserStudyShort(i)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="outlined"
                style={{gridArea: 'filterClass'}}
                className={classes.box}
                select
                fullWidth
                label="Klasse"
                value={classChoice}
                onChange={(e) => setClassChoice(e.target.value)}
              >
                {(studyChoice === 4 ? [4, 5] : [1, 2, 3]).map((i) => (
                  <MenuItem key={i} value={i}>
                    {getUserClass(i)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="outlined"
                style={{gridArea: 'filterSearch'}}
                value={input}
                label="Søk"
                fullWidth
                placeholder="Søk..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            {submitFormLazy.dispatch(
                () => null, () => (
                  <CircularProgress className={classes.progress} />
                ), () => (
                  <>
                    <div>Error</div>
                  </>
                ), (files) => (
                  <Grow in={submitFormLazy.isSuccess()}>
                    <div>
                      <Hidden xsDown>
                        <Grid
                          className={classes.filesHeaderContainer}
                          container
                          direction="row"
                          wrap="nowrap"
                          alignItems="center"
                        >
                          <Typography
                            className={classes.filesHeader}
                            variant="subtitle1"
                          >
                          Tittel:
                          </Typography>
                          <Typography
                            className={classes.filesHeader}
                            variant="subtitle1"
                          >
                          Av:
                          </Typography>
                          <Typography
                            className={classes.filesHeader}
                            variant="subtitle1"
                          >
                          Fag:
                          </Typography>
                        </Grid>
                      </Hidden>
                      {studyChoice !== 0 && classChoice !== 0 && (
                        <Pageination
                          nextPage={getNextPage}
                          page={nextPage}
                          fullWidth
                        >
                          <List aria-label="Filer">
                            {files?.map((file, index) => (
                              <Paper
                                key={index}
                                className={classes.listItem}
                                noPadding
                              >
                                <ListItem
                                  button
                                  href={file.url}
                                  component="a"
                                  target="_blank"
                                  rel="_noopener"
                                >
                                  <Grid
                                    className={classes.file}
                                    container
                                    direction="row"
                                    wrap="nowrap"
                                    alignItems="center"
                                  >
                                    <Typography variant="subtitle1">
                                      <strong>{file.title}</strong>
                                    </Typography>
                                    <Typography
                                      className={classes.hide}
                                      variant="subtitle1"
                                    >
                                      {file.creator}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                      {file.course}
                                    </Typography>
                                  </Grid>
                                </ListItem>
                              </Paper>
                            ))}
                          </List>
                        </Pageination>
                      )}
                    </div>
                  </Grow>
                ),
            )}
          </Paper>
        </div>
      )}
    </Navigation>
  );
};

Cheetsheet.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Cheetsheet);
