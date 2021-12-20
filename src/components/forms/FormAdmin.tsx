import { Form } from 'types';
import { useFormById } from 'hooks/Form';

import Expand from 'components/layout/Expand';
import FormAnswers from 'components/forms/FormAnswers';
import FormEditor from 'components/forms/FormEditor';
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
      <Expand flat header='Rediger spørsmål' TransitionProps={{ mountOnEnter: true }}>
        <FormEditor form={form} />
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
