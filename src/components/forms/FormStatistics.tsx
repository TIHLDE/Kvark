import { FormFieldType } from 'types/Enums';
import { useFormById, useCreateForm, useFormStatisticsById } from 'hooks/Form';

// Material UI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Project components
import Paper from 'components/layout/Paper';

export type EventFormEditorProps = {
  formId: string | null;
};

const stats = [
  {
    id: '32f909c9-ec61-4762-a92f-550d76a40a50',
    title: 'Hva vil du spise?',
    options: [
      {
        id: '6d78f41-ac75-461d-8a34-19a6cf7b8415',
        title: 'Sushi',
        answer_amount: 2,
      },
      {
        id: '-ac75-461d-8a3419a6cf7b8415',
        title: 'Pizza',
        answer_amount: 10,
      },
      {
        id: '-ac75-461d-8a34-196cf7b8415',
        title: 'Pizza',
        answer_amount: 10,
      },
      {
        id: '-ac75-461d-8a34-19a6cf7b815',
        title: 'Pizza',
        answer_amount: 10,
      },
    ],
    type: FormFieldType.SINGLE_SELECT,
    required: false,
  },
  {
    id: '32f909c9-ec61-4762-a92f-5507a40a50',
    title: 'Hva vil du spise?',
    options: [
      {
        id: '6d78f41e-ac75-461d-8a34-19a6cf7b8415',
        title: 'Sushi',
        answer_amount: 2,
      },
      {
        id: '-ac75-461d-8a34-19a6cf7b815',
        title: 'Pizza',
        answer_amount: 10,
      },
      {
        id: '-ac75-461d-8a34-19a6f7b8415',
        title: 'Pizza',
        answer_amount: 10,
      },
      {
        id: '-ac75-461d-8a4-19a6cf7b8415',
        title: 'Pizza',
        answer_amount: 10,
      },
      {
        id: '-ac75-461-8a34-19a6cf7b8415',
        title: 'Pizza',
        answer_amount: 10,
      },
    ],
    type: FormFieldType.MULTIPLE_SELECT,
    required: true,
  },
];

const FormStatistics = ({ formId }: EventFormEditorProps) => {
  // const { data, isLoading } = useFormStatisticsById(formId || '-');
  // if (isLoading) {
  //   return <Typography variant='h3'>Laster statistikken</Typography>;
  // }

  return (
    <>
      {stats.map((stat) => (
        <TableContainer component={Paper} key={stat.id} noPadding sx={{ mb: 1 }}>
          <Table aria-label={`Statistikk for ${stat.title}`} size='small' sx={{ minWidth: 250 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{`${stat.title}${stat.required ? ' *' : ''} (${
                  stat.type === FormFieldType.MULTIPLE_SELECT ? 'Avkrysningsspørsmål' : 'Flervalgsspørsmål'
                })`}</TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                  Antall
                </TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                  Prosent
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stat.options.map((option) => (
                <TableRow key={option.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{option.title}</TableCell>
                  <TableCell align='right'>{option.answer_amount} stk</TableCell>
                  <TableCell align='right'>
                    {((option.answer_amount / stat.options.map((opt) => opt.answer_amount).reduce((prev, curr) => prev + curr)) * 100).toFixed(2)} %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
};

export default FormStatistics;
