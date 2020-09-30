import React from 'react';
import classNames from 'classnames';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
    boxShadow: '0px 2px 4px ' + theme.palette.colors.border.main + '88',
    backgroundColor: theme.palette.colors.background.light,
  },
  fullWidth: {
    width: '100%',
  },
}));

export type PageinationProps = {
  fullWidth?: boolean;
  children?: React.ReactNode;
  nextPage: () => void;
  page?: string | number;
};

const Pageination = ({ children, fullWidth, nextPage, page }: PageinationProps) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div>{children}</div>
      {page && (
        <ButtonBase className={fullWidth ? classNames(classes.button, classes.fullWidth) : classes.button} onClick={nextPage}>
          <Typography align='center'>Vis flere elementer</Typography>
        </ButtonBase>
      )}
    </React.Fragment>
  );
};

export default Pageination;
