import React from 'react';
import classNames from 'classnames';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  fullWidth: {
    width: '100%',
  },
}));

export type PageinationProps = {
  fullWidth?: boolean;
  children?: React.ReactNode;
  nextPage: () => void;
  page?: string | number | null;
};

const Pageination = ({ children, fullWidth, nextPage, page }: PageinationProps) => {
  const classes = useStyles();
  return (
    <>
      <div>{children}</div>
      {page && (
        <Button className={classNames(classes.button, fullWidth && classes.fullWidth)} onClick={nextPage} variant='outlined'>
          Vis flere elementer
        </Button>
      )}
    </>
  );
};

export default Pageination;
