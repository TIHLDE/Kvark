import PaidIcon from '@mui/icons-material/CreditScoreRounded';
import Delete from '@mui/icons-material/DeleteRounded';
import ApprovedIcon from '@mui/icons-material/DoneOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Button, Checkbox, Chip, Collapse, Divider, ListItem, ListItemButton, ListItemProps, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDate } from 'utils';

import { Group, GroupFine, GroupFineMutate } from 'types';

import { useDeleteGroupFine, useUpdateGroupFine } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useAnalytics } from 'hooks/Utils';

import { useCheckedFines, useToggleCheckedFine } from 'pages/Groups/fines/FinesContext';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';

export type FineItemProps = {
  fine: GroupFine;
  groupSlug: Group['slug'];
  isAdmin?: boolean;
  hideUserInfo?: boolean;
} & ListItemProps;

const FineItem = ({ fine, groupSlug, isAdmin, hideUserInfo, ...props }: FineItemProps) => {
  const { event } = useAnalytics();
  const showSnackbar = useSnackbar();
  const updateFine = useUpdateGroupFine(groupSlug, fine.id);
  const deleteFine = useDeleteGroupFine(groupSlug, fine.id);
  const checkedFines = useCheckedFines();
  const onCheck = useToggleCheckedFine();
  const [editOpen, setEditOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { register, formState, handleSubmit } = useForm<Pick<GroupFineMutate, 'amount' | 'reason'>>({
    defaultValues: { amount: fine.amount, reason: fine.reason },
  });

  const onUpdateFine = (data: Pick<GroupFineMutate, 'amount' | 'reason'>) => {
    event('update', 'fines', `Updated a single fine`);
    updateFine.mutate(data, {
      onSuccess: () => {
        showSnackbar(`Boten er oppdatert}`, 'success');
        setEditOpen(false);
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });
  };

  const toggleApproved = () => {
    event('update', 'fines', `Approved a single fine`);
    updateFine.mutate(
      { approved: !fine.approved },
      {
        onSuccess: () => showSnackbar(`Boten er nå markert som ${fine.approved ? 'ikke godkjent' : 'godkjent'}`, 'success'),
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );
  };

  const togglePayed = () => {
    event('update', 'fines', `Payed a single fine`);
    updateFine.mutate(
      { payed: !fine.payed },
      {
        onSuccess: () => showSnackbar(`Boten er nå markert som ${fine.payed ? 'ikke betalt' : 'betalt'}`, 'success'),
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );
  };

  return (
    <Paper noOverflow noPadding>
      <ListItem
        dense
        disablePadding
        secondaryAction={isAdmin && onCheck && <Checkbox checked={checkedFines.includes(fine.id)} edge='end' onClick={() => onCheck(fine.id)} />}
        {...props}>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)} sx={{ py: 0 }}>
          <Typography sx={{ fontWeight: 'bold', ml: 0.5, mr: 2 }} variant='h3'>
            {fine.amount}
          </Typography>
          <ListItemText
            primary={
              <>
                {hideUserInfo ? fine.description : `${fine.user.first_name} ${fine.user.last_name}`}
                <Tooltip title={`Boten er ${fine.approved ? '' : 'ikke '} godkjent`}>
                  <ApprovedIcon color={fine.approved ? 'success' : 'error'} sx={{ fontSize: 'inherit', ml: 0.5, mb: '-1px' }} />
                </Tooltip>
                <Tooltip title={`Boten er ${fine.payed ? '' : 'ikke '} betalt`}>
                  <PaidIcon color={fine.payed ? 'success' : 'error'} sx={{ fontSize: 'inherit', ml: 0.5, mb: '-1px' }} />
                </Tooltip>
              </>
            }
            secondary={hideUserInfo ? formatDate(parseISO(fine.created_at), { fullDayOfWeek: true, fullMonth: true }) : fine.description}
          />
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <Stack gap={1} sx={{ p: [1, undefined, 2] }}>
          <Stack direction='row' gap={1}>
            <Chip color={fine.approved ? 'success' : 'error'} icon={<ApprovedIcon />} label={fine.approved ? 'Godkjent' : 'Ikke godkjent'} variant='outlined' />
            <Chip color={fine.payed ? 'success' : 'error'} icon={<PaidIcon />} label={fine.payed ? 'Betalt' : 'Ikke betalt'} variant='outlined' />
          </Stack>
          <div>
            {fine.reason && <Typography variant='subtitle2'>{`Begrunnelse: ${fine.reason}`}</Typography>}
            <Typography variant='subtitle2'>{`Opprettet av: ${fine.created_by.first_name} ${fine.created_by.last_name}`}</Typography>
            <Typography variant='subtitle2'>{`Dato: ${formatDate(parseISO(fine.created_at), { fullDayOfWeek: true, fullMonth: true })}`}</Typography>
          </div>
          {isAdmin && (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
                <Button
                  color={fine.approved ? 'error' : 'success'}
                  disabled={fine.payed}
                  fullWidth
                  onClick={toggleApproved}
                  startIcon={<ApprovedIcon />}
                  variant='contained'>
                  Merk som {fine.approved ? 'ikke godkjent' : 'godkjent'}
                </Button>
                <Button
                  color={fine.payed ? 'error' : 'success'}
                  disabled={!fine.approved}
                  fullWidth
                  onClick={togglePayed}
                  startIcon={<PaidIcon />}
                  variant='contained'>
                  Merk som {fine.payed ? 'ikke betalt' : 'betalt'}
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
