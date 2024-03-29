import PaidIcon from '@mui/icons-material/CreditScoreRounded';
import Delete from '@mui/icons-material/DeleteRounded';
import ApprovedIcon from '@mui/icons-material/DoneOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import DefenseIcon from '@mui/icons-material/ShieldRounded';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  ListItem,
  ListItemButton,
  ListItemProps,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDate } from 'utils';

import { Group, GroupFine, GroupFineDefenseMutate, GroupFineMutate, UserBase } from 'types';

import { useDeleteGroupFine, useUpdateGroupFine, useUpdateGroupFineDefense } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import { useCheckedFines, useToggleCheckedFine } from 'pages/Groups/fines/FinesContext';

import MarkdownEditor from 'components/inputs/MarkdownEditor';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';

export type FineItemProps = {
  fine: GroupFine;
  groupSlug: Group['slug'];
  isAdmin?: boolean;
  hideUserInfo?: boolean;
  fineUser?: UserBase;
} & ListItemProps;

const FineItem = ({ fine, groupSlug, isAdmin, hideUserInfo, fineUser, ...props }: FineItemProps) => {
  const { data: user } = useUser();
  const { event } = useAnalytics();
  const showSnackbar = useSnackbar();
  const updateFine = useUpdateGroupFine(groupSlug, fine.id);
  const updateFineDefense = useUpdateGroupFineDefense(groupSlug, fine.id);
  const deleteFine = useDeleteGroupFine(groupSlug, fine.id);
  const checkedFines = useCheckedFines();
  const onCheck = useToggleCheckedFine();
  const [editOpen, setEditOpen] = useState(false);
  const [editDefenseOpen, setEditDefenseOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { register, formState, handleSubmit } = useForm<Pick<GroupFineMutate, 'amount' | 'reason'>>({
    defaultValues: { amount: fine.amount, reason: fine.reason },
  });
  const {
    register: registerDefense,
    formState: formStateDefense,
    handleSubmit: handleSubmitDefense,
  } = useForm<GroupFineDefenseMutate>({
    defaultValues: { defense: fine.defense },
  });

  const onUpdateFine = (data: Pick<GroupFineMutate, 'amount' | 'reason'>) => {
    event('update', 'fines', `Updated a single fine`);
    updateFine.mutate(data, {
      onSuccess: () => {
        showSnackbar(`Boten er oppdatert`, 'success');
        setEditOpen(false);
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });
  };
  const onUpdateFineDefense = (data: GroupFineDefenseMutate) =>
    updateFineDefense.mutate(data, {
      onSuccess: () => {
        showSnackbar(`Forsvar av boten ble oppdatert`, 'success');
        setEditDefenseOpen(false);
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

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
            <Typography component='p' variant='subtitle2'>{`Opprettet av: ${fine.created_by.first_name} ${fine.created_by.last_name}`}</Typography>
            <Typography component='p' variant='subtitle2'>{`Dato: ${formatDate(parseISO(fine.created_at), {
              fullDayOfWeek: true,
              fullMonth: true,
            })}`}</Typography>
          </div>
          {fine.reason && (
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography component='p' variant='subtitle2'>
                Begrunnelse:
              </Typography>
              <MarkdownRenderer value={fine.reason} />
            </Paper>
          )}
          {fine.image && (
            <Box alt='Bildebevis' component='img' loading='lazy' src={fine.image} sx={{ borderRadius: 1, maxWidth: 600, m: 'auto', width: '100%' }} />
          )}
          {fine.defense && (
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography component='p' variant='subtitle2'>
                Forsvar fra den tiltalte:
              </Typography>
              <MarkdownRenderer value={fine.defense} />
            </Paper>
          )}
          {(fineUser || fine.user)?.user_id === user?.user_id && (
            <>
              <Button fullWidth onClick={() => setEditDefenseOpen(true)} startIcon={<DefenseIcon />} variant='outlined'>
                {fine.defense ? 'Endre forsvar' : 'Legg til forsvar'}
              </Button>
              <Dialog onClose={() => setEditDefenseOpen(false)} open={editDefenseOpen} titleText='Endre forsvar'>
                <form onSubmit={handleSubmitDefense(onUpdateFineDefense)}>
                  <MarkdownEditor formState={formStateDefense} label='Forsvar' {...registerDefense('defense')} />
                  <SubmitButton formState={formStateDefense} variant='contained'>
                    Lagre
                  </SubmitButton>
                </form>
              </Dialog>
            </>
          )}
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
                  <MarkdownEditor formState={formState} label='Begrunnelse' {...register('reason')} />
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
