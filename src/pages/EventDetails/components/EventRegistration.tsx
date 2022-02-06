import { ComponentType, useState } from 'react';
import { Event, User, Submission, Form } from 'types';
import URLS from 'URLS';
import { getUserStudyShort, shortDownString } from 'utils';
import { useCreateEventRegistration } from 'hooks/Event';
import { useFormById, useCreateSubmission, validateSubmissionInput } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';
import { useForm } from 'react-hook-form';

// Material UI Components
import { Box, IconProps, Typography, FormControlLabel, Checkbox } from '@mui/material';

// Icons
import PersonIcon from '@mui/icons-material/PersonOutlineRounded';
import MailIcon from '@mui/icons-material/MailOutlineRounded';
import AllergyIcon from '@mui/icons-material/FastfoodRounded';
import SchoolIcon from '@mui/icons-material/SchoolRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';

// Project components
import Paper from 'components/layout/Paper';
import FormView from 'components/forms/FormView';
import SubmitButton from 'components/inputs/SubmitButton';
import { useAnalytics } from 'hooks/Utils';
import { useConfetti } from 'hooks/Confetti';

type ListItemProps = {
  icon: ComponentType<{ className?: string; sx?: IconProps['sx'] }>;
  text: string;
};

const ListItem = ({ icon: Icon, text }: ListItemProps) => (
  <Box sx={{ display: 'flex' }}>
    <Icon sx={{ mr: 1, color: (theme) => theme.palette.text.secondary }} />
    <Typography>{text}</Typography>
  </Box>
);

export type EventRegistrationProps = {
  event: Event;
  user: User;
};

const EventRegistration = ({ event, user }: EventRegistrationProps) => {
  const { run } = useConfetti();
  const { event: GAEvent } = useAnalytics();
  const createRegistration = useCreateEventRegistration(event.id);
  const createSubmission = useCreateSubmission(event.survey || '-');
  const showSnackbar = useSnackbar();
  const { data: form, isLoading: isFormLoading } = useFormById(event.survey || '-');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [allowPhoto, setAllowPhoto] = useState(true);
  const allergy = user.allergy ? shortDownString(user.allergy, 20) : 'Ingen';

  const { register, handleSubmit, formState, setError, getValues, control } = useForm<Form['fields']>();

  const registerDisabled = isLoading || isFormLoading || !agreeRules;

  const submit = async (data: Submission) => {
    if (registerDisabled) {
      showSnackbar('Du må godkjenne arrangementsreglene før du kan melde deg på', 'warning');
      return;
    }
    setIsLoading(true);
    if (form && data) {
      data.answers = data.answers || [];
      try {
        validateSubmissionInput(data, form);
      } catch (e) {
        setError(e.message, { message: 'Du må velge ett eller flere alternativ' });
        setIsLoading(false);
        return;
      }
      try {
        await createSubmission.mutateAsync(data);
      } catch (e) {
        showSnackbar(e.detail, 'error');
        setIsLoading(false);
        return;
      }
    }
    createRegistration.mutate(
      { allow_photo: allowPhoto },
      {
        onSuccess: () => {
          run();
          showSnackbar('Påmeldingen var vellykket', 'success');
          GAEvent('registered', 'event-registration', `Registered for event: ${event.title}`);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>
          Vennligst se over at følgende opplysninger stemmer. Dine opplysninger vil bli delt med TIHLDE. Du kan endre informasjonen i profilen din, også etter
          påmelding!
        </Typography>
        <Box component='form' onSubmit={handleSubmit(submit)} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ my: 1 }}>
            <ListItem icon={PersonIcon} text={`Navn: ${user.first_name} ${user.last_name}`} />
            <ListItem icon={MailIcon} text={`Epost: ${user.email}`} />
            <ListItem icon={SchoolIcon} text={`Studieprogram: ${getUserStudyShort(user.user_study)}`} />
            <ListItem icon={HomeIcon} text={`Klasse: ${user.user_class}`} />
            <ListItem icon={AllergyIcon} text={`Allergier: ${allergy}`} />
          </Paper>
          {form !== undefined && (
            <Paper sx={{ my: 1 }}>
              <Typography variant='h3'>Spørsmål</Typography>
              <Typography gutterBottom variant='subtitle2'>
                Arrangøren ønsker at du svarer på følgende spørsmål:
              </Typography>
              <FormView control={control} disabled={isLoading || isFormLoading} form={form} formState={formState} getValues={getValues} register={register} />
            </Paper>
          )}
          <FormControlLabel
            control={<Checkbox checked={allowPhoto} onChange={(e) => setAllowPhoto(e.target.checked)} />}
            disabled={isLoading || isFormLoading}
            label='Jeg godtar at bilder av meg kan deles på TIHLDE sine plattformer'
          />
          <FormControlLabel
            control={<Checkbox checked={agreeRules} onChange={(e) => setAgreeRules(e.target.checked)} />}
            disabled={isLoading || isFormLoading}
            label='Jeg godtar arrangementsreglene'
          />
          <Typography component='a' href={URLS.eventRules} rel='noopener noreferrer' target='_blank' variant='caption'>
            Les arrangementsreglene her (åpnes i ny fane)
          </Typography>
          <SubmitButton disabled={registerDisabled} formState={formState} sx={{ mt: 2 }}>
            Meld deg på
          </SubmitButton>
        </Box>
      </Box>
    </>
  );
};

export default EventRegistration;
