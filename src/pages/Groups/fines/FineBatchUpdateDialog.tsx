import { useState, forwardRef, Ref } from 'react';
import { useBatchUpdateGroupFine } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useGoogleAnalytics } from 'hooks/Utils';
import { Group, GroupFineBatchMutate } from 'types';

import { Fab, Stack, Button, Zoom } from '@mui/material';
import EditIcon from '@mui/icons-material/EditRounded';
import PayedIcon from '@mui/icons-material/CreditScoreRounded';
import ApprovedIcon from '@mui/icons-material/DoneOutlineRounded';

import Dialog from 'components/layout/Dialog';
import { useCheckedFines, useClearCheckedFines } from 'pages/Groups/fines/FinesContext';

export type FineBatchUpdateDialogProps = {
  groupSlug: Group['slug'];
};

const FineBatchUpdateDialog = forwardRef(function FineBatchUpdateDialog({ groupSlug }: FineBatchUpdateDialogProps, ref: Ref<HTMLButtonElement>) {
  const { event } = useGoogleAnalytics();
  const checkedFines = useCheckedFines();
  const clearCheckedFines = useClearCheckedFines();
  const [dialogOpen, setDialogOpen] = useState(false);
  const batchUpdateFines = useBatchUpdateGroupFine(groupSlug);
  const showSnackbar = useSnackbar();

  const onBatchUpdate = (data: GroupFineBatchMutate['data']) => {
    event('update-batch', 'fines', `Updated a batch of fines`);
    batchUpdateFines.mutate(
      { fine_ids: checkedFines, data },
      {
        onSuccess: () => {
          showSnackbar('Bøtene ble oppdatert', 'success');
          setDialogOpen(false);
          clearCheckedFines();
        },
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );
  };

  return (
    <>
      <Dialog
        contentText='Gjør endringer på alle de markerte bøtene samtidig'
        onClose={() => setDialogOpen(false)}
        open={dialogOpen && Boolean(checkedFines.length)}
        titleText='Endre flere bøter'>
        <Stack gap={1} sx={{ pt: 1 }}>
          <Button color='success' onClick={() => onBatchUpdate({ approved: true })} startIcon={<ApprovedIcon />} variant='outlined'>
            Marker som godkjent
          </Button>
          <Button color='success' onClick={() => onBatchUpdate({ payed: true })} startIcon={<PayedIcon />} variant='outlined'>
            Marker som betalt
          </Button>
        </Stack>
      </Dialog>
      <Zoom in={Boolean(checkedFines.length)}>
        <Fab color='primary' onClick={() => setDialogOpen(true)} ref={ref} variant='extended'>
          <EditIcon sx={{ mr: 1 }} />
          Endre
        </Fab>
      </Zoom>
    </>
  );
});

export default FineBatchUpdateDialog;
