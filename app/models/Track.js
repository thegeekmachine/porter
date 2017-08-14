'use strict';

function Track(id) {

    const id = id;
    let title = "";
    let artist = ""; // name or Artist?
}

// Represents a track obtained from a supported service

function ServiceTrack() {

    let service = "spotify";
    let track = Track();
    let uri = "http://"; // permalink
}

// [track_id, title, artist_id] [service_id, track_id ... (uri)] Relational Model
// [track_id, title, artist_id] [service_id, url]... Columnar Model
// {"track": {...}, "services": [{...}...]} Document Model
