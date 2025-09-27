import type { SelectFormField, TextFormField } from '~/types';
import { FormFieldType } from '~/types/Enums';

export type FieldViewProps = {
  formField: TextFormField | SelectFormField;
};

const FieldView = ({ formField }: FieldViewProps) => (
  <>
    {formField.type === FormFieldType.TEXT_ANSWER ? (
      <div className='space-y-1'>
        <label className='text-sm'>
          {formField.title} {formField.required && <span className='text-red-300'>*</span>}
        </label>
        <div className='text-muted-foreground text-sm'>Fritekst svar</div>
      </div>
    ) : formField.type === FormFieldType.MULTIPLE_SELECT ? (
      <div className='space-y-2'>
        <label className='text-sm'>
          {formField.title} {formField.required && <span className='text-red-300'>*</span>}
        </label>
        <p className='text-muted-foreground text-sm'>Velg en eller flere svaralternativer</p>
      </div>
    ) : (
      <div className='space-y-2'>
        <label className='text-sm'>
          {formField.title} {formField.required && <span className='text-red-300'>*</span>}
        </label>
        <p className='text-muted-foreground text-sm'>Velg ett svaralternativ</p>
      </div>
    )}
  </>
);

export default FieldView;
