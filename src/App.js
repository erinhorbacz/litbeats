import { useState, useEffect } from 'react';

import Navbar from "./components/Navbar.js";
import FakeLanding from "./components/FakeLanding.js";
import Home from "./pages/Home"
import About from "./pages/About.js";

import { Typography, Box, Fade } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Route, Routes } from 'react-router-dom';
import { text } from 'd3-request';
import { csvParseRows } from 'd3';
import url from "./data/book_data.csv";

// Neon-green / yellow palette shared across the app.
const NEON = '#39FF14';
const LIME = '#B6FF2E';
const YELLOW = '#FFE600';
const TITLE_GRADIENT = `linear-gradient(92deg, ${NEON} 0%, ${LIME} 45%, ${YELLOW} 100%)`;

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 640, md: 960, lg: 1200, xl: 1536 },
  },
  palette: {
    mode: 'dark',
    primary: { main: NEON, contrastText: '#06130a' },
    secondary: { main: YELLOW, contrastText: '#1a1600' },
    background: { default: '#0A0B0A', paper: '#111311' },
    text: { primary: '#EAF7E6', secondary: '#93A98E' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.01em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 30, paddingBlock: 11, fontSize: '1rem' },
        containedPrimary: {
          background: `linear-gradient(90deg, ${NEON}, ${LIME})`,
          color: '#06130a',
          boxShadow: '0 0 0 1px rgba(57,255,20,0.35), 0 10px 34px -10px rgba(57,255,20,0.65)',
          transition: 'transform .15s ease, box-shadow .15s ease, background .15s ease',
          '&:hover': {
            background: `linear-gradient(90deg, #4dff2b, ${YELLOW})`,
            boxShadow: '0 0 0 1px rgba(57,255,20,0.55), 0 14px 44px -8px rgba(57,255,20,0.85)',
            transform: 'translateY(-2px)',
          },
          '&.Mui-disabled': {
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.32)',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(57,255,20,0.25)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(57,255,20,0.5)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: NEON,
            boxShadow: '0 0 0 3px rgba(57,255,20,0.15)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { '&.Mui-focused': { color: NEON } } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#121512',
          border: '1px solid rgba(57,255,20,0.18)',
        },
        option: {
          '&.Mui-focused': { backgroundColor: 'rgba(57,255,20,0.12) !important' },
          '&[aria-selected="true"]': { backgroundColor: 'rgba(57,255,20,0.18) !important' },
        },
      },
    },
  },
});

function App() {
  const [bookData, setBookData] = useState([]);
  const [appLoaded, setAppLoaded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [genreLoading, setGenreLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState({"default":"https://open.spotify.com/embed/playlist/0ZtNpjS6cTeLIa1KpQ4cpp"})
  const [genre, setGenre] = useState("default")

  useEffect(() => {
    text(url, function(data) {
      var mappedData = csvParseRows(data).map((entry) => entry[0]);
      mappedData = mappedData.filter(onlyUnique);

      setBookData(mappedData);
      setAppLoaded(true);
    })
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(1100px 560px at 50% -8%, rgba(57,255,20,0.12), transparent 60%),
          radial-gradient(900px 520px at 88% 6%, rgba(255,230,0,0.07), transparent 55%),
          #0A0B0A`,
      }}>
        <Box sx={{ display: appLoaded ? "none" : "block" }}>
          <FakeLanding />
        </Box>

        <Fade in={appLoaded} timeout={{ enter: 1200 }}>
          <Box sx={{ display: appLoaded ? "block" : "none" }}>
            <Navbar titleGradient={TITLE_GRADIENT} />

            <Box sx={{ textAlign: 'center', pt: { xs: 5, md: 7 }, pb: { xs: 3, md: 4 }, px: 2 }}>
              <Typography component="h1" sx={{
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                fontSize: { xs: '3.4rem', sm: '5rem', md: '6.5rem' },
                background: TITLE_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 26px rgba(57,255,20,0.35))',
              }}>
                LitBeats
              </Typography>
              <Typography sx={{
                mt: 1.5,
                color: 'text.secondary',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontSize: { xs: '0.68rem', sm: '0.82rem' },
              }}>
                Beats for what you read
              </Typography>
            </Box>

            <Routes>
              <Route path="/" element={
                <Home
                  bookData = {bookData}
                  loading = {loading}
                  setLoading = {setLoading}
                  resultsLoaded = {resultsLoaded}
                  setResultsLoaded = {setResultsLoaded}
                  genreLoading = {genreLoading}
                  setGenreLoading = {setGenreLoading}
                  playlistData = {playlistData}
                  setPlaylistData = {setPlaylistData}
                  genre = {genre}
                  setGenre = {setGenre}
                />
              } />
              <Route path="/About" element={<About />} />
            </Routes>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}

export default App;
