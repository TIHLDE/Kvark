import { Event } from 'types';

import { useEventStatistics } from 'hooks/Event';

type StatProps = {
  label: string;
  number: number;
};

const Stat = ({ label, number }: StatProps) => (
  <div className='p-4 rounded-md border text-center'>
    <h1 className='text-2xl font-bold'>{number}</h1>
    <p className='text-xs lg:text-base text-muted-foreground'>{label}</p>
  </div>
);

export type EventStatisticsProps = {
  eventId: Event['id'];
};

const EventStatistics = ({ eventId }: EventStatisticsProps) => {
  const { data } = useEventStatistics(eventId);

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
            <Stat key={studyyear.studyyear} label={studyyear.studyyear} number={studyyear.amount} />
          ))}
        </div>
      </div>
      <div className='space-y-1'>
        <h1>Studie:</h1>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {data.studies.map((study) => (
            <Stat key={study.study} label={study.study} number={study.amount} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventStatistics;
