import { useState, useCallback, useEffect, useMemo } from 'react';
import URLS from 'URLS';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserStudyShort } from 'utils';
import { Study } from 'types/Enums';

// Material UI Components
import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// API and store imports
import { useUser } from 'hooks/User';
import { useCheatsheet } from 'hooks/Cheatsheet';

// Project Components
import Banner from 'components/layout/Banner';
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import Files from 'pages/Cheatsheet/components/Files';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateAreas: '"filterStudy filterClass filterSearch"',
    gridGap: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateAreas: '"filterStudy filterClass" "filterSearch filterSearch"',
    },
  },
}));

const Cheetsheet = () => {
  const classes = useStyles();
  const { studyId, classId } = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

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
        return Study.DATAING;
    }
  }, [studyId]);

  const getClass = useCallback((): number | undefined => {
    return classId ? Number(classId) : undefined;
  }, [classId]);

  const { data, hasNextPage, fetchNextPage, isLoading } = useCheatsheet(getStudy() || Study.DATAING, getClass() || 1, { search: search });
  const files = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

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
    if (user && 1 <= user.user_study && user.user_study <= 4 && user.user_class > 0) {
      navigate(`${URLS.cheatsheet}${getUserStudyShort(user.user_study)}/${user.user_class}/`, { replace: true });
    } else {
      navigate(`${URLS.cheatsheet}${getUserStudyShort(1)}/1/`, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const study = getStudy();
    const studyClass = getClass();
    if (!study || !studyClass || !isURLValid()) {
      goToUserCheatsheet();
    }
  }, [getStudy, getClass, isURLValid, goToUserCheatsheet, search]);

  const setStudyChoice = (newStudy: Study) => {
    setInput('');
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
    if (newClass !== getClass()) {
      navigate(`${URLS.cheatsheet}${studyId}/${newClass}/`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setSearch(input), 500);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <Page
      banner={<Banner text={`${getStudy()} - ${getClass()}. klasse`} title='Kokeboka' />}
      options={{ title: `${getStudy()} - ${getClass()}. klasse - Kokeboka` }}>
      <Paper className={classes.root}>
        <div className={classes.filterContainer}>
          <TextField
            fullWidth
            label='Studie'
            onChange={(e) => setStudyChoice(e.target.value as Study)}
            select
            style={{ gridArea: 'filterStudy' }}
            value={getStudy() || Study.DATAING}
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
            value={classId || 1}
            variant='outlined'>
            {(getStudy() === Study.DIGSAM ? [4, 5] : [1, 2, 3]).map((i) => (
              <MenuItem key={i} value={i}>
                {String(i).concat('. klasse')}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label='Søk' onChange={(e) => setInput(e.target.value)} style={{ gridArea: 'filterSearch' }} value={input} variant='outlined' />
        </div>
        <Files files={files} getNextPage={fetchNextPage} hasNextPage={hasNextPage} isLoading={isLoading} />
      </Paper>
    </Page>
  );
};

export default Cheetsheet;
