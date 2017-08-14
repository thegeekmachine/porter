'use strict';

function User(id) {

    const id = id;
    let name;
    let authorizedAccounts = []; // UserAuthorizedService
    let playlists = []; // UserPlaylist
}

function UserAuthorizedService(id) {

    const id = id;
    let service;
    let refreshToken;
    let refreshedAt;
    let clientScopes;
    let clientSecret;
    let accessToken;
}

function UserPlaylist(id) {

    const id = id;
    let playlist;
    let service;
    let uri;
}