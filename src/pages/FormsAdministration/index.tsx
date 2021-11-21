// Icons
import EditIcon from '@mui/icons-material/EditRounded';
import OpenIcon from '@mui/icons-material/OpenInBrowserRounded';
import FormsIcon from '@mui/icons-material/HelpOutlineRounded';
import { Collapse, Typography } from '@mui/material';
// Material-UI
import { makeStyles } from '@mui/styles';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
// Project components
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import Page from 'components/navigation/Page';
import { EMAIL_REGEX } from 'constant';
import { useGroup, useUpdateGroup } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Group, GroupForm } from 'types';
import URLS from 'URLS';
import FormEditor from 'components/forms/FormEditor';
import { useGroupForms } from 'hooks/GroupForms';
import GroupFormAdmin from './components/FormEditList';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginLeft: theme.spacing(35),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(4, 1, 6),
      marginLeft: 0,
    },
  },
  content: {
    maxWidth: 900,
    margin: '0 auto',
  },
  header: {
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const GroupAdministration = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { slug: slugParameter } = useParams<'slug'>();
  const slug = (slugParameter || '-').toLowerCase();
  const { data: group, isLoading: isLoadingGroups, isError } = useGroup(slug);

  const editTab = { value: 'edit', label: slug ? 'Endre' : 'Skriv', icon: EditIcon };
  const formsTab = { value: 'forms', label: 'Skjemaer', icon: FormsIcon };
  const navigateTab = { value: 'navigate', label: 'Se gruppe', icon: OpenIcon };
  const tabs = slug ? [editTab, navigateTab, formsTab] : [editTab];
  const [tab, setTab] = useState(editTab.value);

  const { register, formState, handleSubmit } = useForm();
  const updateGroup = useUpdateGroup();
  const showSnackbar = useSnackbar();

  const submit = async (formData: Group) => {
    const data = { ...group, name: formData.name, description: formData.description, contact_email: formData.contact_email };
    // updateGroup.mutate(data, {
    //   onSuccess: () => {
    //     showSnackbar('Gruppe oppdatert', 'success');
    //   },
    //   onError: (e) => {
    //     showSnackbar(e.detail, 'error');
    //   },
    // });
  };

  const goToForm = (newForm: string | number | null) => {
    if (newForm) {
      navigate(`${URLS.formsAdmin}${newForm}/`);
    } else {
      setTab(editTab.value);
      navigate(URLS.formsAdmin);
    }
  };

  if (isLoadingGroups || !group) {
    return null;
  }

  return (
    <Page maxWidth={false} options={{ lightColor: 'blue', filledTopbar: true, gutterBottom: true, gutterTop: true, noFooter: true, title: 'Admin grupper' }}>
      {/* <SidebarList
        descKey='start_date'
        formatDesc={(desc) => formatDate(parseISO(desc))}
        idKey='id'
        onItemClick={(id: number | null | string) => goToEvent(id || null || '')}
        selectedItemId={Number(eventId)}
        title='Arrangementer'
        titleKey='title'
        useHook={useEvents}
      /> */}
      <div className={classes.root}>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h2'>
            {slug ? 'Endre gruppe' : 'Ny gruppe'}
          </Typography>
          <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
          <Paper>
            <Collapse in={tab === editTab.value} mountOnEnter>
              {/* <FormAdmin formId={slug} goToForm={goToForm} /> */}
              <form onSubmit={handleSubmit(submit)}>
                <TextField
                  defaultValue={group.name}
                  formState={formState}
                  label='Gruppenavn'
                  {...register('name', { required: 'Gruppen må ha et navn' })}
                  required
                />
                <TextField defaultValue={group.description} formState={formState} label='Gruppebeskrivelse' multiline {...register('description')} rows={6} />
                <TextField
                  defaultValue={group.contact_email}
                  formState={formState}
                  label='Kontakt e-post'
                  {...register('contact_email', {
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'Ugyldig e-post',
                    },
                  })}
                  type='email'
                />
                <SubmitButton disabled={updateGroup.isLoading} formState={formState} sx={{ mt: 2 }}>
                  Oppdater gruppe
                </SubmitButton>
              </form>
            </Collapse>
            <Collapse in={tab === formsTab.value} mountOnEnter>
              <GroupFormAdmin slug={slug} />
            </Collapse>
            {tab === navigateTab.value && <Navigate to={`${URLS.form}${slug}/`} />}
          </Paper>
        </div>
      </div>
    </Page>
  );
};

export default GroupAdministration;
