import React, { useEffect, useState } from 'react';
import { Event, EventForm } from 'types/Types';
import { useEvent } from 'api/hooks/Event';

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
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    let subscribed = true;
    getEventById(eventId)
      .then((data) => !subscribed || setEvent(data))
      .catch(() => !subscribed || setEvent(null));
    return () => {
      subscribed = false;
    };
  }, [eventId, getEventById]);

  if (!event) {
    return <Typography variant='h3'>Noe gikk galt, vi kunne ikke finne arrangementet</Typography>;
  } else if (!event.sign_up) {
    return <Typography variant='h3'>Skru på påmelding for å legge til spørsmål</Typography>;
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
    ],
  };

  return (
    <div style={{ width: '100%' }}>
      <FormEditor eventId={eventId} form={event.forms || form} />
      <Typography style={{ marginTop: 8 }} variant='body2'>
        OBS: Spørsmål til arrangement lagres uavhengig av resten av skjemaet! Du må altså trykke på lagre over for at spørsmålene skal lagres
      </Typography>
    </div>
  );
};

export default EventFormEditor;
