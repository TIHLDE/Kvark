import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    colors: {
      background: {
        main: string;
        light: string;
        smoke: string;
      };
      border: {
        main: string;
      };
      header: {
        text: string;
      };
      footer: {
        main: string;
        text: string;
      };
      text: {
        main: string;
        light: string;
        lighter: string;
      };
      tihlde: {
        main: string;
        light: string;
      };
      gradient: {
        main: {
          top: string;
          bottom: string;
          text: string;
        };
        secondary: {
          top: string;
          bottom: string;
          text: string;
        };
        avatar: {
          top: string;
          bottom: string;
          text: string;
        };
        profile: {
          top: string;
          bottom: string;
          text: string;
        };
      };
      status: {
        green: string;
        red: string;
      };
      constant: {
        smoke: string;
        white: string;
        black: string;
      };
    };
    sizes: {
      border: {
        width: string;
      };
    };
  }

  interface PaletteOptions {
    colors?: {
      background: {
        main: string;
        light: string;
        smoke: string;
      };
      border: {
        main: string;
      };
      header: {
        text: string;
      };
      footer: {
        main: string;
        text: string;
      };
      text: {
        main: string;
        light: string;
        lighter: string;
      };
      tihlde: {
        main: string;
        light: string;
      };
      gradient: {
        main: {
          top: string;
          bottom: string;
          text: string;
        };
        secondary: {
          top: string;
          bottom: string;
          text: string;
        };
        avatar: {
          top: string;
          bottom: string;
          text: string;
        };
        profile: {
          top: string;
          bottom: string;
          text: string;
        };
      };
      status: {
        green: string;
        red: string;
      };
      constant: {
        smoke: string;
        white: string;
        black: string;
      };
    };
    sizes?: {
      border: {
        width: string;
      };
    };
  }
}

export const getTheme = (light: boolean) =>
  createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 400,
        md: 600,
        lg: 900,
        xl: 1200,
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      h1: {
        fontSize: '3.1rem',
      },
      h2: {
        fontSize: '2.2rem',
      },
      h3: {
        fontSize: '1.5rem',
      },
    },
    palette: {
      type: light ? 'light' : 'dark',
      primary: {
        main: light ? '#1D448C' : '#9ec0ff',
        contrastText: light ? '#ffffff' : '#000000',
      },
      secondary: {
        main: light ? '#748674' : '#daffda',
        contrastText: light ? '#ffffff' : '#000000',
      },
      error: {
        main: '#B71C1C',
        contrastText: '#ffffff',
      },
      colors: {
        background: {
          main: light ? '#f8f8fa' : '#121519',
          light: light ? '#ffffff' : '#131924',
          smoke: light ? '#fefefe' : '#13171E',
        },
        border: {
          main: light ? '#dddddd' : '#333333',
        },
        header: {
          text: '#ffffff',
        },
        footer: {
          main: '#1b1b2d',
          text: '#ffffff',
        },
        text: {
          main: light ? '#000000' : '#ffffff',
          light: light ? '#333333' : '#cccccc',
          lighter: light ? '#555555' : '#aaaaaa',
        },
        tihlde: {
          main: '#1D448C',
          light: '#E4E9F2',
        },
        gradient: {
          main: {
            top: light ? '#16356e' : '#1c2230',
            bottom: light ? '#814a93' : '#581d6c',
            text: light ? '#ffffff' : '#ffffff',
          },
          secondary: {
            top: light ? '#C6426E' : '#640d2a',
            bottom: light ? '#642B73' : '#321a38',
            text: light ? '#ffffff' : '#ffffff',
          },
          avatar: {
            top: '#DA4453',
            bottom: '#89216B',
            text: '#ffffff',
          },
          profile: {
            top: light ? '#F0C27B' : '#9b702e',
            bottom: light ? '#4B1248' : '#280126',
            text: light ? '#ffffff' : '#ffffff',
          },
        },
        status: {
          green: '#0b7c0b',
          red: light ? '#b20101' : '#ff6060',
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
        },
      },
    },
  });

export const errorTheme = createMuiTheme({
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
