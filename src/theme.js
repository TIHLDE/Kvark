import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        // main: '#1D448C',
        main: '#ffb200', // Easter
        // dark: '#183770',
        dark: '#e09d00', // Easter
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#748674', // '#00897B',
        contrastText: '#ffffff',
      },
      error: {
        main: '#B71C1C',
        contrastText: '#ffffff',
      },
    },
});

export const errorTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: '#B71C1C',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#009688',
        contrastText: '#ffffff',
      },
    },
});

