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

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 960,
        lg: 1200,
        xl: 1536,
      },
    },
  });

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box sx = {{display: appLoaded ? "none" : "block"}}>
        <FakeLanding />
      </Box>

      <Fade in = {appLoaded} timeout={{ enter: 1500 }}>
        <Box sx = {{
          display: appLoaded ? "block" : "none",
        }}>
          <Navbar/>

          <Typography align = "center"  sx={{p: 3, typography: { md: 'h1', sm: 'h2', xs: 'h3' } }}>
            From Books to Nooks
          </Typography>

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
    </ThemeProvider>
  );
}

export default App;