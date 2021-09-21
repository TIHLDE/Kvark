import { FormFieldType } from 'types/Enums';
import { useFormStatisticsById } from 'hooks/Form';

// Material UI
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Stack } from '@mui/material';

// Project components
import Paper from 'components/layout/Paper';

export type EventFormEditorProps = {
  formId: string | null;
};

const FormStatistics = ({ formId }: EventFormEditorProps) => {
  const { data, isLoading } = useFormStatisticsById(formId || '-');
  if (isLoading) {
    return <Typography>Laster statistikken</Typography>;
  } else if (!data) {
    return <Typography>Du må opprette et skjema for å se statistikken for det</Typography>;
  } else if (!data.statistics.length) {
    return <Typography>Dette skjemaet har ingen flervalgsspørsmål</Typography>;
  }

  return (
    <Stack gap={1}>
      {data.statistics.map((stat) => (
        <TableContainer component={Paper} key={stat.id} noPadding>
          <Table aria-label={`Statistikk for ${stat.title}`} size='small' sx={{ minWidth: 250 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{`${stat.title}${stat.required ? ' *' : ''} (${
                  stat.type === FormFieldType.MULTIPLE_SELECT ? 'Avkrysningsspørsmål' : 'Flervalgsspørsmål'
                })`}</TableCell>
                <Tooltip placement='top-end' title='Totalt antall som har valgt alternativet'>
                  <TableCell align='right' sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Antall
                  </TableCell>
                </Tooltip>
                <Tooltip placement='top-end' title='Prosent av totalt antall som har valgt alternativet'>
                  <TableCell align='right' sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Prosent
                  </TableCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody>
              {stat.options.map((option) => (
                <TableRow key={option.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{option.title}</TableCell>
                  <TableCell align='right'>{option.answer_amount} stk</TableCell>
                  <TableCell align='right'>{option.answer_percentage.toFixed(2)} %</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Stack>
  );
};

export default FormStatistics;
