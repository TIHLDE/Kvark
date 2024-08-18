import { ACCESS_TOKEN, TIHLDE_API_URL, TOKEN_HEADER_NAME } from 'constant';
import { useState } from 'react';
import { toast } from 'sonner';
import { urlEncode } from 'utils';

import { SelectFieldSubmission, SelectFormField, TextFieldSubmission, TextFormField, UserSubmission } from 'types';
import { FormFieldType, FormResourceType } from 'types/Enums';

import { FORMS_ENDPOINT, SUBMISSIONS_ENDPOINT } from 'api/api';
import { getCookie } from 'api/cookie';

import { useFormById, useFormSubmissions } from 'hooks/Form';

import MultiSelect, { MultiSelectOption } from 'components/inputs/MultiSelect';
import { Button } from 'components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';

export type FormAnswersProps = {
  formId: string | null;
};

const FormAnswers = ({ formId }: FormAnswersProps) => {
  const [selectedPage, setSelectedPage] = useState(0);
  const { data: form, isLoading: isFormLoading } = useFormById(formId || '-');
  const { data, isLoading, error } = useFormSubmissions(formId || '-', selectedPage + 1);

  const [selectedFields, setSelectedFields] = useState<string[]>(['Alle']);

  const handleSelectFields = (values: MultiSelectOption[]) => {
    if (values.length === 0) {
      setSelectedFields(['Alle']);
      return;
    }

    setSelectedFields(values.map((value) => value.value));
  };

  if (isLoading || isFormLoading) {
    return <h1 className='text-center'>Laster statistikken...</h1>;
  } else if (error) {
    return <h1 className='text-center'>Noe gikk galt: {error.detail}</h1>;
  } else if (!form || !formId || !data) {
    return <h1 className='text-center'>Du må opprette et skjema for å se svar</h1>;
  } else if (!data.results.length) {
    return <h1 className='text-center'>Ingen har svart på dette skjemaet</h1>;
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
        a.download = form.resource_type === FormResourceType.EVENT_FORM ? `${urlEncode(form.title)}_${form.type}.csv` : `${urlEncode(form.title)}.csv`;
        // Clicks the link to download the file
        a.click();
        // Revokes link and removes the <a> from document
        URL.revokeObjectURL(url);
        a.remove();
        toast.success('CSV-en ble lastet ned');
      } else {
        toast.error('Noe gikk galt');
      }
    } catch {
      toast.error('Noe gikk galt');
    }
  };

  return (
    <div className='space-y-4'>
      <MultiSelect
        onChange={handleSelectFields}
        options={form.fields.map((field) => ({
          value: field.title,
          label: field.title,
        }))}
        placeholder='Velg spørsmål...'
      />

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>E-post</TableHead>
              <TableHead>Studie</TableHead>
              <TableHead>Studiekull</TableHead>

              {selectedFields.includes('Alle') && form.fields.map((field, index) => <TableHead key={index}>{field.title}</TableHead>)}

              {!selectedFields.includes('Alle') && selectedFields.map((field, index) => <TableHead key={index}>{field}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((submission, index) => (
              <TableRow key={index}>
                <TableCell>
                  {submission.user.first_name} {submission.user.last_name}
                </TableCell>

                <TableCell>{submission.user.email}</TableCell>

                <TableCell>{submission.user.study.group.name}</TableCell>

                <TableCell>{submission.user.studyyear.group.name}</TableCell>

                {form.fields
                  .filter((filter) => {
                    if (selectedFields.includes('Alle')) {
                      return filter;
                    }

                    return selectedFields.includes(filter.title);
                  })
                  .map((field, index) => (
                    <TableCell key={index}>{getTableCellText(field, submission)}</TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <Button onClick={downloadCSV} variant='outline'>
          Last ned som CSV
        </Button>

        <div className='space-x-2'>
          <Button
            disabled={selectedPage === 0}
            onClick={() => {
              if (selectedPage > 0) {
                setSelectedPage(selectedPage - 1);
              }
            }}
            size='sm'
            variant='outline'>
            Forrige
          </Button>
          <Button disabled={!data.next} onClick={() => data.next && setSelectedPage(selectedPage + 1)} size='sm' variant='outline'>
            Neste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormAnswers;
