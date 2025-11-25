import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#9a8cff',
      main: '#6C5CE7',
      dark: '#5136d6',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#6ef0ff',
      main: '#00C2FF',
      dark: '#00a0cc',
      contrastText: '#000000'
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff'
    },
    text: {
      primary: '#0b2545',
      secondary: '#5a6b84'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    h1: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.1 },
    h2: { fontWeight: 800, fontSize: '1.75rem' },
    h3: { fontWeight: 700, fontSize: '1.25rem' },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 18,
          paddingRight: 18
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(11,39,77,0.06)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(90deg, ${'#6C5CE7'} 0%, ${'#00C2FF'} 100%)`
        }
      }
    }
  }
});

export default theme;
