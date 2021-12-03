// Material-UI
import { Button, LinearProgress, styled, Typography } from '@mui/material';

// Project
import FormAnswers from 'components/forms/FormAnswers';
import FormEditor from 'components/forms/FormEditor';
import FormStatistics from 'components/forms/FormStatistics';
import Expansion from 'components/layout/Expand';
import { useGroupForms } from 'hooks/GroupForms';
import { GroupForm } from 'types';
import GroupFormCreateEditor from './GroupFormEditor';

export type GroupFormAdminProps = {
  slug: string;
};

const NestedExpansion = styled(Expansion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const HeadExpansion = styled(Expansion)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  background: theme.palette.background.default,
}));

const GroupFormAdmin = ({ slug }: GroupFormAdminProps) => {
  const { data, isLoading, isError } = useGroupForms(slug);

  if (isLoading || !data) {
    return <LinearProgress />;
  }

  return (
    <div>
      <Typography variant='h3'>Alle skjemaer</Typography>
      <Typography variant='caption'>
        Her er alle skjemaene gruppen din har laget. Under kan du lage nye, endre eller slette eksisterende og se svar fra brukere.
      </Typography>

      {/* TODO: Should be better separated by the rest */}
      <HeadExpansion flat header='Opprett nytt skjema' sx={{ mt: 1 }}>
        <GroupFormCreateEditor groupSlug={slug} />
      </HeadExpansion>
      {data.map((form: GroupForm, index) => (
        <Expansion flat header={form.title} key={index}>
          <NestedExpansion flat header='Rediger spørsmål' sx={{ mt: 1 }}>
            <FormEditor form={form} />
          </NestedExpansion>
          <NestedExpansion flat header='Sammendrag av flervalgsspørsmål'>
            <FormStatistics formId={form.id} />
          </NestedExpansion>
          <NestedExpansion flat header='Alle svar'>
            <FormAnswers formId={form.id} />
          </NestedExpansion>
        </Expansion>
      ))}
    </div>
  );
};

export default GroupFormAdmin;
