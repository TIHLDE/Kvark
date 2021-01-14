import { MouseEvent as ReactMouseEvent, useState, useRef } from 'react';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

// Icons
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 'auto',
    marginLeft: theme.spacing(1),
  },
  list: {
    minWidth: 125,
  },
  popper: {
    zIndex: 10,
  },
}));
type optionsObject = {
  func: () => void;
  text: string;
};

export type DropdownButtonProps = {
  options: optionsObject[];
};

function DropdownButton({ options }: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const classes = useStyles();

  const handleMenuItemClick = (e: ReactMouseEvent<HTMLLIElement>, index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClose = (event: ReactMouseEvent<Document, MouseEvent>) => {
    if (anchorRef !== null && anchorRef !== undefined && anchorRef.current !== null && event) {
      if (anchorRef.current.contains(event.target as HTMLElement)) {
        return;
      }
    }

    setOpen(false);
  };

  return (
    <Grid alignItems='center' className={classes.root} container direction='column'>
      <Grid item xs={12}>
        <ButtonGroup aria-label='Knapp' color='primary' ref={anchorRef} variant='contained'>
          <Button onClick={options[selectedIndex].func} type='submit'>
            {options[selectedIndex].text}
          </Button>
          <Button
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup='menu'
            aria-label='Velg et alternativ'
            color='primary'
            onClick={handleToggle}
            size='small'>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper anchorEl={anchorRef.current} className={classes.popper} disablePortal open={open} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
              <Paper className={classes.list} noPadding>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id='split-button-menu'>
                    {options.map((option, index) => (
                      <MenuItem key={option.text} onClick={(event) => handleMenuItemClick(event, index)} selected={index === selectedIndex}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}

export default DropdownButton;
