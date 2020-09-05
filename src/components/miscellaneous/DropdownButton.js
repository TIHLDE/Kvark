import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
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
import Paper from '../layout/Paper';

const styles = (theme) => ({
  root: {
    width: 'auto',
    marginLeft: 10,
  },
  list: {
    minWidth: 125,
  },
  popper: {
    zIndex: 10,
  },
});

function DropdownButton(props) {
  const { classes, options } = props;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMenuItemClick = (e, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
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

DropdownButton.propTypes = {
  classes: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      func: PropTypes.func,
    }).isRequired,
  ),
};

export default withStyles(styles)(DropdownButton);
