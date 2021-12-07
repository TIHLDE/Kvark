import { useState } from 'react';
import { parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import { GroupFine, GroupFineMutate, Group } from 'types';
import { formatDate } from 'utils';
import { useUpdateGroupFine, useDeleteGroupFine } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { ListItem, ListItemButton, ListItemProps, Typography, Collapse, Button, Checkbox, Stack, Divider, ListItemText, Tooltip } from '@mui/material';

// Icons
import EditRounded from '@mui/icons-material/EditRounded';
import PayedIcon from '@mui/icons-material/CreditScoreRounded';
import ApprovedIcon from '@mui/icons-material/DoneOutlineRounded';
import Delete from '@mui/icons-material/DeleteRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';

import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import VerifyDialog from 'components/layout/VerifyDialog';

export type FineItemProps = {
  fine: GroupFine;
  groupSlug: Group['slug'];
  isAdmin?: boolean;
  checked?: boolean;
  onCheck?: (id: GroupFine['id']) => void;
} & ListItemProps;

const FineItem = ({ fine, groupSlug, isAdmin, checked, onCheck, ...props }: FineItemProps) => {
  const showSnackbar = useSnackbar();
  const updateFine = useUpdateGroupFine(groupSlug, fine.id);
  const deleteFine = useDeleteGroupFine(groupSlug, fine.id);
  const [editOpen, setEditOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { register, formState, handleSubmit } = useForm<Pick<GroupFineMutate, 'amount' | 'reason'>>({
    defaultValues: { amount: fine.amount, reason: fine.reason },
  });

  const onUpdateFine = (data: Pick<GroupFineMutate, 'amount' | 'reason'>) =>
    updateFine.mutate(data, {
      onSuccess: () => {
        showSnackbar(`Boten er oppdatert}`, 'success');
        setEditOpen(false);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });

  const toggleApproved = () =>
    updateFine.mutate(
      { approved: !fine.approved },
      {
        onSuccess: () => {
          showSnackbar(`Boten er nå markert som ${fine.approved ? 'ikke godkjent' : 'godkjent'}`, 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );

  const togglePayed = () =>
    updateFine.mutate(
      { payed: !fine.payed },
      {
        onSuccess: () => {
          showSnackbar(`Boten er nå markert som ${fine.payed ? 'ikke betalt' : 'betalt'}`, 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );

  return (
    <Paper noOverflow noPadding>
      <ListItem
        dense
        disablePadding
        secondaryAction={isAdmin && onCheck && <Checkbox checked={checked} edge='end' onClick={() => onCheck(fine.id)} />}
        {...props}>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <Typography sx={{ fontWeight: 'bold', ml: 0.5, mr: 2 }} variant='h3'>
            {fine.amount}
          </Typography>
          <ListItemText
            primary={
              <>
                {`${fine.user.first_name} ${fine.user.last_name}`}
                <Tooltip title={`Boten er ${fine.approved ? '' : 'ikke '} godkjent`}>
                  <ApprovedIcon color={fine.approved ? 'success' : 'error'} sx={{ fontSize: 'inherit', ml: 0.5, mb: '-1px' }} />
                </Tooltip>
                <Tooltip title={`Boten er ${fine.payed ? '' : 'ikke '} betalt`}>
                  <PayedIcon color={fine.payed ? 'success' : 'error'} sx={{ fontSize: 'inherit', ml: 0.5, mb: '-1px' }} />
                </Tooltip>
              </>
            }
            secondary={fine.description}
          />
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          <div>
            {fine.reason && <Typography variant='subtitle2'>{`Begrunnelse: ${fine.reason}`}</Typography>}
            <Typography variant='subtitle2'>{`Opprettet av: ${fine.created_by.first_name} ${fine.created_by.last_name}`}</Typography>
            <Typography variant='subtitle2'>{`Dato: ${formatDate(parseISO(fine.created_at), { fullDayOfWeek: true, fullMonth: true })}`}</Typography>
          </div>
          {isAdmin && (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
                <Button
                  color={fine.approved ? 'success' : 'error'}
                  disabled={fine.payed}
                  fullWidth
                  onClick={toggleApproved}
                  startIcon={<ApprovedIcon />}
                  variant='contained'>
                  {fine.approved ? 'Godkjent' : 'Ikke godkjent'}
                </Button>
                <Button
                  color={fine.payed ? 'success' : 'error'}
                  disabled={!fine.approved}
                  fullWidth
                  onClick={togglePayed}
                  startIcon={<PayedIcon />}
                  variant='contained'>
                  {fine.payed ? 'Betalt' : 'Ikke betalt'}
                </Button>
              </Stack>
              <Dialog onClose={() => setEditOpen(false)} open={editOpen} titleText='Endre bot'>
                <form onSubmit={handleSubmit(onUpdateFine)}>
                  <TextField formState={formState} label='Begrunnelse' {...register('reason')} />
                  <TextField disabled={fine.approved} formState={formState} InputProps={{ type: 'number' }} label='Endre antall' {...register('amount')} />
                  <SubmitButton formState={formState} variant='contained'>
                    Lagre
                  </SubmitButton>
                </form>
              </Dialog>
              <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
                <Button fullWidth onClick={() => setEditOpen(true)} startIcon={<EditRounded />} variant='outlined'>
                  Endre bot
                </Button>
                <VerifyDialog
                  color='error'
                  contentText={`Er du sikker på at du vil slette denne boten?`}
                  onConfirm={() => deleteFine.mutate(undefined)}
                  startIcon={<Delete />}>
                  Slett bot
                </VerifyDialog>
              </Stack>
            </>
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default FineItem;
