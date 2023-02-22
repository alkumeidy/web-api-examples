// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment

const clientId = "4be8772969144edda280c23b29296580";  // Replace with your client id
const params = new URLSearchParams(window.location.hash.substring(1));
const code = params.get("access_token");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const profile = await fetchProfile(code);
    populateUI(profile);
    const tracks = await fetchTracks(code);
    populateTracks(tracks);
}

async function redirectToAuthCodeFlow(clientId: string) {
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "token");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email");

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function fetchProfile(code: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

async function fetchTracks(code: string): Promise<UserTracks> {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

function populateUI(profile: UserProfile) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("avatar")!.setAttribute("src", profile.images[0].url)
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0].url;
}

function populateTracks(profile: UserTracks) {
    document.getElementById("UserTracks")!.innerText = profile.json;
}

export { };
