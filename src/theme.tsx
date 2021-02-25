import { createMuiTheme } from '@material-ui/core/styles';

// Icons
import DarkIcon from '@material-ui/icons/Brightness2Outlined';
import AutomaticIcon from '@material-ui/icons/DevicesOutlined';
import LightIcon from '@material-ui/icons/WbSunnyOutlined';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    smoke: React.CSSProperties['backgroundColor'];
  }

  interface Palette {
    borderWidth: string;
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
  { key: 'ctf', name: 'CTF', icon: EmojiFlagsIcon },
] as const;
export const themes = themesDetails.map((theme) => theme.key);
export type ThemeTypes = typeof themes[number];

export const getTheme = (theme: ThemeTypes, prefersDarkMode: boolean) => {
  // eslint-disable-next-line comma-spacing
  const get = <T,>({ light, dark, ctf }: { light: T; dark: T; ctf: T }): T => {
    switch (theme) {
      case 'automatic':
        return prefersDarkMode ? dark : light;
      case 'dark':
        return dark;
      case 'ctf':
        return ctf;
      default:
        return light;
    }
  };

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 400,
        md: 600,
        lg: 900,
        xl: 1200,
      },
    },
    overrides: {
      MuiAvatar: {
        colorDefault: {
          backgroundColor: get<string>({ light: '#b4345e', dark: '#b4345e', ctf: '#000000' }),
          color: 'white',
          fontWeight: 'bold',
        },
      },
      MuiCssBaseline: {
        '@global': {
          html: {
            WebkitFontSmoothing: 'auto',
          },
          a: {
            color: get<string>({ light: '#1D448C', dark: '#9ec0ff', ctf: '#000000' }),
          },
        },
      },
    },
    palette: {
      common: {
        black: '#000000',
        white: get<string>({ light: '#ffffff', dark: '#ffffff', ctf: '#000000' }),
      },
      type: get<'light' | 'dark'>({ light: 'light', dark: 'dark', ctf: 'dark' }),
      primary: {
        main: get<string>({ light: '#1D448C', dark: '#9ec0ff', ctf: '#000000' }),
      },
      secondary: {
        main: get<string>({ light: '#748674', dark: '#daffda', ctf: '#000000' }),
      },
      error: {
        main: get<string>({ light: '#b20101', dark: '#ff6060', ctf: '#000000' }),
      },
      divider: get<string>({ light: '#dddddd', dark: '#333333', ctf: '#000000' }),
      text: {
        secondary: get<string>({ light: '#333333', dark: '#cccccc', ctf: '#000000' }),
      },
      borderWidth: '1px',
      background: {
        default: get<string>({ light: '#f8f8fa', dark: '#121519', ctf: '#000000' }),
        paper: get<string>({ light: '#ffffff', dark: '#131924', ctf: '#000000' }),
        smoke: get<string>({ light: '#fefefe', dark: '#13171E', ctf: '#000000' }),
      },
      colors: {
        footer: get<string>({ light: '#1b1b2d', dark: '#1b1b2d', ctf: '#000000' }),
        tihlde: get<string>({ light: '#1c458a', dark: '#1c458a', ctf: '#000000' }),
        gradient: {
          main: {
            top: get<string>({ light: '#16356e', dark: '#1c2230', ctf: '#000000' }),
            bottom: get<string>({ light: '#814a93', dark: '#581d6c', ctf: '#000000' }),
          },
          secondary: {
            top: get<string>({ light: '#C6426E', dark: '#640d2a', ctf: '#000000' }),
            bottom: get<string>({ light: '#642B73', dark: '#321a38', ctf: '#000000' }),
          },
          profile: {
            top: get<string>({ light: '#F0C27B', dark: '#9b702e', ctf: '#000000' }),
            bottom: get<string>({ light: '#4B1248', dark: '#280126', ctf: '#000000' }),
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      allVariants: {
        color: get<string>({ light: 'inherit', dark: 'white', ctf: '#000000' }),
      },
      h1: {
        fontSize: '3.1rem',
        fontFamily: 'Oswald, Roboto, sans-serif',
        fontWeight: 900,
      },
      h2: {
        fontSize: '2.2rem',
        fontFamily: 'Oswald, Roboto, sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontSize: '1.5rem',
      },
      h4: {
        fontSize: '2.2rem',
        fontFamily: 'Oswald, Roboto, sans-serif',
        fontWeight: 700,
      },
    },
  });
};
