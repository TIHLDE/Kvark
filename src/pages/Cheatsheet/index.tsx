import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { MenuItem, styled, TextField } from '@mui/material';
import { getDay, getHours } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';
import { getUserStudyShort } from 'utils';

import { CheatsheetStudy } from 'types/Enums';

import { useCheatsheet } from 'hooks/Cheatsheet';
import { useInterval } from 'hooks/Utils';

import Files from 'pages/Cheatsheet/components/Files';

import Banner from 'components/layout/Banner';
import { BannerButton } from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import Page from 'components/navigation/Page';

const FilterContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateAreas: '"filterStudy filterClass filterSearch"',
  gap: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateAreas: '"filterStudy filterClass" "filterSearch filterSearch"',
  },
}));

const Cheetsheet = () => {
  const { studyId, classId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const getStudy = useCallback((): CheatsheetStudy | undefined => {
    if (!studyId) {
      return undefined;
    }
    switch (studyId.toLowerCase()) {
      case 'dataing':
        return CheatsheetStudy.DATAING;
      case 'digfor':
        return CheatsheetStudy.DIGFOR;
      case 'digsec':
        return CheatsheetStudy.DIGSEC;
      case 'digsam':
        return CheatsheetStudy.DIGSAM;
      case 'info':
        return CheatsheetStudy.INFO;
      default:
        return CheatsheetStudy.DATAING;
    }
  }, [studyId]);

  const getClass = useCallback((): number | undefined => {
    return classId ? Number(classId) : undefined;
  }, [classId]);

  const { data, hasNextPage, fetchNextPage, isLoading } = useCheatsheet(getStudy() || CheatsheetStudy.DATAING, getClass() || 1, { search: search });
  const files = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const isURLValid = useCallback(() => {
    const study = getStudy();
    const studyClass = getClass();
    if (
      studyClass &&
      study &&
      ((study === CheatsheetStudy.DIGSAM && [4, 5].includes(studyClass)) ||
        ([CheatsheetStudy.DATAING, CheatsheetStudy.DIGFOR, CheatsheetStudy.DIGSEC, CheatsheetStudy.INFO].includes(study) && [1, 2, 3].includes(studyClass)))
    ) {
      return true;
    }
    return false;
  }, [getClass, getStudy]);

  useEffect(() => {
    const study = getStudy();
    const studyClass = getClass();
    if (!study || !studyClass || !isURLValid()) {
      navigate(`${URLS.cheatsheet}${getUserStudyShort(1)}/1/`, { replace: true });
    }
  }, [getStudy, getClass, isURLValid, search]);

  const setStudyChoice = (newStudy: CheatsheetStudy) => {
    setInput('');
    setSearch('');
    if (newStudy !== getStudy() && newStudy === CheatsheetStudy.DIGSAM) {
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

  const [liveCheatingAmount, setLiveCheatingAmount] = useState(1);

  /**
   * Generate a fake number of other cheatsheet-visitors right now.
   * The number never change by more than 1 to simulate a natural increase/decrease of traffic.
   * Time of day and weekday vs weekend is also taken into account to make things believable.
   */
  const generateLiveCheatingAmount = useCallback(() => {
    const hour = getHours(new Date());
    const isWeekday = getDay(new Date()) > 0 && getDay(new Date()) < 6;
    const max = isWeekday ? (hour < 7 || hour > 20 ? 1 : hour < 16 ? 4 : 2) : 1;
    const direction = Math.round(Math.random() * 2);
    return direction === 0 && liveCheatingAmount < max
      ? liveCheatingAmount + 1
      : direction === 1 && liveCheatingAmount > 0
      ? liveCheatingAmount - 1
      : liveCheatingAmount;
  }, [liveCheatingAmount]);

  const generateCheatSheetMail = () => {
    const emailTo = 'index@tihlde.org';
    const subject = 'Kokebokforslag fra bruker';
    const emailBody =
      'Hei, ærede Indexere! %0d%0a' +
      'Jeg har et bidrag til kokeboka, som jeg veldig gjerne vil at dere skal ta en titt på. %0d%0a %0d%0a' +
      '(Legg til filer som vedlegg på denne eposten) %0d%0a %0d%0a' +
      'Med vennlig hilsen %0d%0a' +
      '*Fyll inn navnet ditt her*';
    document.location = 'mailto:' + emailTo + '?subject=' + subject + '&body=' + emailBody;
  };

  useEffect(() => setLiveCheatingAmount(generateLiveCheatingAmount()), []);
  useInterval(() => setLiveCheatingAmount(generateLiveCheatingAmount()), 20000);

  return (
    <Page
      banner={
        <Banner text={`${getStudy()} - ${getClass()}. klasse\n**${liveCheatingAmount}** brukere koker akkurat nå`} title='Kokeboka'>
          <BannerButton
            endIcon={<MailOutlineIcon />} // Adding the EmailIcon as the end icon
            onClick={generateCheatSheetMail}
            variant='outlined'>
            Bidra til kokeboka!
          </BannerButton>
        </Banner>
      }
      options={{ title: `${getStudy()} - ${getClass()}. klasse - Kokeboka` }}>
      <Paper sx={{ mb: 2 }}>
        <FilterContainer>
          <TextField
            fullWidth
            label='Studie'
            onChange={(e) => setStudyChoice(e.target.value as CheatsheetStudy)}
            select
            sx={{ gridArea: 'filterStudy' }}
            value={getStudy() || CheatsheetStudy.DATAING}
            variant='outlined'>
            {[CheatsheetStudy.DATAING, CheatsheetStudy.DIGFOR, CheatsheetStudy.DIGSEC, CheatsheetStudy.DIGSAM, CheatsheetStudy.INFO].map((i) => (
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
            sx={{ gridArea: 'filterClass' }}
            value={classId || 1}
            variant='outlined'>
            {(getStudy() === CheatsheetStudy.DIGSAM ? [4, 5] : [1, 2, 3]).map((i) => (
              <MenuItem key={i} value={i}>
                {String(i).concat('. klasse')}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label='Søk' onChange={(e) => setInput(e.target.value)} sx={{ gridArea: 'filterSearch' }} value={input} variant='outlined' />
        </FilterContainer>
        <Files files={files} getNextPage={fetchNextPage} hasNextPage={hasNextPage} isLoading={isLoading} />
      </Paper>
    </Page>
  );
};

export default Cheetsheet;
