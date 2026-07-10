# Setting up project locally:

## Env file

Create an env file simply called ".env" in root that looks like this:

```
REACT_APP_USER_ID = ""
REACT_APP_TOKEN_ENDPOINT = "http://localhost:8787/token"
```

`REACT_APP_USER_ID` is the Spotify user ID of the account that owns the playlists. No secrets go
in this file — everything in it is baked into the public JS bundle at build time.

## Token service (holds the secrets)

The Spotify client secret and refresh token live in a small Cloudflare Worker under `worker/`,
never in the frontend. The frontend asks it for a short-lived access token via `GET /token`.

All worker commands are npm scripts (run from the repo root) so you don't have to remember wrangler
flags. `wrangler` itself is a devDependency, so `npm install` sets everything up.

Local development:

1. Create `worker/.dev.vars` (gitignored) with:
   ```
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   SPOTIFY_REFRESH_TOKEN=...
   ```
   (Get the client ID/secret from the Spotify developer dashboard. To mint a refresh token, follow
   the authorization-code flow described in the "Spotify API" section below — note the redirect URI
   must be `http://127.0.0.1:PORT/...`, Spotify no longer accepts `localhost` or plain-HTTP URLs.)
2. `npm run worker:dev` — runs the token service locally on port 8787 (matches `.env`). Keep it
   running in one terminal while `npm start` runs the frontend in another.

Deploying the worker (one-time setup, then repeat step 3 whenever you change `worker/index.js`):

1. `npm run worker:login` — connect wrangler to your Cloudflare account (once per machine).
2. `npm run worker:secrets` — uploads the three secrets to Cloudflare (prompts for each value; once,
   or again whenever a secret changes). These are stored encrypted and never live in the repo.
3. `npm run worker:deploy` — uploads `worker/index.js`. The first deploy prints your worker URL; put
   it (plus the `/token` path) into `.env.production`.
4. Make sure `ALLOWED_ORIGINS` in `worker/wrangler.toml` includes your GitHub Pages origin.

Then `npm run build && npm run deploy` publishes the frontend (`npm run deploy` = the gh-pages step;
`npm run worker:deploy` is the separate Cloudflare step — don't confuse the two).

## Include data files
Mkdir data under src and add book_data.csv (books_ix) as well as data_0.json, data_3300.json, data_6600.json, data_9900.json, data_13200.json.

https://drive.google.com/file/d/1BSiY4vjxmMhCEU3KkLRfEqskoiInYG8_/view?usp=sharing

For research (not needed for software dev, only used to construct the json files), you'll need books_ix.csv, combinedMusicData_small, H_rank100.pt, W_rank100.pt.

https://drive.google.com/file/d/1JrFoQUnzIGA9BRYdhsWnlfgMGopDDYOM/view?usp=sharing

# Data

So yeah, the biggest change from the original project was how data is handled.

In the original project, you would get the similarity scores on the fly by getting the index of the book selected and reconstructing the W x H matrix and getting top 1000 results and filtering your output to 15 results per genre.

So basically, in a jupyter notebook (can find under the research folder), I just ran that code but for every index in the book dataset. All ~16500 entries. However, they outputted to not even triple digits megabytes total, so not bad.

The json file structure is a list of dictionaries. The keys include name and genre. Values under name is simply name of the booko, genre is a list of uri's for the playlist.

Now, whenever you query a book, you get the index of where it is in the book list, go to the correct json file based on the index value (data0 = indices 0 - 3300), then get the data. To be honest, splitting up the json files doesn't really matter for ~16500 books, but I figured this would be good practice in the scenario I don't have a database server.

Now yes, I don't have full confirmation that the book dataset indices are the exact same as the json file indices. I haven't found any problems with this just yet, but there's a 99% chance that they're based off of the same file originally, so there's nothing to worry about. 

# Spotify API

Spotify has two authorization flows that apply to the project. 

* First is client side. You simply make a post request with client id and secret and get a token that lasts for an hour. You can use this token to get very basic information. This is good enough for checking the Litbeats playlists, but that's all. I abandoned this later, but for future projects where you only need to view data, this will suffice.

* Second is authorization code. You can follow a spotify link which will take you to a log in page (if you're incognito) to log in. If you've logged into spotify before on your browser, it will let you log in for the app's purposes. The link looks like this:

```
https://accounts.spotify.com/authorize?client_id=""&response_type=code&redirect_uri=""&scope=playlist-modify-public
```

The scope depends on what you want to do with the account. The redirect uri must be registered in your spotify api dashboard in order for this to work. Hypothetically, if your app really was all about letting users log in to do stuff, the redirect uri would be used to take the user back to your app after they're done logging in (localhost usually, but in a production build, the domain name).

Once you hit the link and are logged in, the redirect uri's url in your browser will have the authorization code (not sure how you would programatically get this information, but not relevant for this project). You can then put in the authorization code into a post request similar to the client side post request and get a regular token and a refresh token.

The refresh token seemingly lasts forever (according to a dev, you can think of it as forever) and lets you create new temporary 60 min tokens off it to do stuff with the authorized account. 

As you may imagine, what I did was manually put in my information into the above link, get the code, then made a post request to get the refresh token. Now, whenever the user inputs a book, we get a new token off the refresh token to do stuff.