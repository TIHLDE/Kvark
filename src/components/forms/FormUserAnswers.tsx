import { FormFieldType } from 'types/Enums';
import { UserSubmission, TextFieldSubmission, SelectFieldSubmission, TextFormField, SelectFormField } from 'types';
import { useFormById } from 'hooks/Form';

// Material UI
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Project components
import Paper from 'components/layout/Paper';

export type FormUserAnswersProps = {
  submission: UserSubmission;
};

const FormUserAnswers = ({ submission }: FormUserAnswersProps) => {
  const { data: form, isLoading } = useFormById(submission.form);
  if (isLoading) {
    return <Typography>Laster statistikken</Typography>;
  } else if (!form) {
    return <Typography>Kunne ikke finne spørsmålene</Typography>;
  }

  const getFieldAnswer = (field: TextFormField | SelectFormField) => {
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
            <TableCell sx={{ fontWeight: 'bold' }}>Spørsmål</TableCell>
            <TableCell align='right' sx={{ fontWeight: 'bold' }}>
              Svar
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {form.fields.map((field) => (
            <TableRow key={field.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{`${field.title}${field.required ? ' *' : ''}`}</TableCell>
              <TableCell align='right'>{getFieldAnswer(field)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormUserAnswers;
