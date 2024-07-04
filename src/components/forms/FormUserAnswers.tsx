import { SelectFieldSubmission, SelectFormField, TextFieldSubmission, TextFormField, UserSubmission } from 'types';
import { FormFieldType } from 'types/Enums';

import { useFormById } from 'hooks/Form';

import { Table, TableBody, TableCell, TableHead, TableRow } from 'components/ui/table';

export type FormUserAnswersProps = {
  submission: UserSubmission;
};

const FormUserAnswers = ({ submission }: FormUserAnswersProps) => {
  const { data: form, isLoading } = useFormById(submission.form);
  if (isLoading) {
    return <h1 className='text-center'>Laster statistikken</h1>;
  } else if (!form) {
    return <h1 className='text-center'>Kunne ikke finne spørsmålene</h1>;
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
    <div className='p-4 rounded-md border bg-card'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Spørsmål</TableCell>
            <TableCell>Svar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {form.fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{`${field.title}${field.required ? ' *' : ''}`}</TableCell>
              <TableCell>{getFieldAnswer(field)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FormUserAnswers;
