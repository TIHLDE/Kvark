import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface ConfirmDialogProps {
  /** The title in the dialog */
  title: string;
  /** Optional description for the action */
  description?: string;
  /** Optional text for confirm button, default "Ja" */
  confirmButtonText?: string;
  /** Optional text for cancel button, default "Nei" */
  cancelButtonText?: string;
  /** Event handler for cancelled dialog. Also triggered when user presses outside the dialog. This action should close the form */
  onCancel: () => void;
  /** Event handler for confirming dialog */
  onConfirm: () => void;
  /** If the dialog is currently open. Control using setState */
  isOpen: boolean;
  /** Sets the Ok button to a red color instead of primary, default true*/
  isConfirmDangerous?: boolean;
}

/** Generic dialog for confirming a user action, like deleting something
 * @example
 * ```
 * const [isDialogOpen, setIsDialogOpen] = useState(false);
 * // ....
 * <ConfirmDialog
 *   title='Slett kommentar'
 *   description='Handlingen er permanent'
 *   isOpen={isDialogOpen}
 *   onCancel={() => setIsDialogOpen(false)}
 *   onConfirm={doSomething}
 * />
 * ```
 */
export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <div>
      <Dialog aria-describedby='alert-dialog-description' aria-labelledby='alert-dialog-title' onClose={props.onCancel} open={props.isOpen}>
        <DialogTitle id='alert-dialog-title'>{props.title}</DialogTitle>
        <DialogContent sx={{ marginBottom: 0, paddingBottom: 0 }}>
          {props.description && <DialogContentText id='alert-dialog-description'>{props.description}</DialogContentText>}
        </DialogContent>
        <DialogActions
          sx={(theme) => ({
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(1),
          })}>
          <Button color='primary' onClick={props.onCancel} variant='outlined'>
            {props.cancelButtonText ?? 'Nei'}
          </Button>
          <Button autoFocus color={props.isConfirmDangerous !== false ? 'error' : undefined} onClick={props.onConfirm} variant='outlined'>
            {props.confirmButtonText ?? 'Ja'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
