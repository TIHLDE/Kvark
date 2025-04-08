import update from 'immutability-helper';
import { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import FieldEditor from '~/components/forms/FieldEditor';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Separator } from '~/components/ui/separator';
import { useFormSubmissions, useUpdateForm } from '~/hooks/Form';
import type { Form, SelectFormField, TextFormField } from '~/types';
import { FormFieldType } from '~/types/Enums';

export type FormFieldsEditorProps = {
  form: Form;
  onSave?: () => void;
  canEditTitle?: boolean;
};

const FormFieldsEditor = ({ form, onSave, canEditTitle }: FormFieldsEditorProps) => {
  const { data: submissions, isLoading: isSubmissionsLoading } = useFormSubmissions(form.id, 1);
  const updateForm = useUpdateForm(form.id);
  const disabledFromSubmissions = (submissions ? Boolean(submissions.count) : true) && !isSubmissionsLoading;
  const disabled = updateForm.isLoading || isSubmissionsLoading || disabledFromSubmissions;
  const [fields, setFields] = useState<Array<TextFormField | SelectFormField>>(form.fields);
  const [addButtonOpen, setAddButtonOpen] = useState(false);
  const [formTitle, setFormTitle] = useState(form.title);

  useEffect(() => setFields(form.fields), [form]);

  const addField = (type: FormFieldType) => {
    if (disabled) {
      return;
    }
    type === FormFieldType.TEXT_ANSWER
      ? setFields((prev) => [
          ...prev,
          {
            title: '',
            required: false,
            order: fields.length,
            type: type,
            options: [],
          },
        ])
      : setFields((prev) => [
          ...prev,
          {
            title: '',
            required: false,
            order: fields.length,
            type: type,
            options: [{ title: '' }],
          },
        ]);
    setAddButtonOpen(false);
  };

  const updateField = (newField: TextFormField | SelectFormField, index: number) => {
    if (disabled) {
      return;
    }
    setFields((prev) => prev.map((field, i) => (i === index ? newField : field)));
  };

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    setFields((prevFields: (TextFormField | SelectFormField)[]) =>
      update(prevFields, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevFields[dragIndex] as TextFormField | SelectFormField],
        ],
      }).map((prevField, i) => update(prevField, { order: { $apply: () => i } })),
    );
  }, []);

  const removeField = (index: number) => {
    if (disabled) {
      return;
    }
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    if (disabled) {
      return;
    }
    updateForm.mutate(
      { title: formTitle, fields: fields, resource_type: form.resource_type },
      {
        onSuccess: () => {
          toast.success('Spørsmålene ble oppdatert');
          if (onSave) {
            onSave();
          }
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  return (
    <>
      <div className='space-y-2'>
        {canEditTitle && (
          <div className='space-y-1'>
            <Label>Malen sitt navn</Label>
            <Input onChange={(e) => setFormTitle(e.target.value)} value={formTitle} />
          </div>
        )}
        {disabledFromSubmissions && <h1 className='text-center'>Du kan ikke endre spørsmålene etter at noen har svart på dem</h1>}
        <DndProvider backend={HTML5Backend}>
          {fields.map((field, index) => (
            <FieldEditor
              disabled={disabled}
              field={field}
              index={index}
              key={index}
              moveField={moveField}
              removeField={() => removeField(index)}
              updateField={(newField: TextFormField | SelectFormField) => updateField(newField, index)}
            />
          ))}
        </DndProvider>
        <div className='flex items-center space-x-2'>
          <Popover onOpenChange={setAddButtonOpen} open={addButtonOpen}>
            <PopoverTrigger asChild>
              <Button className='w-full' disabled={disabled} variant='outline'>
                Nytt spørsmål
              </Button>
            </PopoverTrigger>
            <PopoverContent className='space-y-2 flex flex-col'>
              <h1>Legg til spørsmål</h1>
              <Separator />
              <Button
                variant='ghost'
                className='px-2 py-1 justify-start rounded-md cursor-pointer hover:bg-border transition-all duration-150'
                onClick={() => {
                  addField(FormFieldType.TEXT_ANSWER);
                  setAddButtonOpen(false);
                }}
              >
                Tekstspørsmål
              </Button>
              <Button
                variant='ghost'
                className='px-2 py-1 justify-start rounded-md cursor-pointer hover:bg-border transition-all duration-150'
                onClick={() => {
                  addField(FormFieldType.SINGLE_SELECT);
                  setAddButtonOpen(false);
                }}
              >
                Flervalgsspørsmål
              </Button>
              <Button
                variant='ghost'
                className='px-2 py-1 justify-start rounded-md cursor-pointer hover:bg-border transition-all duration-150'
                onClick={() => {
                  addField(FormFieldType.MULTIPLE_SELECT);
                  setAddButtonOpen(false);
                }}
              >
                Avkrysningsspørsmål
              </Button>
            </PopoverContent>
          </Popover>
          <Button className='w-full' disabled={disabled} onClick={save}>
            Lagre
          </Button>
        </div>
      </div>
    </>
  );
};

export default FormFieldsEditor;
