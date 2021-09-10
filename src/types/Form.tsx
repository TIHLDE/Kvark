import { UserList } from 'types/User';
import { FormFieldType, FormResourceType, FormType } from 'types/Enums';

// -----------------------------------------------------------
// Interfaces used for the creating of forms and viewing forms
// -----------------------------------------------------------

export interface Form {
  id?: string;
  title: string;
  type: FormType;
  fields: Array<TextFormField | SelectFormField>;
  resource_type: FormResourceType;
}

export interface EventForm extends Form {
  type: FormType.SURVEY;
  event: number;
  resource_type: FormResourceType.EVENT_FORM;
}

interface FormField {
  id?: string;
  title: string;
  required: boolean;
}

export interface TextFormField extends FormField {
  options: Array<unknown>;
  type: FormFieldType.TEXT_ANSWER;
}

export interface SelectFormField extends FormField {
  options: Array<SelectFormFieldOption>;
  type: FormFieldType.MULTIPLE_SELECT | FormFieldType.SINGLE_SELECT;
}

export interface SelectFormFieldOption {
  id?: string;
  title: string;
}

export interface FormStatistics extends Form {
  statistics: Array<SelectFormFieldStatistics>;
}

export interface SelectFormFieldStatistics extends SelectFormField {
  options: Array<SelectFormFieldOptionStatistics>;
}

export interface SelectFormFieldOptionStatistics extends SelectFormFieldOption {
  answer_amount: number;
  answer_percentage: number;
}

// ------------------------------------
// Interfaces used when answering forms
// ------------------------------------

export interface Submission {
  answers: Array<TextFieldSubmission | SelectFieldSubmission>;
}

interface FieldSubmission {
  field: {
    id: string;
  };
}

export interface TextFieldSubmission extends FieldSubmission {
  answer_text: string;
}

export interface SelectFieldSubmission extends FieldSubmission {
  selected_options: Array<{ id: string }>;
}

export interface UserSubmission {
  user: UserList;
  answers: Array<TextFieldSubmission | SelectFieldSubmission>;
}
