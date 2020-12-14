import React, { useState, useCallback, useEffect } from 'react';
import Helmet from 'react-helmet';
import URLS from 'URLS';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserStudyShort, getParameterByName } from 'utils';
import { Study } from 'types/Enums';
import { Cheatsheet } from 'types/Types';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// API and store imports
import { useUser } from 'api/hooks/User';
import { useCheatsheet } from 'api/hooks/Cheatsheet';

// Project Components
import Banner from 'components/layout/Banner';
import Navigation from 'components/navigation/Navigation';
import Paper from 'components/layout/Paper';
import Files from 'containers/Cheatsheet/components/Files';

const useStyles = makeStyles((theme: Theme) => ({
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateAreas: '"filterStudy filterClass filterSearch"',
    gridGap: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateAreas: '"filterStudy filterClass" "filterSearch filterSearch"',
    },
  },
}));

const Cheetsheet = () => {
  const classes = useStyles();
  const { studyId, classId } = useParams();
  const navigate = useNavigate();
  const { getCheatsheets } = useCheatsheet();
  const { getUserData } = useUser();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [files, setFiles] = useState<Array<Cheatsheet>>([]);

  const getStudy = useCallback((): Study | undefined => {
    if (!studyId) {
      return undefined;
    }
    switch (studyId.toLowerCase()) {
      case 'dataing':
        return Study.DATAING;
      case 'digfor':
        return Study.DIGFOR;
      case 'digsec':
        return Study.DIGSEC;
      case 'digsam':
        return Study.DIGSAM;
      default:
        return undefined;
    }
  }, [studyId]);

  const getClass = useCallback((): number | undefined => {
    return classId ? Number(classId) : undefined;
  }, [classId]);

  const isURLValid = useCallback(() => {
    const study = getStudy();
    const studyClass = getClass();
    if (
      studyClass &&
      study &&
      ((study === Study.DIGSAM && [4, 5].includes(studyClass)) ||
        ([Study.DATAING, Study.DIGFOR, Study.DIGSEC].includes(study) && [1, 2, 3].includes(studyClass)))
    ) {
      return true;
    }
    return false;
  }, [getClass, getStudy]);

  const goToUserCheatsheet = useCallback(() => {
    getUserData().then((user) => {
      if (user && 1 <= user.user_study && user.user_study <= 4 && user.user_class > 0) {
        navigate(`${URLS.cheatsheet}${getUserStudyShort(user.user_study)}/${user.user_class}/`);
      } else {
        navigate(`${URLS.cheatsheet}${getUserStudyShort(1)}/1/`);
      }
    });
  }, [getUserData, navigate]);

  useEffect(() => {
    const study = getStudy();
    const studyClass = getClass();
    if (!study || !studyClass || !isURLValid()) {
      goToUserCheatsheet();
      return;
    }
    const filters = {
      page: page,
      search: search,
    };
    getCheatsheets(study, studyClass, filters)
      .then((data) => {
        const next = getParameterByName('page', data.next);
        setNextPage(next ? Number(next) : null);
        if (page === 1) {
          setFiles(data.results);
        } else {
          setFiles((prevFiles) => [...prevFiles, ...data.results]);
        }
      })
      .catch(() => {
        setNextPage(null);
        setFiles([]);
      });
  }, [getCheatsheets, getStudy, getClass, isURLValid, goToUserCheatsheet, page, search]);

  const setStudyChoice = (newStudy: Study) => {
    setInput('');
    setPage(1);
    setSearch('');
    if (newStudy !== getStudy() && newStudy === Study.DIGSAM) {
      if (![4, 5].includes(Number(classId))) {
        navigate(`${URLS.cheatsheet}${newStudy}/4/`);
      } else {
        navigate(`${URLS.cheatsheet}${newStudy}/${classId}/`);
      }
    } else if (newStudy !== getStudy()) {
      if (![1, 2, 3].includes(Number(classId))) {
        navigate(`${URLS.cheatsheet}${newStudy}/1/`);
      } else {
        navigate(`${URLS.cheatsheet}${newStudy}/${classId}/`);
      }
    }
  };

  const setClassChoice = (newClass: number) => {
    setPage(1);
    if (newClass !== getClass()) {
      navigate(`${URLS.cheatsheet}${studyId}/${newClass}/`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setSearch(input), 500);
    return () => clearTimeout(timer);
  }, [input]);

  const goToNextPage = () => {
    if (nextPage) {
      setPage(nextPage);
    }
  };

  return (
    <Navigation banner={<Banner text={`${getStudy()} - ${getClass()}. klasse`} title='Kokeboka' />} fancyNavbar>
      <Helmet>
        <title>Kokeboka - TIHLDE</title>
      </Helmet>
      <Paper>
        <div className={classes.filterContainer}>
          <TextField
            fullWidth
            label='Studie'
            onChange={(e) => setStudyChoice(e.target.value as Study)}
            select
            style={{ gridArea: 'filterStudy' }}
            value={getStudy()}
            variant='outlined'>
            {[Study.DATAING, Study.DIGFOR, Study.DIGSEC, Study.DIGSAM].map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label='Klasse'
            onChange={(e) => setClassChoice(Number(e.target.value))}
            select
            style={{ gridArea: 'filterClass' }}
            value={classId}
            variant='outlined'>
            {(getStudy() === Study.DIGSAM ? [4, 5] : [1, 2, 3]).map((i) => (
              <MenuItem key={i} value={i}>
                {String(i).concat('. klasse')}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label='Søk' onChange={(e) => setInput(e.target.value)} style={{ gridArea: 'filterSearch' }} value={input} variant='outlined' />
        </div>
        <Files files={files} goToNextPage={goToNextPage} nextPage={nextPage} />
      </Paper>
    </Navigation>
  );
};

export default Cheetsheet;
