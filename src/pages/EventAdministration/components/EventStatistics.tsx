import { cn } from 'lib/utils';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Event } from 'types';

import { useEventStatistics } from 'hooks/Event';

type StatProps = {
  label: string;
  number: number;
  active: boolean;
  onClick: (label: string) => void;
};

const Stat = ({ label, number, active, onClick }: StatProps) => {
  function onClickStat(label: string) {
    onClick(label);
  }

  return (
    <button
      className={cn('p-4 rounded-md border text-center hover:bg-accent hover:text-accent-foreground', active ? 'border-primary' : null)}
      onClick={() => onClickStat(label)}>
      <h1 className='text-2xl font-bold'>{number}</h1>
      <p className='text-xs lg:text-base text-muted-foreground'>{label}</p>
    </button>
  );
};

export type EventStatisticsProps = {
  eventId: Event['id'];
  isPaid: boolean;
};

const EventStatistics = ({ eventId, isPaid }: EventStatisticsProps) => {
  const { data } = useEventStatistics(eventId);
  const [searchParams, setSearchParams] = useSearchParams();
  function handleFiltering(category: string, label: string) {
    if (searchParams.get(category) === label) {
      searchParams.delete(category);
    } else {
      searchParams.set(category, label);
    }
    setSearchParams(searchParams);
  }
  if (!data) {
    return null;
  }

  return (
    <div className='space-y-2'>
      <p>{`Ankommet: ${data.has_attended_count} av ${data.list_count} påmeldte`}</p>
      <div className='space-y-1'>
        <h1>Klasse:</h1>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {data.studyyears.map((studyyear) => (
            <Stat
              active={searchParams.get('year') === studyyear.studyyear}
              key={studyyear.studyyear}
              label={studyyear.studyyear}
              number={studyyear.amount}
              onClick={(label) => handleFiltering('year', label)}
            />
          ))}
        </div>
      </div>
      <div className='space-y-1'>
        <h1>Studie:</h1>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {data.studies.map((study) => (
            <Stat
              active={searchParams.get('study') === study.study}
              key={study.study}
              label={study.study}
              number={study.amount}
              onClick={(label) => handleFiltering('study', label)}
            />
          ))}
        </div>
      </div>
      <div className='space-y-1'>
        <h1>Annet:</h1>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <Stat
            active={Boolean(searchParams.get('has_allergy'))}
            key='Allergi'
            label='Allergi'
            number={data.has_allergy_count}
            onClick={() => handleFiltering('has_allergy', 'true')}
          />
          <Stat
            active={Boolean(searchParams.get('allow_photo'))}
            key='allow_photo'
            label='Samtykker ikke fotografering'
            number={data.allow_photo_count}
            onClick={() => handleFiltering('allow_photo', 'false')}
          />
          {Boolean(isPaid) && (
            <Stat
              active={Boolean(searchParams.get('has_paid'))}
              key='has_paid'
              label='Betalt'
              number={data.has_paid_count}
              onClick={() => handleFiltering('has_paid', 'true')}
            />
          )}
          <Stat
            active={Boolean(searchParams.get('has_attended'))}
            key='has_attended'
            label='Ikke ankommet'
            number={data.list_count - data.has_attended_count}
            onClick={() => handleFiltering('has_attended', 'false')}
          />
        </div>
      </div>
    </div>
  );
};

export default EventStatistics;
