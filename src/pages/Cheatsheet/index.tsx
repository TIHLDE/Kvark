import { getDay, getHours } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import URLS from '~/URLS';
import { authClientWithRedirect } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useCheatsheet } from '~/hooks/Cheatsheet';
import { useInterval } from '~/hooks/Utils';
import Files from '~/pages/Cheatsheet/components/Files';
import { CheatsheetStudy } from '~/types/Enums';
import { getUserStudyShort } from '~/utils';

import type { Route } from './+types';

export async function clientLoader({ request, params }: Route.ClientLoaderArgs) {
  await authClientWithRedirect(request);

  return {
    studyId: params.studyId,
    classId: params.classId,
  };
}

export default function Cheetsheet({ loaderData }: Route.ComponentProps) {
  const { studyId, classId } = loaderData;
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
      case 'digtrans':
        return CheatsheetStudy.DIGTRANS;
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
  const files = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  const isURLValid = useCallback(() => {
    const study = getStudy();
    const studyClass = getClass();
    if (
      studyClass &&
      study &&
      ((study === CheatsheetStudy.DIGTRANS && [4, 5].includes(studyClass)) ||
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
  }, [getStudy, getClass, isURLValid]);

  const setStudyChoice = (newStudy: CheatsheetStudy) => {
    setInput('');
    setSearch('');
    if (newStudy !== getStudy() && newStudy === CheatsheetStudy.DIGTRANS) {
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

  useEffect(() => setLiveCheatingAmount(generateLiveCheatingAmount()), []);
  useInterval(() => setLiveCheatingAmount(generateLiveCheatingAmount()), 20000);

  return (
    <Page className='space-y-8 max-w-5xl w-full mx-auto'>
      <div className='space-y-2'>
        <h1 className='text-3xl md:text-5xl font-bold'>Kokeboka</h1>
        <div>
          <p>
            {getStudy()} - {getClass()}. klasse
          </p>
          <p>{liveCheatingAmount} brukere koker akkurat nå</p>
        </div>
      </div>

      <Card>
        <CardContent className='p-4 space-y-4'>
          <div className='flex items-center justify-between space-x-4'>
            <Select defaultValue={getStudy() || CheatsheetStudy.DATAING} onValueChange={(value) => setStudyChoice(value as CheatsheetStudy)}>
              <SelectTrigger>
                <SelectValue placeholder={CheatsheetStudy.DATAING} />
              </SelectTrigger>
              <SelectContent>
                {[CheatsheetStudy.DATAING, CheatsheetStudy.DIGFOR, CheatsheetStudy.DIGSEC, CheatsheetStudy.DIGTRANS, CheatsheetStudy.INFO].map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue={classId || '1'} onValueChange={(value) => setClassChoice(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder='Årstrinn' />
              </SelectTrigger>
              <SelectContent>
                {(getStudy() === CheatsheetStudy.DIGTRANS ? [4, 5] : [1, 2, 3]).map((i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {String(i).concat('. klasse')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input onChange={(e) => setInput(e.target.value)} placeholder='Søk' value={input} />
          </div>

          <Files files={files} getNextPage={fetchNextPage} hasNextPage={hasNextPage} isLoading={isLoading} />
        </CardContent>
      </Card>
    </Page>
  );
}
