import { useParams, Link } from 'react-router-dom';
import URLS from 'URLS';
import { useGroup, useGroupForms } from 'hooks/Group';

import { List, ListItemButton, ListItemText, Button, styled, ListItemIcon } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';

import Expand from 'components/layout/Expand';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import FormAnswers from 'components/forms/FormAnswers';
import FormEditor from 'components/forms/FormEditor';
import FormStatistics from 'components/forms/FormStatistics';
import AddGroupFormDialog from 'pages/Groups/forms/AddGroupFormDialog';

const Expansion = styled(Expand)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const GroupForms = () => {
  const { slug } = useParams<'slug'>();
  const { data: group } = useGroup(slug || '-');
  const { data: forms } = useGroupForms(slug || '-');

  const isAdmin = group?.permissions.write;

  if (!forms || !slug || !group) {
    return null;
  }

  return (
    <>
      {isAdmin ? (
        <>
          <AddGroupFormDialog groupSlug={slug} sx={{ mb: 2 }} />
          <div>
            {forms.map((form) => (
              <Expansion header={form.title} key={form.id} sx={{ backgroundColor: (theme) => theme.palette.background.paper }}>
                <Button component={Link} sx={{ mb: 1 }} to={`${URLS.form}${form.id}/`} variant='outlined'>
                  Svar på skjema
                </Button>
                <Expansion flat header='Rediger spørsmål'>
                  <FormEditor form={form} />
                </Expansion>
                <Expansion flat header='Sammendrag av flervalgsspørsmål'>
                  <FormStatistics formId={form.id} />
                </Expansion>
                <Expansion flat header='Alle svar'>
                  <FormAnswers formId={form.id} />
                </Expansion>
              </Expansion>
            ))}
          </div>
        </>
      ) : (
        <List>
          {forms.map((form) => (
            <ListItemButton component={Link} key={form.id} to={`${URLS.form}${form.id}/`}>
              <ListItemText primary={form.title} />
              <ListItemIcon>
                <ArrowIcon />
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      )}
      {!forms.length && <NotFoundIndicator header='Gruppen har ingen spørreskjemaer' />}
    </>
  );
};

export default GroupForms;
