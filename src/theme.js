import {createMuiTheme} from '@material-ui/core/styles';

export const lightTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#1D448C',
      dark: '#183770',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#748674',
      contrastText: '#ffffff',
    },
    error: {
      main: '#B71C1C',
      contrastText: '#ffffff',
    },
    type: 'light',
  },
  colors: {
    background: {
      main: '#f8f8fa',
      light: '#ffffff',
      smoke: '#fefefe',
    },
    border: {
      main: '#dddddd',
    },
    header: {
      text: '#ffffff',
    },
    footer: {
      main: '#1b1b2d',
      text: '#ffffff',
    },
    text: {
      main: '#000000',
      light: '#333333',
      lighter: '#555555',
    },
    tihlde: {
      main: '#1D448C',
      light: '#E4E9F2',
    },
    gradient: {
      main: {
        top: '#16356e',
        bottom: '#814a93',
        text: '#ffffff',
      },
      secondary: {
        top: '#C6426E',
        bottom: '#642B73',
        text: '#ffffff',
      },
      avatar: {
        top: '#DA4453',
        bottom: '#89216B',
        text: '#ffffff',
      },
      profile: {
        top: '#F0C27B',
        bottom: '#4B1248',
        text: '#ffffff',
      },
    },
    status: {
      green: '#0b7c0b',
      red: '#b20101', // Bruke samme som palette.error.main ?
    },
    constant: {
      smoke: '#fefefe',
      white: '#ffffff',
      black: '#000000',
    },
  },
  sizes: {
    border: {
      width: '1px',
      radius: 5,
    },
  },
});
export const darkTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#9ec0ff',
      contrastText: '#000000',
    },
    secondary: {
      main: '#daffda',
      contrastText: '#000000',
    },
    error: {
      main: '#B71C1C',
      contrastText: '#ffffff',
    },
    type: 'dark',
  },
  colors: {
    background: {
      main: '#121519',
      light: '#131924',
      smoke: '#13171E',
    },
    border: {
      main: '#333333',
    },
    header: {
      text: '#ffffff',
    },
    footer: {
      main: '#1b1b2d',
      text: '#ffffff',
    },
    text: {
      main: '#ffffff',
      light: '#cccccc',
      lighter: '#aaaaaa',
    },
    tihlde: {
      main: '#1D448C',
      light: '#E4E9F2',
    },
    gradient: {
      main: {
        top: '#1c2230',
        bottom: '#581d6c',
        text: '#ffffff',
      },
      secondary: {
        top: '#640d2a',
        bottom: '#321a38',
        text: '#ffffff',
      },
      avatar: {
        top: '#DA4453',
        bottom: '#89216B',
        text: '#ffffff',
      },
      profile: {
        top: '#9b702e',
        bottom: '#280126',
        text: '#ffffff',
      },
    },
    status: {
      green: '#0b7c0b',
      red: '#b20101', // Bruke samme som palette.error.main ?
    },
    constant: {
      smoke: '#fefefe',
      white: '#ffffff',
      black: '#000000',
    },
  },
  sizes: {
    border: {
      width: '1px',
      radius: 5,
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

