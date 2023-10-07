import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, ListItemIcon, ListItemText } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { useState } from 'react';

import ConfirmDialog from '../ConfirmDialog';
import useStyles from './styles';
import { CommentDispatchContext } from './temp/reducer';
import { Comment } from './types';

interface AdminButtonProps {
  comment: Comment;
}

/**
 * Button for displaying admin controls for a comment
 * Is conditionally rendered if the user of the site is an admin
 */
export default function AdminButton(props: AdminButtonProps) {
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { classes } = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const dispatch = React.useContext(CommentDispatchContext);

  const handleFlag = () => {
    setIsFlagDialogOpen(true);
    handleClose();
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    handleClose();
  };

  const handleConfirmDelete = () => {
    setIsDeleteDialogOpen(false);
    dispatch({
      type: 'delete',
      payload: {
        commentId: props.comment.id,
      },
    });
  };

  const handleConfirmFlag = () => {
    setIsFlagDialogOpen(false);
    dispatch({
      type: 'flag',
      payload: {
        commentId: props.comment.id,
      },
    });
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        className={classes.moreButton}
        id='admin-button'
        onClick={handleClick}
        size='small'>
        <MoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='basic-menu'
        MenuListProps={{
          'aria-labelledby': 'admin-button',
        }}
        onClose={handleClose}
        open={open}>
        <MenuItem onClick={handleFlag}>
          <ListItemIcon>
            <FlagIcon color='warning' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Rapporter' primaryTypographyProps={{ color: 'warning.main' }} />
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon color='error' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Slett' primaryTypographyProps={{ color: 'error.main' }} />
        </MenuItem>
      </Menu>
      <ConfirmDialog
        description={'Dette medfører at forfatteren av vedrørende kommentar får en prikk.\nKommentaren vil bli gjemt fra kommentarfeltet.'} // TODO change this when real info is ready
        isOpen={isFlagDialogOpen}
        onCancel={() => setIsFlagDialogOpen(false)}
        onConfirm={handleConfirmFlag} /*  TODO add logic for flagging */
        title='Rapportere kommentar?'
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete} /*  TODO add logic for deleting */
        title='Slette kommentar?'
      />
    </div>
  );
}
