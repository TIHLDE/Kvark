import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        // main: '#1D448C',
        main: '#ef2b2d',
        // dark: '#183770',
        dark: '#cc2526',

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

