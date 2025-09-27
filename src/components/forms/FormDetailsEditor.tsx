import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateForm, useDeleteForm, useUpdateForm } from '~/hooks/Form';
import type { EventForm, Form, FormCreate, GroupForm, TemplateForm } from '~/types';
import { FormResourceType } from '~/types/Enums';
import { removeIdsFromFields } from '~/utils';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { handleFormSubmit, useAppForm } from './AppForm';

type FieldComponentsWithoutAny = {
  InputField: (props: Record<string, unknown>) => JSX.Element;
  TextareaField: (props: Record<string, unknown>) => JSX.Element;
  SwitchField: (props: Record<string, unknown>) => JSX.Element;
  SelectField: (props: Record<string, unknown>) => JSX.Element;
  MultiCheckboxField: (props: Record<string, unknown>) => JSX.Element;
  UserField: (props: Record<string, unknown>) => JSX.Element;
};

export type FormDetailsEditorProps = {
  form: Form;
  navigate?: boolean;
};

const DeleteFormButton = ({ form, navigate = false }: FormDetailsEditorProps) => {
  const deleteForm = useDeleteForm(form.id);
  const navigateTo = useNavigate();

  const deleteFormHandler = () =>
    deleteForm.mutate(undefined, {
      onSuccess: () => {
        toast.success('Skjema ble slettet');
        if (navigate) {
          navigateTo(-1);
        }
      },
      onError: (e: { detail?: string }) => {
        toast.error(e.detail ?? 'Noe gikk galt');
      },
    });

  const OpenButton = (
    <Button className='w-full' type='button' variant='destructive'>
      Slett spørreskjema
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={deleteFormHandler}
      description='Er du sikker på at du vil slette dette skjemaet?'
      title='Slett skjema'
      trigger={OpenButton}
    />
  );
};

type GroupFormDetailsEditorProps = {
  groupForm: GroupForm;
};

const formSchema = z.object({
  can_submit_multiple: z.boolean(),
  is_open_for_submissions: z.boolean(),
  only_for_group_members: z.boolean(),
  title: z.string({ required_error: 'Feltet er påkrevd' }).min(1, { message: 'Feltet er påkrevd' }),
  description: z.string().optional(),
  email_receiver_on_submit: z.string().email().optional().or(z.literal('')),
});

type GroupFormValues = z.infer<typeof formSchema>;

const GroupFormDetailsEditor = ({ groupForm }: GroupFormDetailsEditorProps) => {
  const updateForm = useUpdateForm(groupForm.id || '-');

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
    },
    defaultValues: {
      can_submit_multiple: groupForm.can_submit_multiple,
      is_open_for_submissions: groupForm.is_open_for_submissions,
      only_for_group_members: groupForm.only_for_group_members,
      email_receiver_on_submit: groupForm.email_receiver_on_submit || '',
      title: groupForm.title || '',
      description: groupForm.description || '',
    } as GroupFormValues,

    async onSubmit({ value }: { value: GroupFormValues }) {
      try {
        await updateForm.mutateAsync({ resource_type: groupForm.resource_type, ...value });
        toast.success('Skjema ble oppdatert');
      } catch (e: unknown) {
        const detail = (e as { detail?: string })?.detail;
        toast.error(detail ?? 'Noe gikk galt');
      }
    },
  });

  return (
    <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
      <form.AppField name='title'>
        {(field: unknown) => {
          const fc = field as FieldComponentsWithoutAny;
          return <fc.InputField label='Tittel' required />;
        }}
      </form.AppField>

      <form.AppField name='email_receiver_on_submit'>
        {(field: unknown) => {
          const fc = field as FieldComponentsWithoutAny;
          return <fc.InputField label='Epost-mottager ved svar' name='email_receiver_on_submit' type='email' />;
        }}
      </form.AppField>

      <form.AppField name='description'>
        {(field: unknown) => {
          const fc = field as FieldComponentsWithoutAny;
          return <fc.TextareaField label='Beskrivelse' />;
        }}
      </form.AppField>

      <form.AppField name='can_submit_multiple'>
        {(field: unknown) => {
          const fc = field as FieldComponentsWithoutAny;
          return <fc.SwitchField description='Bestemmer om brukere kan svare på dette spørreskjemaet flere ganger.' label='Tillat flere innsendinger' />;
        }}
      </form.AppField>

      <form.AppField name='is_open_for_submissions'>
        {(field: unknown) => {
          const fc = field as FieldComponentsWithoutAny;
          return (
            <fc.SwitchField
              description='Bestemmer om spørreskjemaet er åpent for innsending og brukere dermed kan svare på det. Hvis bryteren er avslått så kan ingen svare på skjemaet, og ingen kan heller se/finne det.'
              label='Åpent for innsending'
            />
          );
        }}
      </form.AppField>

      <form.AppField name='only_for_group_members'>
        {(field: unknown) => {
          const fc = field as FieldComponentsWithoutAny;
          return (
            <fc.SwitchField
              description='Bestemmer hvem som kan svare på dette spørreskjemaet. Hvis bryteren er påslått så vil kun medlemmer av gruppen kunne svare på spørreskjemaet, og personer som ikke er medlem vil ikke kunne se/finne spørreskjemaet.'
              label='Kun for medlemmer av gruppen'
            />
          );
        }}
      </form.AppField>

      <div className='space-y-2 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-2'>
        <form.AppForm>
          <form.SubmitButton
            loading={
              <>
                <Loader2Icon className='animate-spin' /> Lagrer
              </>
            }>
            Lagre
          </form.SubmitButton>
        </form.AppForm>

        <DeleteFormButton form={groupForm} navigate />
      </div>
    </form>
  );
};

type EventFormDetailsEditorProps = {
  form: EventForm | TemplateForm;
};

const EventFormDetailsEditor = ({ form }: EventFormDetailsEditorProps) => {
  const createForm = useCreateForm();
  const [formtemplateName, setFormtemplateName] = useState<string>('');

  const saveAsTemplate = () => {
    const formTemplate: FormCreate = {
      title: formtemplateName,
      fields: removeIdsFromFields(form.fields),
      resource_type: FormResourceType.FORM,
      viewer_has_answered: false,
      template: true,
    };
    createForm.mutate(formTemplate, {
      onSuccess: (data) => {
        toast.success(`Lagret mal med navn "${data.title}"`);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const OpenButton = <Button className='w-full'>Lagre som mal</Button>;

  return (
    <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2'>
      <ResponsiveDialog
        className='max-w-2xl'
        description='Når du lager en mal så kan du enkelt bruke feltene i dette skjemaet i andre skjemaer senere. Gi malen en passende tittel.'
        title='Lagre som mal'
        trigger={OpenButton}>
        <div className='space-y-6'>
          <div className='space-y-1'>
            <Label>Tittel</Label>
            <Input onChange={(e) => setFormtemplateName(e.target.value)} value={formtemplateName} />
          </div>
          <Button className='w-full' onClick={saveAsTemplate}>
            {createForm.isPending ? 'Lagrer...' : 'Lagre'}
          </Button>
        </div>
      </ResponsiveDialog>
      <DeleteFormButton form={form} />
    </div>
  );
};

const FormDetailsEditor = ({ form }: FormDetailsEditorProps) =>
  form.resource_type === FormResourceType.GROUP_FORM ? (
    <GroupFormDetailsEditor groupForm={form} />
  ) : form.resource_type === FormResourceType.EVENT_FORM ? (
    <EventFormDetailsEditor form={form} />
  ) : (
    <DeleteFormButton form={form} />
  );

export default FormDetailsEditor;
