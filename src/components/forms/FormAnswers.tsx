import { useState } from 'react';
import { FormFieldType } from 'types/Enums';
import { UserSubmission, TextFieldSubmission, SelectFieldSubmission, TextFormField, SelectFormField } from 'types';
import { useFormById, useFormSubmissions } from 'hooks/Form';

// Material UI
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination } from '@mui/material';

// Project components
import Paper from 'components/layout/Paper';

export type FormAnswersProps = {
  formId: string | null;
};

const FormAnswers = ({ formId }: FormAnswersProps) => {
  const [selectedPage, setSelectedPage] = useState(0);
  const { data: form } = useFormById(formId || '-');
  const { data, isLoading } = useFormSubmissions(formId || '-', selectedPage + 1);
  if (isLoading) {
    return <Typography>Laster statistikken</Typography>;
  } else if (!data || !form) {
    return <Typography>Du må opprette et skjema for å se svar</Typography>;
  } else if (!data.results.length) {
    return <Typography>Ingen har svart på dette skjemaet</Typography>;
  }

  const getTableCellText = (field: TextFormField | SelectFormField, submission: UserSubmission) => {
    const answer = submission.answers.find((ans) => ans.field.id === field.id);
    if (answer === undefined) {
      return '';
    } else if (field.type === FormFieldType.TEXT_ANSWER) {
      return (answer as TextFieldSubmission).answer_text;
    } else {
      return (answer as SelectFieldSubmission).selected_options.map((opt) => field.options.find((o) => o.id === opt.id)?.title || '').join(', ');
    }
  };

  return (
    <TableContainer component={Paper} noPadding>
      <Table aria-label={`Svar for ${form.title}`} size='small' sx={{ minWidth: 250 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Navn</TableCell>
            {form.fields.map((field) => (
              <TableCell align='right' key={field.id} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {`${field.title}${field.required ? ' *' : ''}`}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.results.map((submission) => (
            <TableRow key={submission.user.user_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                {submission.user.first_name} {submission.user.last_name}
              </TableCell>
              {form.fields.map((field) => (
                <TableCell align='right' key={field.id}>
                  {getTableCellText(field, submission)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={data.count}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} av ${count}`}
              onPageChange={(_, p) => setSelectedPage(p)}
              page={selectedPage}
              rowsPerPage={25}
              rowsPerPageOptions={[-1]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default FormAnswers;
