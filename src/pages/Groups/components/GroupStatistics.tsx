import { useGroupStatistics } from 'hooks/Group';

import { Card, CardContent } from 'components/ui/card';

export type GroupStatisticsProps = {
  slug: string;
};

type StatProps = {
  label: string;
  number: number;
};

const Stat = ({ label, number }: StatProps) => (
  <Card className='w-full bg-background'>
    <CardContent className='py-2 text-center space-y-1'>
      <h1 className='text-sm lg:text-md'>{label}</h1>
      <h1 className='text-2xl lg:text-3xl font-semibold'>{number}</h1>
    </CardContent>
  </Card>
);

const GroupStatistics = ({ slug }: GroupStatisticsProps) => {
  const { data } = useGroupStatistics(slug);

  if (!data) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='pb-2'>Klasse:</h1>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {data.studyyears.map((studyyear) => (
            <Stat key={studyyear.studyyear} label={studyyear.studyyear} number={studyyear.amount} />
          ))}
        </div>
      </div>

      <div>
        <h1 className='pb-2'>Studie:</h1>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {data.studies.map((study) => (
            <Stat key={study.study} label={study.study} number={study.amount} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupStatistics;
