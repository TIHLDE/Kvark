import { Circle, GripHorizontal, Square, Trash, X } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { type XYCoord, useDrag, useDrop } from 'react-dnd';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
import type { SelectFormField, TextFormField } from '~/types';
import { FormFieldType } from '~/types/Enums';

export type FieldEditorProps = {
  index: number;
  field: TextFormField | SelectFormField;
  updateField: (newField: TextFormField | SelectFormField) => void;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  removeField: () => void;
  disabled?: boolean;
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const FieldEditor = ({ moveField, index, field, updateField, removeField, disabled = false }: FieldEditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'Field',
    item: (id) => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'Field',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveField(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const addFieldOption = () => {
    if (field.type !== FormFieldType.TEXT_ANSWER && !disabled) {
      updateField({ ...field, options: [...field.options, { title: '' }] });
    }
  };

  const updateFieldOption = (newValue: string, index: number) => {
    if (field.type !== FormFieldType.TEXT_ANSWER && !disabled) {
      const newOptions = field.options.map((option, i) => (i === index ? { ...option, title: newValue } : option));
      updateField({ ...field, options: newOptions });
    }
  };

  const deleteFieldOption = (index: number) => {
    if (field.type !== FormFieldType.TEXT_ANSWER && !disabled) {
      const newOptions = field.options.filter((_, i) => i !== index);
      updateField({ ...field, options: newOptions });
    }
  };

  const [title, description] = useMemo(() => {
    switch (field.type) {
      case FormFieldType.TEXT_ANSWER:
        return ['Tekstspørsmål', 'Bruker kan svare med tekst'];
      case FormFieldType.SINGLE_SELECT:
        return ['Flervalgsspørsmål', 'Bruker kan velge kun ett alternativ'];
      case FormFieldType.MULTIPLE_SELECT:
        return ['Avkrysningsspørsmål', 'Bruker kan velge ett eller flere alternativ'];
    }
  }, [field]);

  const TypeIcon = useMemo(() => (field.type === FormFieldType.SINGLE_SELECT ? Circle : Square), [field]);
  drop(drag(ref));
  return (
    <div className={cn('w-full p-4 border rounded-md bg-card space-y-4', isDragging && 'opacity-50')} data-handler-id={handlerId} ref={preview}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center cursor-pointer space-x-2' ref={ref}>
          <GripHorizontal className='w-5 h-5' />
          <div>
            <h1 className={cn('', disabled && 'text-muted-foreground')}>{title}</h1>
            <p className='text-sm text-muted-foreground'>{description}</p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Checkbox
            checked={field.required}
            disabled={disabled}
            id='required'
            onCheckedChange={(checked) => updateField({ ...field, required: Boolean(checked) })}
          />
          <label className='cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='required'>
            Påkrevd
          </label>
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        <div className='space-y-1 w-full'>
          <Label>Spørsmål</Label>
          <Textarea disabled={disabled} onChange={(e) => updateField({ ...field, title: e.target.value })} value={field.title} />
        </div>
        <Button disabled={disabled} onClick={removeField} size='icon' variant='ghost'>
          <Trash className='w-5 h-5 text-red-500' />
        </Button>
      </div>
      {field.type !== FormFieldType.TEXT_ANSWER && (
        <>
          {field.options.map((option, index) => (
            <div className='flex items-center space-x-2' key={index}>
              <TypeIcon className={cn('w-5 h-5 stroke-[1.5px]', disabled && 'text-muted-foreground')} />
              <Input disabled={disabled} onChange={(e) => updateFieldOption(e.target.value, index)} placeholder='Alternativ' value={option.title} />

              {field.options.length > 1 && (
                <Button disabled={disabled} onClick={() => deleteFieldOption(index)} size='icon' variant='ghost'>
                  <X className='w-5 h-5' />
                </Button>
              )}
            </div>
          ))}
          <Button className='w-full' disabled={disabled} onClick={addFieldOption}>
            Legg til alternativ
          </Button>
        </>
      )}
    </div>
  );
};

export default FieldEditor;
