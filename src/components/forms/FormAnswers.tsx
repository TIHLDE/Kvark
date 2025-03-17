import { FORMS_ENDPOINT, SUBMISSIONS_ENDPOINT } from '~/api/api';
import { getCookie } from '~/api/cookie';
import MultiSelect, { type MultiSelectOption } from '~/components/inputs/MultiSelect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { ACCESS_TOKEN, TIHLDE_API_URL, TOKEN_HEADER_NAME } from '~/constant';
import { useFormById, useFormSubmissions } from '~/hooks/Form';
import type { Form, SelectFieldSubmission, SelectFormField, TextFieldSubmission, TextFormField, UserSubmission } from '~/types';
import { FormFieldType, FormResourceType } from '~/types/Enums';
import { urlEncode } from '~/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export type FormAnswersProps = {
  formId: string | null;
};

const FormAnswers = ({ formId }: FormAnswersProps) => {
  const [selectedPage, setSelectedPage] = useState(0);
  const { data: form, isLoading: isFormLoading } = useFormById(formId || '-');
  const { data, isLoading, error } = useFormSubmissions(formId || '-', selectedPage + 1);
  const [, setSelectedFields] = useState<string[]>(['Alle']);

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

  // TODO: Add this later
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
    <div className='space-y-3'>
      <MultiSelect
        onChange={handleSelectFields}
        options={form.fields.map((field: { title: string }) => ({
          value: field.title,
          label: field.title,
        }))}
        placeholder='Velg spørsmål...'
      />
      <div className='grid grid-cols-[3fr_3fr_3fr_2fr_auto] pl-4 size-full gap-3 text-sm text-gray-300'>
        <div className=''>Navn</div>
        <div className=''>E-post</div>
        <div className=''>Studie</div>
        <div className=''>Studiekull</div>
        <div className='w-6'></div>
      </div>
      <div className='rounded-md border'>
        <div className='px-4 sm:px-0'>
          <div className='flex flex-col gap-2'>
            {data.results.map((userSubmission, index) => (
              <FormAnswer form={form} getTableCellText={getTableCellText} key={index} userSubmission={userSubmission} />
            ))}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='space-x-2'>
          <Button
            disabled={selectedPage === 0}
            onClick={() => {
              if (selectedPage > 0) {
                setSelectedPage(selectedPage - 1);
              }
            }}
            size='sm'
            variant='outline'
          >
            Forrige
          </Button>
          <Button disabled={!data.next} onClick={() => data.next && setSelectedPage(selectedPage + 1)} size='sm' variant='outline'>
            Neste
          </Button>
          <Button onClick={downloadCSV} variant='outline'>
            Last ned som CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

function FormAnswer({
  userSubmission,
  form,
  getTableCellText,
}: {
  userSubmission: UserSubmission;
  form: Form;
  getTableCellText: (f: TextFormField | SelectFormField, s: UserSubmission) => string;
}) {
  return (
    <Accordion className='' collapsible type='single'>
      <AccordionItem className='border-0' value='item-1'>
        <AccordionTrigger className='px-4 py-4 border-b'>
          <div className='grid grid-cols-[3fr_3fr_3fr_2fr] size-full gap-3 text-left text-ellipsis'>
            <div className='font-normal text-sm min-h-10 content-center'>{userSubmission.user.first_name + ' ' + userSubmission.user.last_name}</div>
            <div className='font-normal text-sm min-h-10 content-center'>{userSubmission.user.email}</div>
            <div className='font-normal text-sm min-h-10 content-center'>{userSubmission.user.study.group.name}</div>
            <div className='font-normal text-sm min-h-10 content-center'>{userSubmission.user.studyyear.group.name}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className='px-4 pt-8 pb-14 border-b'>
          <div className='flex flex-col gap-16'>
            {form.fields.map((field, index) => (
              <div className='flex flex-row gap-x-8 text-left' key={index}>
                <div className='w-1/3'>
                  <p>{form.fields.find((f) => f.id === field.id)?.title ?? 'Ingen spørsmål'}</p>
                </div>

                <div className='w-2/3'>{getTableCellText(field, userSubmission)}</div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default FormAnswers;
