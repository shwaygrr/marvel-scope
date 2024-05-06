import { ThemeProvider, createTheme } from '@mui/material';
import '../App.css'

import ComicDetail from "../components/ComicDetail";

export default function ComicDetailView() {

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
        <ComicDetail />
      </ThemeProvider>
    );
};