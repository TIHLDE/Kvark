import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import FormInput from '~/components/inputs/Input';
import { FormDetailSwitch } from '~/components/inputs/Switch';
import FormTextarea from '~/components/inputs/Textarea';
import { Button } from '~/components/ui/button';
import { Form as FormWrapper } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateForm, useDeleteForm, useUpdateForm } from '~/hooks/Form';
import type { EventForm, Form, FormCreate, GroupForm, TemplateForm } from '~/types';
import { FormResourceType } from '~/types/Enums';
import { removeIdsFromFields } from '~/utils';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
          navigateTo({});
        }
      },
      onError: (e) => {
        toast.error(e.detail);
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
  title: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Feltet er påkrevd' : undefined),
    })
    .min(1, {
      error: 'Feltet er påkrevd',
    }),
  description: z.string().optional(),
  email_receiver_on_submit: z.email().optional().or(z.literal('')),
});

const GroupFormDetailsEditor = ({ groupForm }: GroupFormDetailsEditorProps) => {
  const updateForm = useUpdateForm(groupForm.id || '-');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      can_submit_multiple: groupForm.can_submit_multiple,
      is_open_for_submissions: groupForm.is_open_for_submissions,
      only_for_group_members: groupForm.only_for_group_members,
      email_receiver_on_submit: groupForm.email_receiver_on_submit || '',
      title: groupForm.title || '',
      description: groupForm.description || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateForm.mutate(
      { resource_type: groupForm.resource_type, ...values },
      {
        onSuccess: () => {
          toast.success('Skjema ble oppdatert');
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  return (
    <FormWrapper {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput form={form} label='Tittel' name='title' required />

        <FormInput form={form} label='Epost-mottager ved svar' name='email_receiver_on_submit' type='email' />

        <FormTextarea form={form} label='Beskrivelse' name='description' />

        <FormDetailSwitch
          description='Bestemmer om brukere kan svare på dette spørreskjemaet flere ganger.'
          form={form}
          label='Tillat flere innsendinger'
          name='can_submit_multiple'
        />

        <FormDetailSwitch
          description='Bestemmer om spørreskjemaet er åpent for innsending og brukere dermed kan svare på det. Hvis bryteren er avslått så kan ingen svare på skjemaet, og ingen kan heller se/finne det.'
          form={form}
          label='Åpent for innsending'
          name='is_open_for_submissions'
        />

        <FormDetailSwitch
          description='Bestemmer hvem som kan svare på dette spørreskjemaet. Hvis bryteren er påslått så vil kun medlemmer av gruppen kunne svare på spørreskjemaet, og personer som ikke er medlem vil ikke kunne se/finne spørreskjemaet.'
          form={form}
          label='Kun for medlemmer av gruppen'
          name='only_for_group_members'
        />

        <div className='space-y-2 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-2'>
          <Button className='w-full' disabled={updateForm.isPending} type='submit'>
            {updateForm.isPending ? 'Lagrer...' : 'Lagre'}
          </Button>

          <DeleteFormButton form={groupForm} navigate />
        </div>
      </form>
    </FormWrapper>
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
