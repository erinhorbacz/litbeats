import { useState } from 'react';

import HandleClick from '../components/HandleClick.js';

import { Typography, Autocomplete, TextField, Button, Box, Skeleton, Fade, styled } from '@mui/material';

const MuiIFrame = styled("iframe")({});

function Home({bookData, loading, setLoading, resultsLoaded, setResultsLoaded, genreLoading, setGenreLoading, playlistData, setPlaylistData, genre, setGenre}) {
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const [cantConnect, setCantConnect] = useState(false);

    async function btnClick(){
        setCantConnect(false);
        const idx = bookData.indexOf(inputValue);
        var hc = await HandleClick(idx, setLoading, setResultsLoaded, setPlaylistData);
        if(hc === -1){
            // Handle spotify api error
            setLoading(false);
            setCantConnect(true);
        }
    }

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    return (
        <Fade in = {true} timeout={{ enter: 1500 }}>
            <Box sx = {{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                px: 2,
                pb: 16
            }}>
                {/* Search */}
                <Box sx = {{
                    width: { md: 760, sm: 560, xs: 340 },
                    maxWidth: "94vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2.5
                }}>
                    <Typography sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        textAlign: "center"
                    }}>
                        Pick a book — get a personalized soundtrack.
                    </Typography>

                    <Autocomplete
                        disableClearable
                        open={open}
                        onClose={() => setOpen(false)}
                        onChange={(event, value) => {
                            setInputValue(value);
                            setDisabledBtn(false);
                        }}
                        onInputChange={(event, value) => {
                            if (value.length > 2) {
                                setOpen(true);
                            } else {
                                setOpen(false);
                            }
                        }}
                        options={bookData}
                        sx={{ width: "100%" }}
                        renderInput={(params) => <TextField {...params} label="Enter a book title" variant="outlined" />}
                    />

                    <Button
                        variant="contained"
                        disabled={disabledBtn || inputValue === null}
                        onClick={btnClick}
                        sx={{ mt: 0.5, width: { xs: "100%", sm: "auto" } }}
                    >
                        Generate Playlist
                    </Button>
                </Box>

                <Fade in = {cantConnect} timeout={{ enter: 1200 }}>
                    <Box sx={{
                        display: cantConnect ? "block" : "none",
                        width: { md: 700, sm: 500, xs: 340 },
                        maxWidth: "94vw",
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid rgba(255,230,0,0.4)",
                        backgroundColor: "rgba(255,230,0,0.06)"
                    }}>
                        <Typography variant="body1" align="center" sx={{ color: "secondary.main", fontWeight: 600 }}>
                            Couldn't reach Spotify right now. Give it a moment and try again.
                        </Typography>
                    </Box>
                </Fade>

                <Fade in = {resultsLoaded} timeout={{ enter: 1500 }}>
                    <Box sx = {{
                        display: resultsLoaded ? "flex" : "none",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3
                    }}>
                        <Fade in = {loading || genreLoading} timeout={{ enter: 1500 }}>
                            <Skeleton
                                variant="rounded"
                                sx = {{
                                    display: loading || genreLoading ? "block" : "none",
                                    borderRadius: 4,
                                    height: 400,
                                    width: {md: 700, sm: 500, xs: 300},
                                    bgcolor: "rgba(57,255,20,0.07)"
                                }}
                            />
                        </Fade>

                        <Fade in = {!loading && !genreLoading} timeout={{ enter: 1500 }}>
                            <MuiIFrame
                                title = "myFrame"
                                id="spotifyPlaylist"
                                src= {playlistData[genre]}
                                frameBorder="0"
                                allowtransparency="true"
                                sx = {{
                                    width: {md: 700, sm: 500, xs: 300},
                                    height: 400,
                                    borderRadius: 16,
                                    border: "1px solid rgba(57,255,20,0.22)",
                                    boxShadow: "0 0 70px -22px rgba(57,255,20,0.5)",
                                    display: !loading && !genreLoading ? "block" : "none"
                            }}/>
                        </Fade>

                        <Fade in = {!loading} timeout={{ enter: 1500 }}>
                            <Box sx = {{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2
                            }}>
                                <Typography variant = "h6" sx={{ color: "text.primary" }}>
                                    Don't like what you see?
                                </Typography>

                                <Autocomplete
                                    disableClearable
                                    options={Object.keys(playlistData).map((entry) => {
                                        return entry.charAt(0).toUpperCase() + entry.slice(1)
                                    })}
                                    onChange={async (event, value) => {
                                        setGenreLoading(true);
                                        setGenre(value.toLowerCase());
                                        await timeout(750);
                                        setGenreLoading(false);
                                    }}
                                    value = {genre.charAt(0).toUpperCase() + genre.slice(1)}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Select your favorite genre" />}
                                />
                            </Box>
                        </Fade>
                    </Box>
                </Fade>
            </Box>
        </Fade>
    );
}

export default Home;
