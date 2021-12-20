import { useState } from 'react';
import { FormFieldType } from 'types/Enums';
import { UserSubmission, TextFieldSubmission, SelectFieldSubmission, TextFormField, SelectFormField } from 'types';
import { useFormById, useFormSubmissions } from 'hooks/Form';
import { SUBMISSIONS_ENDPOINT, FORMS_ENDPOINT } from 'api/api';
import { getCookie } from 'api/cookie';
import { TOKEN_HEADER_NAME, TIHLDE_API_URL, ACCESS_TOKEN } from 'constant';
import { urlEncode } from 'utils';

// Material UI
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination } from '@mui/material';
import DownloadIcon from '@mui/icons-material/FileDownloadRounded';

// Project components
import Paper from 'components/layout/Paper';
import { useSnackbar } from 'hooks/Snackbar';

export type FormAnswersProps = {
  formId: string | null;
};

const FormAnswers = ({ formId }: FormAnswersProps) => {
  const showSnackbar = useSnackbar();
  const [selectedPage, setSelectedPage] = useState(0);
  const { data: form, isLoading: isFormLoading } = useFormById(formId || '-');
  const { data, isLoading, error } = useFormSubmissions(formId || '-', selectedPage + 1);

  if (isLoading || isFormLoading) {
    return <Typography>Laster statistikken...</Typography>;
  } else if (error) {
    return <Typography>Noe gikk galt: {error.detail}</Typography>;
  } else if (!form || !formId || !data) {
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

  const downloadCSV = async () => {
    try {
      const headers = new Headers();
      headers.append('Accept', 'text/csv');
      headers.append(TOKEN_HEADER_NAME, getCookie(ACCESS_TOKEN) as string);
      const response = await fetch(`${TIHLDE_API_URL}${FORMS_ENDPOINT}/${formId}/${SUBMISSIONS_ENDPOINT}/download/`, {
        headers,
        method: 'GET',
      });
      if (response.ok) {
        const blob = await response.blob();
        // Creates a hidden <a> element
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        // Adds a object url to the link
        const url = URL.createObjectURL(blob);
        a.href = url;
        // Set filename
        a.download = `${urlEncode(form.title)}_${form.type}.csv`;
        // Clicks the link to download the file
        a.click();
        // Revokes link and removes the <a> from document
        URL.revokeObjectURL(url);
        a.remove();
      } else {
        showSnackbar('Noe gikk galt', 'error');
      }
    } catch {
      showSnackbar('Noe gikk galt', 'error');
    }
  };

  return (
    <>
      <Button endIcon={<DownloadIcon />} onClick={downloadCSV} size='small' sx={{ width: 'fit-content', height: 35, mb: 2, ml: 'auto' }} variant='contained'>
        Last ned som csv
      </Button>
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
    </>
  );
};

export default FormAnswers;
