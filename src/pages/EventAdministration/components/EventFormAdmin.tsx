import { BookCopy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import FormAdmin from '~/components/forms/FormAdmin';
import FormFieldsEditor from '~/components/forms/FormFieldsEditor';
import { FormViewTemplate } from '~/components/forms/FormView';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { Skeleton } from '~/components/ui/skeleton';
import { useEventById } from '~/hooks/Event';
import { useCreateForm, useDeleteForm, useFormById, useFormTemplates } from '~/hooks/Form';
import type { EventFormCreate, Form, FormCreate } from '~/types';
import { EventFormType, FormResourceType } from '~/types/Enums';
import { removeIdsFromFields } from '~/utils';

export type EventFormAdminProps = {
  eventId: number;
};

export type EventFormEditorProps = {
  eventId: number;
  formId: string | null;
  formType: EventFormType;
};

type FormTemplatePreviewType = Omit<EventFormEditorProps, 'formId'> & {
  formtemplate: Form;
};

const FormTemplatePreview = ({ formtemplate, eventId, formType }: FormTemplatePreviewType) => {
  const deleteForm = useDeleteForm(formtemplate.id || '-');
  const [isEditing, setIsEditing] = useState(false);
  const createForm = useCreateForm();

  const onCreateFormFromTemplate = () => {
    const newForm: EventFormCreate = {
      title: String(eventId),
      type: formType,
      event: eventId,
      resource_type: FormResourceType.EVENT_FORM,
      fields: removeIdsFromFields(formtemplate.fields),
      template: false,
    };
    createForm.mutate(newForm, {
      onSuccess: () => {
        toast.success('Malen ble brukt til å opprette et nytt skjema.');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const onDeleteForm = () => {
    deleteForm.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(data.detail);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  return (
    <Expandable title={formtemplate.title}>
      {isEditing ? (
        <FormFieldsEditor canEditTitle={true} form={formtemplate} onSave={() => setIsEditing(false)} />
      ) : (
        <div className='space-y-4'>
          <FormViewTemplate form={formtemplate} />
          <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2'>
            <ResponsiveAlertDialog
              action={onDeleteForm}
              description='Å slette en mal kan ikke reverseres.'
              title='Er du sikker?'
              trigger={
                <Button className='w-full' variant='destructive'>
                  Slett malen
                </Button>
              }
            />
            <Button className='w-full' onClick={onCreateFormFromTemplate}>
              Bruk denne malen
            </Button>
          </div>
        </div>
      )}
    </Expandable>
  );
};

const EventFormAdmin = ({ eventId }: EventFormAdminProps) => {
  const { data: event, isLoading } = useEventById(eventId);

  if (isLoading || !event) {
    return <Skeleton className='h-96' />;
  }

  const FormTemplatesList = ({ formType }: Pick<EventFormEditorProps, 'formType'>) => {
    const createForm = useCreateForm();
    const { data: formtemplates = [] } = useFormTemplates();
    const [isCreatingForm, setIsCreatingTemplate] = useState(false);
    const [formtemplateId, setFormtemplateId] = useState('-');
    const { data: form, isLoading, isError } = useFormById(formtemplateId);

    const newFormTemplateCreate: FormCreate = {
      title: 'Ny mal',
      resource_type: FormResourceType.FORM,
      fields: [],
      viewer_has_answered: false,
      template: true,
    };

    const onCreateTemplate = () => {
      createForm.mutate(newFormTemplateCreate, {
        onSuccess: (data) => {
          toast.success(`Malen med navn "${data.title} ble opprettet"`);
          setFormtemplateId(data.id);
          setIsCreatingTemplate(true);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    };

    return (
      <>
        {isCreatingForm ? (
          <>{!isLoading && !isError && form && <FormFieldsEditor canEditTitle={true} form={form} onSave={() => setIsCreatingTemplate(false)} />}</>
        ) : (
          <div className='space-y-4'>
            <div className='space-y-2'>
              {formtemplates.map((formtemplate) => (
                <FormTemplatePreview eventId={eventId} formtemplate={formtemplate} formType={formType} key={formtemplate.id} />
              ))}
            </div>
            <Button className='w-full' onClick={onCreateTemplate}>
              Lag ny mal
            </Button>
          </div>
        )}
      </>
    );
  };

  type EventFormEditorProps = {
    formType: EventFormType;
  };

  const EventFormEditor = ({ formType }: EventFormEditorProps) => {
    const createForm = useCreateForm();

    const newForm: FormCreate = {
      title: `${event.title} - ${formType === EventFormType.SURVEY ? 'påmeldingsskjema' : 'evalueringsskjema'}`,
      type: formType,
      event: event.id,
      resource_type: FormResourceType.EVENT_FORM,
      fields: [],
    };

    const onCreate = async () => createForm.mutate(newForm);

    return (
      <>
        <Button className='w-full' onClick={onCreate}>
          Opprett {formType === EventFormType.SURVEY ? 'påmeldingsskjema' : 'evalueringsskjema'}
        </Button>
        <Expandable
          description='Velg en mal for å bruke som utgangspunkt når du oppretter ett skjema.'
          icon={<BookCopy className='w-5 h-5' />}
          title='Bruk en mal'
        >
          <FormTemplatesList formType={formType} />
        </Expandable>
      </>
    );
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <div className='space-y-1'>
          <h1 className='font-bold'>Evalueringsspørsmål</h1>
          <p className='text-xs'>
            Deltagerne som deltar på dette arrangementet <b>må</b> svare på disse spørsmålene før de kan melde seg på andre arrangementer. Blokkeringen av
            påmelding trer i kraft når deltageren blir markert som &quot;Ankommet&quot;, og forsvinner med en gang deltageren har svart på evalueringsskjemaet.
            Deltagerne vil motta epost med påminnelse om å svare på skjemaet kl 12.00 dagen etter arrangementet.
          </p>
        </div>
        {event.evaluation ? <FormAdmin formId={event.evaluation} /> : <EventFormEditor formType={EventFormType.EVALUATION} />}
      </div>
    </div>
  );
};

export default EventFormAdmin;
