import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { ComponentProps, FormEvent, useCallback, useRef } from 'react';

import { Button } from '../ui/button';
import { FormErrors } from './FormErrors';
import BoolExpand from './inputs/BoolExpand';
import { DateTimeField } from './inputs/datetime-field';
import { FileUploadField } from './inputs/file-upload-field';
import { ImageUploadField } from './inputs/image-upload-field';
import { InputField } from './inputs/input-field';
import { MultiCheckboxField } from './inputs/multi-checkbox-field';
import { SelectField } from './inputs/select-field';
import { SwitchField } from './inputs/switch-field';
import { TextareaField } from './inputs/textarea-field';
import { UserField } from './inputs/user-field';

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

type SubmitButtonProps = ComponentProps<typeof Button> & {
  loading?: React.ReactNode;
};

function SubmitButton({ children, loading, onClick, ...props }: SubmitButtonProps) {
  const form = useFormContext();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // If the the button is inside a form, then the form will handle the submit
      // If the button is not inside a form, we need to manually submit the form
      if (!buttonRef.current?.form) {
        form.handleSubmit();
      }
      onClick?.(e);
    },
    [buttonRef, form, onClick],
  );

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button {...props} type='submit' disabled={!canSubmit || isSubmitting} onClick={handleSubmit}>
          {isSubmitting && loading ? loading : children}
        </Button>
      )}
    </form.Subscribe>
  );
}

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    // Base components
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
    // Inputs
    InputField,
    TextareaField,
    SwitchField,
    DateTimeField,
    SelectField,
    UserField,
    MultiCheckboxField,
    ImageUploadField,
    FileUploadField,
    BoolExpand,
  },
  formComponents: {
    SubmitButton,
    FormErrors,
  },
});

export function handleFormSubmit(submitable: { handleSubmit: () => void }) {
  return (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    submitable.handleSubmit();
  };
}

export { useFieldContext, useFormContext, useAppForm, withForm };
