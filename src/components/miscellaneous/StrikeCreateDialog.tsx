import { Button, ButtonProps, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getStrikeReasonAsText } from 'utils';

import { Event, StrikeCreate, User } from 'types';
import { StrikeReason } from 'types/Enums';

import { useCreateStrike } from 'hooks/Strike';

import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';

export type StrikeCreateDialogProps = {
  userId: User['user_id'];
  eventId: Event['id'];
} & ButtonProps;

type FormData = Pick<StrikeCreate, 'description' | 'strike_size'> & {
  strike_enum: StrikeReason | 'custom';
};

const StrikeCreateDialog = ({ userId, eventId, ...props }: StrikeCreateDialogProps) => {
  const createStrike = useCreateStrike();
  const [open, setOpen] = useState(false);
  const { register, formState, control, handleSubmit, setError, watch } = useForm<FormData>({
    defaultValues: { strike_size: 1, strike_enum: StrikeReason.LATE },
  });
  const selectedEnum = watch('strike_enum');

  const onSubmit = async (data: FormData) => {
    const baseStrikeInfo = { user_id: userId, event_id: eventId };
    createStrike.mutate(
      {
        ...(data.strike_enum === 'custom' ? {} : { enum: data.strike_enum }),
        description: data.description,
        strike_size: Number(data.strike_size),
        ...baseStrikeInfo,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (e) => {
          setError('strike_enum', { message: e.detail });
        },
      },
    );
  };

  const CREATE_DESCRIPTION = `Deltagere på arrangementer får automatisk prikk for følgende:
- Avmelding etter avmeldingsfrist (umiddelbart)
- Møtte ikke opp (kl. 12:00 dagen etter arrangementsslutt)
`;

  return (
    <>
      <Button fullWidth variant='outlined' {...props} onClick={() => setOpen(true)}></Button>
      <Dialog contentText={CREATE_DESCRIPTION} maxWidth='md' onClose={() => setOpen(false)} open={open} titleText='Opprett prikk'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select control={control} formState={formState} label='Begrunnelse' name='strike_enum'>
            {(Object.keys(StrikeReason) as Array<StrikeReason>).map((strikeEnum) => (
              <MenuItem key={strikeEnum} sx={{ whiteSpace: 'break-spaces' }} value={strikeEnum}>
                {getStrikeReasonAsText(strikeEnum)}
              </MenuItem>
            ))}
            <MenuItem value='custom'>Egendefinert begrunnelse</MenuItem>
          </Select>
          {selectedEnum === 'custom' && (
            <>
              <TextField
                disabled={createStrike.isLoading}
                formState={formState}
                label='Antall prikker'
                {...register('strike_size', { required: 'Antall prikker er påkrevd' })}
                required
                type='number'
              />
              <TextField
                disabled={createStrike.isLoading}
                formState={formState}
                label='Begrunnelse'
                {...register('description', { required: 'En begrunnelse er påkrevd' })}
                required
              />
            </>
          )}
          <SubmitButton disabled={createStrike.isLoading} formState={formState}>
            Opprett prikk
          </SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default StrikeCreateDialog;
