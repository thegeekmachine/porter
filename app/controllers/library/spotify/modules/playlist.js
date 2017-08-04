const request = require('request'),
      config = require('../../../../../config/spotify');

/**
 * Fetches songs from a playlist
 * _playistId : String (Required)
 * _userId    : String (Defaults to logged in user)
 */
const fetchPlaylistSongs = (_playistId, _userId) => {
  return new Promise((resolve, reject) => {
    let _error = {
      name: "fetchPlaylistSongs",
    };

    if(!_playistId) {
      _error.msg = "input data invalid";
      reject(_error);
    }

    if(!config.accToken) {
      _error.msg = "access_token is null";
      reject(_error);
    }

    const userId = _userId ? _userId : config.user_info.id;
    const url = config.base_uri + "/v1/users/" + userId + "/playlists/" +
      _playistId + "/tracks";

    const options = {
      url: url,
      headers: { 'Authorization': 'Bearer ' + config.accToken },
      json: true,
    };

    request.get(options, function(error, response, songs) {
      if(error) {
        _error.msg = "error fetching songs of " + _playistId;
        _error.stack = error;
        reject(_error);
      }
      resolve(songs, response);
    });
  });
};

/**
 * Fetches playist of userId or currently logged in user
 * _userId: String
 */
const fetchPlaylists = (_userId) => {
  return new Promise((resolve, reject) => {
    let _error = {
      name: "fetchPlaylists",
    }
    const name = fetchPlaylists;
    if(!config.accToken) {
      _error.msg = "access_token is null";
      reject(_error);
    }

    const userId = _userId ? _userId : config.user_info.id;
    const url = config.base_uri + '/v1/users/' + userId + '/playlists';

    const options = {
      url: url,
      headers: { 'Authorization': 'Bearer ' + config.accToken },
      json: true
    };

    request.get(options, function(err, response, playlists) {
      if(err) {
        _error.msg = "error fetching playlists";
        _error.trace = err;
        reject(_error);
      }
      resolve(playlists, response);
    });
  });
};

/**
 * newPlaylist properties
 * name        : String (Required)
 * description : String
 * public      : Boolean
 */
const createPlaylist = (_newPlaylist) => {
  return new Promise((resolve, reject) => {
    let _error = {
      name: "createPlaylist",
    };

    if(!_newPlaylist) {
      _error.msg = "input data invalid";
      reject(_error);
    }
    if(!_newPlaylist.name) {
      _error.msg = "input name invalid";
      reject(_error);
    }

    if(!config.accToken) {
      _error.msg = "access_token is null";
      reject(_error);
    }

    const userId = config.user_info.id;
    const url = config.base_uri + '/v1/users/' + userId + '/playlists';

    const options = {
      url: url,
      headers: { 'Authorization': 'Bearer ' + config.accToken },
      json: true,
      body: _newPlaylist
    };

    request.post(options, function(error, response, playlist) {
      if(error) {
        _error.msg = "error creating playlist: " + options.body.name;
        _error.stack = error;
        reject(_error);
      }
      resolve(playlist, response);
    });
  });
};

/**
 * Playlist - Modify Detail
 * id                  : String (Required)
 * details.name        : String
 * details.description : String
 * details.public      : Boolean
 */
const modifyPlaylistDetails = (_playlist) => {
  let _error = {
    name: "modifyPlaylistDetails",
  };

  if(!_playlist) {
    _error.msg = "input data invalid";
    throw _error;
  }
  if(!_playlist.id) {
    _error.msg = "playistId not provided";
    throw _error;
  }
  if(!_playlist.details.name && !_playlist.details.description
      && !_playlist.details.public) {
    _error.msg = "update details not provided for: " +  _playlist.id;
    throw _error;
  }

  if(!config.accToken) {
    _error.msg = "access_token is null";
    throw _error;
  }

  const userId = config.user_info.id;
  const url = config.base_uri + '/v1/users/' + userId + '/playlists/' +
    _playlist.id;

  var options = {
    url: url,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + config.accToken,
      'accept': 'application/json'
    },
    body: _playlist.details ,
    json: true
  };

  request(options, function (error, response) {
    if(error) {
      _error.msg = "error updating " + _playlist.id + " details";
      _error.stack = error;
      throw _error;
    }
    return response;
  });
};

/**
 * Playlist - add / delete tracks
 * id        : String (Required)
 * trackIds  : Array (Required)
 * addTracks : Boolean (Required. True -> Adding / False -> Removing)
 */
const modifyTracks = (_playlist, addTracks) => {
  let _error = {
    name: "modifyTracks",
  };

  if(!_playlist) {
    _error.msg = "input data invalid";
    throw _error;
  }
  if(!_playlist.trackIds || _playlist.trackIds.length == 0) {
    _error.msg = "trackId not provided";
    throw _error;
  }
  if(!_playlist.id) {
    _error.msg = "playistId not provided";
    throw _error;
  }

  if(!config.accToken) {
    _error.msg = "access_token is null";
    throw _error;
  }

  // TODO: Split requests when track Id > 100

  const userId = config.user_info.id;
  const url = config.base_uri + '/v1/users/' + userId + '/playlists/' +
    _playlist.id + '/tracks';

  var options = {
    url: url,
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + config.accToken,
      'accept': 'application/json'
    },
    body: {
      uris: _playlist.trackIds
    },
    json: true
  };

  if(addTracks) {
    options.method = 'POST'
  } else {
    options.method = 'DELETE'
  }

  request(options, function (error, response) {
    if(error) {
      _error.msg = "error modifying tracks in: " + _playlist.id;
      _error.stack = error;
      throw _error;
    }
    return response;
  });
};

module.exports = {
  fetchPlaylistSongs,
  fetchPlaylists,
  createPlaylist,
  modifyPlaylistDetails,
  modifyTracks
}
