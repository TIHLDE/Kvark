import { useParams, Link } from 'react-router-dom';
import URLS from 'URLS';
import { useGroup, useGroupForms } from 'hooks/Group';

import { List, ListItemButton, ListItemText, Button, ListItemIcon, Stack } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';
import ViewIcon from '@mui/icons-material/PreviewRounded';

import Expand from 'components/layout/Expand';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import FormAnswers from 'components/forms/FormAnswers';
import FormEditor from 'components/forms/FormEditor';
import FormStatistics from 'components/forms/FormStatistics';
import AddGroupFormDialog from 'pages/Groups/forms/AddGroupFormDialog';
import Paper from 'components/layout/Paper';
import ShareButton from 'components/miscellaneous/ShareButton';

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
              <Expand flat header={form.title} key={form.id} sx={{ background: (theme) => theme.palette.background.default }}>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={1} sx={{ mb: 1 }}>
                  <Button component={Link} endIcon={<ViewIcon />} fullWidth to={`${URLS.form}${form.id}/`} variant='outlined'>
                    Svar på/se skjema
                  </Button>
                  <ShareButton fullWidth shareId={form.id} shareType='form' title={form.title} />
                </Stack>
                <div>
                  <Expand flat header='Rediger spørsmål'>
                    <FormEditor form={form} />
                  </Expand>
                  <Expand flat header='Sammendrag av flervalgsspørsmål'>
                    <FormStatistics formId={form.id} />
                  </Expand>
                  <Expand flat header='Alle svar'>
                    <FormAnswers formId={form.id} />
                  </Expand>
                </div>
              </Expand>
            ))}
          </div>
        </>
      ) : (
        <List disablePadding>
          {forms.map((form) => (
            <Paper key={form.id} noOverflow noPadding sx={{ mb: 1 }}>
              <ListItemButton component={Link} to={`${URLS.form}${form.id}/`}>
                <ListItemText primary={form.title} />
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <ArrowIcon />
                </ListItemIcon>
              </ListItemButton>
            </Paper>
          ))}
        </List>
      )}
      {!forms.length && <NotFoundIndicator header='Gruppen har ingen spørreskjemaer' />}
    </>
  );
};

export default GroupForms;
