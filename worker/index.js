// Token service for Litbeats.
//
// This is the ONLY place the Spotify client secret and refresh token exist.
// The browser asks this service for a short-lived (1 hour) access token,
// and this service performs the secret-bearing exchange with Spotify.
//
// Secrets are provided as environment bindings (env.*):
//   - locally:        worker/.dev.vars (gitignored)
//   - in production:  `wrangler secret put <NAME>` (encrypted at Cloudflare)

// Cache the access token in this worker instance's memory so repeated
// clicks don't hit Spotify's token endpoint every time. Worker instances
// are ephemeral, so this is best-effort — a cache miss just means one
// extra exchange.
let cached = { token: null, expiresAt: 0 };

function corsHeaders(request, env) {
    // Only answer browsers running our own site (or local dev).
    // Note: this is politeness for browsers, not real access control —
    // anything outside a browser can ignore CORS entirely.
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim());
    const origin = request.headers.get("Origin") || "";
    return {
        "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

export default {
    async fetch(request, env) {
        const cors = corsHeaders(request, env);

        // Browsers send a "preflight" OPTIONS request before cross-origin
        // calls; it just needs the CORS headers back.
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: cors });
        }

        const url = new URL(request.url);
        if (url.pathname !== "/token") {
            return new Response("Not found", { status: 404, headers: cors });
        }

        // Serve from cache while the token still has 5+ minutes left.
        if (cached.token && Date.now() < cached.expiresAt - 5 * 60 * 1000) {
            return json({ access_token: cached.token }, cors);
        }

        const auth = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
        const res = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: "Basic " + auth,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: env.SPOTIFY_REFRESH_TOKEN,
            }),
        });

        if (!res.ok) {
            // Don't forward Spotify's raw error to the world; log it for us.
            console.log("spotify token exchange failed:", res.status, await res.text());
            return json({ error: "token_exchange_failed" }, cors, 502);
        }

        const data = await res.json();
        cached = {
            token: data.access_token,
            expiresAt: Date.now() + data.expires_in * 1000,
        };
        return json({ access_token: data.access_token }, cors);
    },
};

function json(body, cors, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
    });
}
