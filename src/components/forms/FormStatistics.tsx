import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { useFormStatisticsById } from '~/hooks/Form';
import { FormFieldType } from '~/types/Enums';

export type EventFormEditorProps = {
  formId: string | null;
};

const FormStatistics = ({ formId }: EventFormEditorProps) => {
  const { data, isLoading } = useFormStatisticsById(formId || '-');
  if (isLoading) {
    return <h1 className='text-center'>Laster statistikken</h1>;
  } else if (!data) {
    return <h1 className='text-center'>Du må opprette et skjema for å se statistikken for det</h1>;
  } else if (!data.statistics.length) {
    return <h1 className='text-center'>Dette skjemaet har ingen flervalgsspørsmål</h1>;
  }

  return (
    <div className='space-y-2'>
      {data.statistics.map((stat, index) => (
        <div className='rounded-md border' key={index}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {`${stat.title}${stat.required ? ' *' : ''} (${stat.type === FormFieldType.MULTIPLE_SELECT ? 'Avkrysningsspørsmål' : 'Flervalgsspørsmål'})`}
                </TableHead>
                <TableHead className='w-[150px]'>Antall</TableHead>
                <TableHead className='w-[150px]'>Prosent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stat.options.map((option, index) => (
                <TableRow key={index}>
                  <TableCell>{option.title}</TableCell>
                  <TableCell className='w-[150px]'>{option.answer_amount} stk</TableCell>
                  <TableCell className='w-[150px]'>{option.answer_percentage.toFixed(2)} %</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default FormStatistics;
