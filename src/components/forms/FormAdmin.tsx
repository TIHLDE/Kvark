import { Form } from 'types';
import { useFormById } from 'hooks/Form';

import Expand from 'components/layout/Expand';
import FormAnswers from 'components/forms/FormAnswers';
import FormFieldsEditor from 'components/forms/FormFieldsEditor';
import FormDetailsEditor from 'components/forms/FormDetailsEditor';
import FormStatistics from 'components/forms/FormStatistics';

export type FormAdminProps = {
  formId: Form['id'];
};

const FormAdmin = ({ formId }: FormAdminProps) => {
  const { data: form } = useFormById(formId);

  if (!form) {
    return null;
  }

  return (
    <div>
      <Expand flat header='Skjema-innstillinger' TransitionProps={{ mountOnEnter: true }}>
        <FormDetailsEditor form={form} />
      </Expand>
      <Expand flat header='Rediger spørsmål' TransitionProps={{ mountOnEnter: true }}>
        <FormFieldsEditor form={form} />
      </Expand>
      <Expand flat header='Sammendrag av flervalgsspørsmål' TransitionProps={{ mountOnEnter: true }}>
        <FormStatistics formId={form.id} />
      </Expand>
      <Expand flat header='Alle svar' TransitionProps={{ mountOnEnter: true }}>
        <FormAnswers formId={form.id} />
      </Expand>
    </div>
  );
};

export default FormAdmin;