import { darkScrollbar } from '@material-ui/core';
import { createTheme, Theme } from '@material-ui/core/styles';

// Icons
import DarkIcon from '@material-ui/icons/Brightness2Outlined';
import AutomaticIcon from '@material-ui/icons/DevicesOutlined';
import LightIcon from '@material-ui/icons/WbSunnyOutlined';

declare module '@material-ui/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    smoke: React.CSSProperties['backgroundColor'];
  }

  interface Palette {
    borderWidth: string;
    get: <T>({ light, dark }: { light: T; dark: T }) => T;
    blurred: {
      backdropFilter: string;
      '-webkit-backdrop-filter': string;
    };
    transparent: {
      boxShadow: string;
      border: string;
      background: string;
    };
    colors: {
      footer: string;
      tihlde: string;
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
      '-webkit-backdrop-filter': string;
    };
    transparent: {
      boxShadow: string;
      border: string;
      background: string;
    };
    colors: {
      footer: string;
      tihlde: string;
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
  // eslint-disable-next-line comma-spacing
  const get = <T,>({ light, dark }: { light: T; dark: T }): T => {
    switch (theme) {
      case 'automatic':
        return prefersDarkMode ? dark : light;
      case 'dark':
        return dark;
      default:
        return light;
    }
  };

  const createdTheme = createTheme({
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
          body: {
            // eslint-disable-next-line @typescript-eslint/ban-types
            ...get<object>({ light: {}, dark: darkScrollbar() }),
          },
          '@global': {
            html: {
              WebkitFontSmoothing: 'auto',
            },
          },
          a: {
            color: get<string>({ light: '#1D448C', dark: '#9ec0ff' }),
          },
        },
      },
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
      divider: get<string>({ light: '#cccccc', dark: '#333333' }),
      text: {
        secondary: get<string>({ light: '#333333', dark: '#cccccc' }),
      },
      blurred: {
        backdropFilter: `blur(5px)`,
        '-webkit-backdrop-filter': `blur(5px)`,
      },
      transparent: {
        background: get<string>({ light: '#f6f5f380', dark: '#61616180' }),
        border: get<string>({ light: '1px solid #d7d7d75c', dark: '1px solid #4545453b' }),
        boxShadow: `0 8px 32px 0 ${get<string>({ light: '#cab2e7', dark: '#26292d' })}52`,
      },
      borderWidth: '1px',
      background: {
        default: get<string>({ light: '#f8f8fa', dark: '#121519' }),
        paper: get<string>({ light: '#ffffff', dark: '#131924' }),
        smoke: get<string>({ light: '#fefefe', dark: '#13171E' }),
      },
      colors: {
        footer: '#1b1b2d',
        tihlde: '#1c458a',
        gradient: {
          main: {
            top: get<string>({ light: '#16356e', dark: '#1c2230' }),
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
      borderRadius: 8,
    },
    typography: {
      h1: {
        fontSize: '3rem',
        fontFamily: 'Oswald, Roboto, sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontFamily: 'Oswald, Roboto, sans-serif',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.5rem',
        fontFamily: 'Cabin, Roboto, sans-serif',
      },
    },
  });
  createdTheme.shape.borderRadius = 8;
  return createdTheme;
};
