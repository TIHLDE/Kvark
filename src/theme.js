import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
      primary: {
        main: '#1D448C',
        dark: '#183770',
        contrastText: 'white',
      },
      secondary: {
        main: '#009688',
        contrastText: 'white',
      },
      error: {
        main: '#B71C1C',
        contrastText: 'white',
      },
    },
});
