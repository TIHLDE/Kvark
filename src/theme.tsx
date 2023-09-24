import DarkIcon from '@mui/icons-material/Brightness2Outlined';
import AutomaticIcon from '@mui/icons-material/DevicesOutlined';
import LightIcon from '@mui/icons-material/WbSunnyOutlined';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    smoke: React.CSSProperties['backgroundColor'];
  }

  interface Palette {
    borderWidth: string;
    get: <T>({ light, dark }: { light: T; dark: T }) => T;
    blurred: {
      backdropFilter: string;
      WebkitBackdropFilter: string;
    };
    transparent: {
      boxShadow: string;
      border: string;
      background: string;
    };
    colors: {
      footer: string;
      tihlde: string;
      nok_event: string;
      other_event: string;
      payment_order: {
        initiate: string;
        reserve: string;
        capture: string;
        refund: string;
        cancel: string;
        sale: string;
        void: string;
      };
      gradient: {
        main: {
          top: string;
          bottom: string;
        };
        secondary: {
          top: string;
          bottom: string;
        };
        profile: {
          top: string;
          bottom: string;
        };
      };
    };
  }

  interface PaletteOptions {
    borderWidth: string;
    get: <T>({ light, dark }: { light: T; dark: T }) => T;
    blurred: {
      backdropFilter: string;
      WebkitBackdropFilter: string;
    };
    transparent: {
      boxShadow: string;
      border: string;
      background: string;
    };
    colors: {
      footer: string;
      tihlde: string;
      nok_event: string;
      other_event: string;
      payment_order: {
        initiate: string;
        reserve: string;
        capture: string;
        refund: string;
        cancel: string;
        sale: string;
        void: string;
      };
      gradient: {
        main: {
          top: string;
          bottom: string;
        };
        secondary: {
          top: string;
          bottom: string;
        };
        profile: {
          top: string;
          bottom: string;
        };
      };
    };
  }
}

export const themesDetails = [
  { key: 'light', name: 'Lyst', icon: LightIcon },
  { key: 'automatic', name: 'Automatisk', icon: AutomaticIcon },
  { key: 'dark', name: 'Mørkt', icon: DarkIcon },
] as const;
export const themes = themesDetails.map((theme) => theme.key);
export type ThemeTypes = typeof themes[number];

export const getTheme = (theme: ThemeTypes, prefersDarkMode: boolean) => {
  const get = <T extends unknown>({ light, dark }: { light: T; dark: T }): T => {
    switch (theme) {
      case 'automatic':
        return prefersDarkMode ? dark : light;
      case 'dark':
        return dark;
      default:
        return light;
    }
  };

  const DARK_PAPER_COLOR = '#011830';
  const BORDER_RADIUS = 16;

  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 400,
        md: 600,
        lg: 900,
        xl: 1200,
      },
    },
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: '#b4345e',
            color: 'white',
            fontWeight: 'bold',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            html: { WebkitFontSmoothing: 'auto' },
          },
          a: { color: get<string>({ light: '#1D448C', dark: '#9ec0ff' }) },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { height: 44 },
          contained: {
            boxShadow: 'none',
            fontWeight: get<'bold' | undefined>({ light: undefined, dark: 'bold' }),
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiDialog: { styleOverrides: { paper: { backgroundImage: 'none' } } },
      MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none' } } },
      MuiSkeleton: {
        styleOverrides: {
          root: { maxWidth: '100%' },
          rectangular: { borderRadius: BORDER_RADIUS },
        },
      },
      MuiTooltip: { styleOverrides: { tooltip: { fontSize: '0.85rem' } } },
      MuiContainer: { defaultProps: { maxWidth: 'xl', disableGutters: true } },
      MuiPaper: { defaultProps: { elevation: 0 } },
      MuiLinearProgress: { styleOverrides: { root: { borderRadius: BORDER_RADIUS } } },
      MuiListItemText: { styleOverrides: { secondary: { whiteSpace: 'break-spaces' } } },
    },
    palette: {
      get,
      common: {
        black: '#000000',
        white: '#ffffff',
      },
      mode: get<'light' | 'dark'>({ light: 'light', dark: 'dark' }),
      primary: {
        main: get<string>({ light: '#1D448C', dark: '#9ec0ff' }),
      },
      secondary: {
        main: get<string>({ light: '#748674', dark: '#daffda' }),
      },
      error: {
        main: get<string>({ light: '#b20101', dark: '#ff6060' }),
      },
      divider: get<string>({ light: '#e4e4e4', dark: '#132f4c' }),
      text: {
        secondary: get<string>({ light: '#333333', dark: '#cccccc' }),
      },
      blurred: {
        backdropFilter: `blur(5px)`,
        WebkitBackdropFilter: `blur(5px)`,
      },
      transparent: {
        background: get<string>({ light: '#f6f5f380', dark: '#61616180' }),
        border: get<string>({ light: '1px solid #d7d7d75c', dark: '1px solid #4545453b' }),
        boxShadow: `0 8px 32px 0 ${get<string>({ light: '#cab2e7', dark: '#26292d' })}52`,
      },
      borderWidth: '1px',
      background: {
        default: get<string>({ light: '#eeeeee', dark: '#001328' }),
        paper: get<string>({ light: '#ffffff', dark: DARK_PAPER_COLOR }),
        smoke: get<string>({ light: '#f2f2f2', dark: '#071a2d' }),
      },
      colors: {
        footer: DARK_PAPER_COLOR,
        tihlde: '#1c458a',
        nok_event: get<string>({ light: '#83C4F8', dark: '#83C4F8' }),
        other_event: get<string>({ light: '#FFA675', dark: '#FFA675' }),
        payment_order: {
          initiate: get<string>({ light: '#FFA675', dark: '#FFA675' }),
          reserve: get<string>({ light: '#388e3c', dark: '#388e3c' }),
          capture: get<string>({ light: '#83C4F8', dark: '#83C4F8' }),
          refund: get<string>({ light: '#FFA675', dark: '#FFA675' }),
          cancel: get<string>({ light: '#b20101', dark: '#ff6060' }),
          sale: get<string>({ light: '#388e3c', dark: '#388e3c' }),
          void: get<string>({ light: '#83C4F8', dark: '#83C4F8' }),
        },
        gradient: {
          main: {
            top: get<string>({ light: '#16356e', dark: '#0d2339' }),
            bottom: get<string>({ light: '#814a93', dark: '#581d6c' }),
          },
          secondary: {
            top: get<string>({ light: '#C6426E', dark: '#640d2a' }),
            bottom: get<string>({ light: '#642B73', dark: '#321a38' }),
          },
          profile: {
            top: get<string>({ light: '#F0C27B', dark: '#9b702e' }),
            bottom: get<string>({ light: '#4B1248', dark: '#280126' }),
          },
        },
      },
    },
    shape: {
      borderRadius: BORDER_RADIUS,
    },
    typography: {
      fontFamily: 'Inter',
      h1: {
        fontSize: '3rem',
        fontFamily: `Oswald, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontFamily: `Oswald, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.5rem',
        fontFamily: `Cabin, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
      },
    },
  });
};
