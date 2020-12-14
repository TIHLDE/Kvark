import React, { useEffect, useState } from 'react';
import { Event, EventForm, TextFormField, SelectFormField } from 'types/Types';
import { useEvent } from 'api/hooks/Event';
import { useForms } from 'api/hooks/Form';

// Material UI
import Typography from '@material-ui/core/Typography';

// Project components
import FormEditor from 'components/forms/FormEditor';
import { FormType, FormFieldType } from 'types/Enums';

export type EventFormEditorProps = {
  eventId: number;
};

const EventFormEditor = ({ eventId }: EventFormEditorProps) => {
  const { getEventById } = useEvent();
  const { createForm, updateForm } = useForms();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    let subscribed = true;
    getEventById(eventId, true)
      .then((data) => !subscribed || setEvent(data))
      .catch(() => !subscribed || setEvent(null));
    return () => {
      subscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const onCreate = (fields: Array<TextFormField | SelectFormField>) => createForm({ fields, event: eventId } as EventForm);
  const onUpdate = (fields: Array<TextFormField | SelectFormField>) =>
    event?.forms?.id ? updateForm(event.forms.id, { fields, event: eventId } as EventForm) : onCreate(fields);

  if (!event) {
    return <Typography variant='h3'>Noe gikk galt, vi kunne ikke finne arrangementet</Typography>;
  }

  const form: EventForm = {
    title: 'Halla',
    type: FormType.SURVEY,
    hidden: false,
    event: eventId,
    id: 'form id',
    fields: [
      {
        title: 'Nr 1',
        type: FormFieldType.TEXT_ANSWER,
        required: true,
        id: 'field 1 id',
      },
      {
        id: 'field 2 id',
        title: 'Nr 2',
        type: FormFieldType.SINGLE_SELECT,
        required: false,
        options: [
          {
            id: 'option id 2.1',
            text: '2.1',
          },
          {
            id: 'option id 2.2',
            text: '2.2',
          },
        ],
      },
      {
        id: 'field 3 id',
        title: 'Nr 3',
        type: FormFieldType.MULTIPLE_SELECT,
        required: true,
        options: [
          {
            id: 'option id 3.1',
            text: '3.1',
          },
          {
            id: 'option id 3.2',
            text: '3.2',
          },
        ],
      },
    ],
  };

  return (
    <div style={{ width: '100%' }}>
      <FormEditor form={event.forms || form} onCreate={onCreate} onUpdate={onUpdate} />
      <Typography style={{ marginTop: 8 }} variant='body2'>
        OBS: Spørsmål til arrangement lagres uavhengig av resten av skjemaet! Du må altså trykke på lagre over for at spørsmålene skal lagres
      </Typography>
    </div>
  );
};

export default EventFormEditor;
