import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: '#1D448C',
        dark: '#183770',
        contrastText: 'white',
      },
      secondary: {
        main: '#748674', // '#00897B',
        contrastText: 'white',
      },
      error: {
        main: '#B71C1C',
        contrastText: 'white',
      },
    },
});

export const errorTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#B71C1C',
        contrastText: 'white',
      },
      secondary: {
        main: '#009688',
        contrastText: 'white',
      },
    },
});

