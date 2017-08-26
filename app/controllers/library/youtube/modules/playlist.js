const config = require('../../../../../config/config'),
      token = require(config.root + '/config/youtube'),
      request = require('request'),
      google = require('googleapis'),
      _ = require('underscore');

/**
 * Lists Playlists
 *
 * playlist.mine        : Boolean (set true to retrieve logged in users channel)
 * playlist.channelId   : String - retrieve playlists from channel
 * playlist.id          : [String] of playlist Ids
 * playlist.maxResults  : Integer
 * playlist.part        : Snippet response - Required
 * playlist.fields      : Fields to filter from playlist.part
 */
const fetchPlaylists = (playlist) => {
  return new Promise((resolve, reject) => {
    let _error = {
      service: "youtube",
      name: "getPlaylists"
    };

    if (!token.Oauth2Client) {
      _error.msg = "unauthorized service. access_token is null";
      reject(_error);
    }

    const service = google.youtube('v3');

    let options = {
      auth: token.Oauth2Client,
    };

    if(playlist.mine)
      options.mine = true;
    else if(playlist.channelId)
      options.channelId = playlist.channelId;
    else if(playlist.id)
      options.id = playlist.id;

    if (playlist.maxResults)
      options.maxResults = playlist.maxResults;

    if(playlist.fields)
      options.fields = playlist.fields;

    if (playlist.part)
      options.part = playlist.part;
    else {
      _error.msg = "Missing parameter: part";
      reject(_error);
    }

    service.playlists.list(options, function(err, response) {
      if (err) {
        _error.msg = err;
        reject(_error);
        return _error;
      }

      const playlists = response.items;
      let _playlists = [];

      _.each(playlists, (_playlist) => {
        _playlists.push(_playlist);
      });

      if(_.size(playlists) == _.size(_playlists))
        resolve(_playlists);
    });
  });
};

/**
 * Lists Playlists
 *
 * playlist.id          : [String] of playlist Ids
 * playlist.maxResults  : Integer
 * playlist.playlistId  : String - retrieve tracks from playlists
 * playlist.part        : Snippet response - Required
 * playlist.fields      : Fields to filter from playlist.part
 */
const fetchPlaylistTracks = (playlist) => {
  return new Promise((resolve, reject) => {
    let _error = {
      service: "youtube",
      name: "getPlaylistTracks"
    };

    if (!token.Oauth2Client) {
      _error.msg = "unauthorized service. access_token is null";
      reject(_error);
    }

    const service = google.youtube('v3');

    let options = {
      auth: token.Oauth2Client,
    };


    if(playlist.playlistId)
      options.playlistId = playlist.playlistId;
    else if(playlist.id)
      options.id = playlist.id;

    if (playlist.maxResults)
      options.maxResults = playlist.maxResults;

    if(playlist.fields)
      options.fields = playlist.fields;

    if (playlist.part)
      options.part = playlist.part;
    else {
      _error.msg = "Missing parameter: part";
      reject(_error);
    }

    service.playlistItems.list(options, function(err, response) {
      if (err) {
        _error.msg = err;
        reject(_error);
        return _error;
      }

      const playlists = response.items;
      let _playlists = [];

      _.each(playlists, (_playlist) => {
        _playlists.push(_playlist);
      });

      if(_.size(playlists) == _.size(_playlists))
        resolve(_playlists);
    });
  });
};

module.exports = {
  fetchPlaylists,
  fetchPlaylistTracks
}
