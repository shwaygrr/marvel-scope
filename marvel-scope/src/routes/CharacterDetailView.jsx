import CharacterDetail from "../components/CharacterDetail";
import { ThemeProvider, createTheme } from '@mui/material';
import '../App.css'


export default function CharacterDetailView() {
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#EC1D24',
      },
      secondary: {
        main: '#000000',
      },
      text: {
        primary: '#ccc',
        secondary: 'black'
      }
    },
    typography: {
      fontFamily: [
        'Roboto',
        'Open Sans',
        'sans-serif',
      ].join(','),
      fontSize: 18
    },
  });

    return (
      <ThemeProvider theme={theme}>
        <CharacterDetail />
      </ThemeProvider>
    );
};