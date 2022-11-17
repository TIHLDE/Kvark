import MultipleIcon from '@mui/icons-material/AllInclusiveRounded';
import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import OnlyMembersIcon from '@mui/icons-material/GroupsRounded';
import OpenIcon from '@mui/icons-material/LockOpenRounded';
import ViewIcon from '@mui/icons-material/PreviewRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import { Alert, Button, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip } from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { GroupForm } from 'types';

import { useGroup, useGroupForms } from 'hooks/Group';

import AddGroupFormDialog from 'pages/Groups/forms/AddGroupFormDialog';

import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import ShareButton from 'components/miscellaneous/ShareButton';

const GroupFormAdminListItem = ({ form }: { form: GroupForm }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper key={form.id} noOverflow noPadding>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <ListItemText
            primary={form.title}
            secondary={
              <Stack direction='row' gap={1}>
                <Tooltip title={`Spørreskjemaet er ${form.is_open_for_submissions ? '' : 'ikke '}åpent for innsending av svar`}>
                  <OpenIcon color={form.is_open_for_submissions ? 'success' : 'error'} sx={{ fontSize: 'inherit' }} />
                </Tooltip>
                <Tooltip title={`Spørreskjemaet er åpent for ${form.only_for_group_members ? 'kun medlemmer av gruppen' : 'alle'}`}>
                  <OnlyMembersIcon color={form.only_for_group_members ? 'error' : 'success'} sx={{ fontSize: 'inherit' }} />
                </Tooltip>
                <Tooltip title={`Spørreskjemaet kan ${form.can_submit_multiple ? '' : 'ikke '}besvares flere ganger`}>
                  <MultipleIcon color={form.can_submit_multiple ? 'success' : 'error'} sx={{ fontSize: 'inherit' }} />
                </Tooltip>
              </Stack>
            }
          />
          <ListItemIcon sx={{ minWidth: 0 }}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded} mountOnEnter unmountOnExit>
        <Divider />
        <Stack gap={2} sx={{ p: 1 }}>
          {!form.is_open_for_submissions && <Alert severity='info'>Du må åpne spørreskjemaet for innsending for å kunne svare på og dele skjemaet.</Alert>}
          <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
            <Button component={Link} endIcon={<SettingsIcon />} fullWidth to={`${URLS.form}admin/${form.id}/`} variant='outlined'>
              Administrer
            </Button>
            <Button
              component={Link}
              disabled={!form.is_open_for_submissions}
              endIcon={<ViewIcon />}
              fullWidth
              to={`${URLS.form}${form.id}/`}
              variant='outlined'>
              Svar på/se skjema
            </Button>
            <ShareButton disabled={!form.is_open_for_submissions} fullWidth shareId={form.id} shareType='form' title={form.title} />
          </Stack>
        </Stack>
      </Collapse>
    </Paper>
  );
};

const GroupForms = () => {
  const { slug } = useParams<'slug'>();
  const { data: group } = useGroup(slug || '-');
  const { data: forms } = useGroupForms(slug || '-');

  const isAdmin = group?.permissions.group_form;
  if (!forms || !slug || !group) {
    return null;
  }

  return (
    <>
      {isAdmin ? (
        <>
          <AddGroupFormDialog groupSlug={slug} sx={{ mb: 2 }} />
          <div>
            <Stack component={List} disablePadding gap={1}>
              {forms.map((form) => (
                <GroupFormAdminListItem form={form} key={form.id} />
              ))}
            </Stack>
          </div>
        </>
      ) : (
        <List disablePadding>
          {forms.map((form) => (
            <Paper key={form.id} noOverflow noPadding sx={{ mb: 1 }}>
              <ListItem disablePadding>
                <ListItemButton component={Link} to={`${URLS.form}${form.id}/`}>
                  <ListItemText primary={form.title} />
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <ArrowIcon />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
      {!forms.length && <NotFoundIndicator header='Gruppen har ingen spørreskjemaer' />}
    </>
  );
};

export default GroupForms;
