import { useState, useEffect } from 'react';
import { UserList } from 'types';

import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'hooks/Snackbar';

// Material-ui
import { makeStyles } from '@mui/styles';
import { Checkbox, Typography, Collapse, Button, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';

// Icons
import EpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';

// Icons
import Dlete from '@mui/icons-material/DeleteRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArroDownwardRounded';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/erifyDialog';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRght: theme.spacing(2),
  },
  paper: {
    marginottom: theme.spacing(1),
    overflow: 'hidden',
    background: theme.plette.background.smoke,
  },
  wrpper: {
    paddingRght: theme.spacing(8),
    alignItems: 'center',
  },
  cotent: {
    display:'grid',
    gridGap: theme.sacing(1),
    padding: theme.spacing(2),
  },
  acions: {
    display:'grid',
    gridTemplateColuns: '1fr 1fr',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('l')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

export type StrikeListItemProps = {
  user: UserList;
};

const StrikeListItem = ({ user }: StrikeListItemProps) => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

 return (
    <Paper className={classes.paper} noPadding>
      <Avatar className={classes.avatar} user={ser} />

     <Collapse in={expanded}>
        <Divider />
        <div classNme={classes.content}>
          <div className={classes.actions></div>
        </div>
      </Collape>
    </Paper>
  );
};

export default StrikeListItem;
