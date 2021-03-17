//import params from './config';

const url = 'https://api.spotify.com/v1/';
const redirect_uri = encodeURIComponent(cfgparams.redirectUri);
const authorize_header = `https://accounts.spotify.com/authorize?client_id=${cfgparams.clientID}&response_type=token&redirect_uri=${redirect_uri}&scope=user-library-read`;
console.log(redirect_uri);
let accessToken = '';

if (!window.location.hash) {
    window.location.href = authorize_header;
} else {
    const params = new URLSearchParams(String(window.location.hash.substring(1)));
    window.location.hash = '';
    accessToken = params.get('access_token');
    getData();
}

async function getData () {
    let requestUrl = url + 'me/albums?limit=50';
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    let first = true;
    let artists = [];

    let tracksResponse = await httpsRequest(url + 'me/tracks?limit=1', requestOptions);

    while(requestUrl) {
        const response = await httpsRequest(requestUrl, requestOptions);

        if(first) {
            first = false;
            document.querySelector("#information").innerHTML = `You have ${response.total} albums and ${tracksResponse.total} songs saved`;
        }

        for(let i=0; i<response.items.length; i++) {
            artists = artists.concat(response.items[i].album.artists);
        }

        requestUrl = response.next;
    }

    let artistSet = new Set();
    let genres = [];

    let i = 0;
    for(let i=0; i<artists.length;) {
        let artistIds = [];
        for(let j=0; j<50 && i<artists.length; j++) {
            artistSet.add(artists[i].name);
            artistIds.push(artists[i].id);
            i++;
        }
        let artistResponse = await httpsRequest(url + 'artists?ids=' + artistIds.join(), requestOptions);
        for(let i=0; i<artistResponse.artists.length; i++) {
            genres = genres.concat(artistResponse.artists[i].genres);
        }
    }

    document.querySelector("#artist-amt").innerText = `You have saved albums from ${artistSet.size} different artists`;

    genres.sort();
    let genresTop = [];

    let amt = 1;
    for(let i=1; i<genres.length; i++) {
        if(genres[i] === genres[i-1]) {
            amt++;
        } else {
            genresTop.push({
                amount: amt,
                name: genres[i-1]
            });
            amt = 1;
        }
    }

    genresTop.sort((a, b) => (a.amount > b.amount) ? -1 : ((b.amount > a.amount) ? 1 : 0));

    document.querySelector("#genre-information").innerText = 'Your favorite genres and how many albums of them you have:'

    for(let i=0; i<genresTop.length; i++) {
        document.querySelector("#genre-list").innerHTML += `<li>${genresTop[i].amount} albums of ${genresTop[i].name}</li>`;
    }
}

async function httpsRequest (requestUrl, requestOptions) { 
    try {
        const response = await fetch(requestUrl, requestOptions);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            console.log('Network error');
        }
    } catch (err) {
        console.log(requestUrl);
        console.log(err.message);
        console.log(requestUrl);
    }
}
