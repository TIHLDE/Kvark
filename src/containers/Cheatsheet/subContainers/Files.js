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

const styles = (theme) => ({
  wrapper: {
    paddingTop: 10,
    maxWidth: 1200,
    position: 'relative',
    margin: 'auto',
    '@media only screen and (max-width: 800px)': {
      padding: '60px 0px 48px 0px',
    },
  },
  container: {
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    backgroundColor: theme.colors.background.light,
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
  const {classes, match} = props;
  const {studyId, classId} = match.params;

  const [files, setFiles] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [input, setInput] = useState('');
  const [nextPage, setNextPage] = useState(null);

  const loadFiles = (filters, replace) => {
    let urlParameters = filters ? {...filters} : {};

    // Decide if we should go to next page or not.
    if (nextPage) {
      urlParameters = {
        page: nextPage,
        ...urlParameters,
      };
    }

    CheatsheetService.getCheatsheets(urlParameters, studyId.toString().toUpperCase(), getClass(classId))
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

          if (replace) {
            displayedFiles = files.concat(displayedFiles);
          }
          setFiles(displayedFiles);
          setNextPage(nextPage);
          setIsFetching(false);
        });
  };

  const filterFiles = async (e, searchInput) => {
    e.preventDefault();

    setIsFetching(true);
    setNextPage(null);
    setFiles([]);

    if (searchInput === '') {
      loadFiles();
    } else {
      const filters = {};
      filters.search = searchInput;
      loadFiles(filters, false);
    }
  };

  const search = (e) => {
    e.preventDefault();
    setInput(e.target.value);
    filterFiles(e, e.target.value);
  };

  const getNextPage = () => {
    const search = input;
    const filters = {};
    if (search) {
      filters.search = search;
    }
    loadFiles(filters, true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadFiles();
    // eslint-disable-next-line
  }, []);

  return (
    <Navigation whitesmoke footer fancyNavbar>
      <Banner title='Kokebok' text={studyId + ' - ' + String(classId).concat('. klasse')} />
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <div className={classes.filterContainer}>
            <TextField variant='outlined' className={classes.box} value={input} label='Søk' fullWidth placeholder='Søk...' onChange={(e) => search(e)}/>
          </div>
          {isFetching ? <CircularProgress className={classes.progress} /> :
            <Grow in={!isFetching}>
              <div>
                <Hidden xsDown>
                  <ListItem className={classes.btn}>
                    <Grid className={classNames(classes.grid)} container direction='row' wrap='nowrap' alignItems='center'>
                      <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'>Tittel:</Typography>
                      <Typography className={classes.title} variant='subtitle1'>Beskrivelse:</Typography>
                      <Typography className={classes.title} variant='subtitle1'>Av:</Typography>
                      <Typography className={classNames(classes.title, classes.class)} variant='subtitle1'>Fag:</Typography>
                    </Grid>
                  </ListItem>
                </Hidden>
                <Divider/>
                <Pageination nextPage={getNextPage} page={nextPage} fullWidth>
                  {files && files.map((value, index) => (
                    <React.Fragment key={index}>
                      <LinkButton to={value.url}>
                        <ListFiles classId={classId} studyId={studyId} data={value}/>
                      </LinkButton>
                      <Divider/>
                    </React.Fragment>
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
