import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  root: {
    margin: 0,
    padding: 0,
  },
  palette: {
    primary: {
      light: '#004d8b',
      // main: '#256dab',
      main: '#126ebd',
      // dark: '#00437b',
      dark: '#29567b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#0088d9',
      main: '#007bc4',
      dark: '#0070b0',
      contrastText: '#fff',
    },
    accent: {
      dark: '#9C5C00',
      main: '#1fb2ef',
      light: '#FFD08B',
      contrastText: '#000',
    },
    error: {
      dark: '#A31616',
      main: '#f44336',
      light: '#FFC5C5',
      contrastText: '#fff ',
    },
    success: {
      dark: '#6fb300',
      main: '#6fb300',
      light: '#6fb300',
      contrastText: '#fff ',
    },

    // type: 'dark',
  },
  overrides: {
    MuiMenuItem: {
      // root: {
      //   '&$selected': {
      //     backgroundColor: '#07A6EA',
      //   },
      // },
    },
    MuiButton: {
      root: {
        fontSize: '1rem',
        borderRadius: 5,
        minHeight: 55,
      },
      contained: {
        backgroundColor: '#f9f9f9',
        color: 'rgb(130, 131, 132)',
      },
    },
    MuiStepIcon: {
      root: {
        // color: '#1abed2',
        '&$completed': {
          color: 'rgba(5, 170, 239, 0.61)',
          // height: '1.3em'
        },
        '&$active': {
          color: '#07A6EA',
        },
      },
    },
    MuiStepPositionIcon: {
      root: {
        color: 'rgba(92, 143, 165, 0.45)',
      },
    },
    MuiDialogContent: {
      root: {
        padding: 24,
      },
    },
    MuiModal: {
      hidden: {
        visibility: 'auto',
      },
    },
    MuiTypography: {
      root: {
        fontWeight: 200,
      },
      h6: {
        fontSize: '1.3rem',
        fontWeight: 300,
      },
      subtitle1: {
        // fontSize: '1.3rem',
        // fontWeight: 200,
      },
    },
    MuiInput: {
      underline: {
        '&:before': {
          // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
          content: '""',
        },
      },
    },

    MuiTab: {
      root: {
        height: 40,
      },
      labelContainer: {
        // fontSize: 11,
      },
      label: {
        fontSize: 11,
      },
    },
  },
});
