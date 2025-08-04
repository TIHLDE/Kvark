import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { ComponentProps, FormEvent } from 'react';

import { Button } from '../ui/button';
import { DateTimeField } from './inputs/datetime-field';
import { InputField } from './inputs/input-field';
import { SelectField } from './inputs/select-field';
import { SwitchField } from './inputs/switch-field';
import { TextareaField } from './inputs/textarea-field';
import { UserField } from './inputs/user-field';

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

type SubmitButtonProps = ComponentProps<typeof Button> & {
  loading?: React.ReactNode;
};

function SubmitButton({ children, loading, ...props }: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button {...props} type='submit' disabled={!canSubmit || isSubmitting}>
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
  },
  formComponents: {
    SubmitButton,
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
