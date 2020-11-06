import React, { useEffect, useState, useContext, useCallback, useMemo, createContext, ReactNode } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import MaterialSnackbar from '@material-ui/core/Snackbar';
import MaterialAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) => ({
  snackbar: {
    [theme.breakpoints.down('sm')]: {
      left: theme.spacing(1),
      right: theme.spacing(1),
      bottom: theme.spacing(1),
      transform: 'none',
    },
  },
}));

type Severity = 'error' | 'warning' | 'info' | 'success';
type SnackbarProps = (title: string, severity: Severity, length?: number) => void;
type Snack = {
  title: string;
  severity: Severity;
  length?: number;
};
const SnackbarContext = createContext<SnackbarProps | undefined>(undefined);

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackTitle, setSnackTitle] = useState('');
  const [severity, setSeverity] = useState<Severity>('info');
  const [length, setLength] = useState<number | undefined>(undefined);
  const [queue, setQueue] = useState<Array<Snack>>([]);

  const showSnackbar: SnackbarProps = useCallback((title, severity, length) => {
    const newSnack: Snack = { title: title, severity: severity, length: length };
    setQueue((prev) => [...prev, newSnack]);
  }, []);

  useEffect(() => {
    let timeout: number;
    const snack = queue[0];
    if (!snackbarOpen && snack) {
      timeout = window.setTimeout(() => {
        setSnackTitle(snack.title);
        setSeverity(snack.severity);
        setLength(snack.length);
        setSnackbarOpen(true);
        setQueue((prev) => prev.slice(1));
      }, 150);
    }
    return () => clearInterval(timeout);
  }, [queue, snackbarOpen]);

  const value = useMemo(() => showSnackbar, [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <MaterialSnackbar autoHideDuration={length || 6000} className={classes.snackbar} onClose={() => setSnackbarOpen(false)} open={snackbarOpen}>
        <MaterialAlert elevation={6} onClose={() => setSnackbarOpen(false)} severity={severity} variant='filled'>
          {snackTitle}
        </MaterialAlert>
      </MaterialSnackbar>
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export default useSnackbar;
export { SnackbarProvider, useSnackbar };
