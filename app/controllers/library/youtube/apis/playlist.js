const express = require('express'),
      router = express.Router(),
      _channel = require('../modules/channel'),
      importer = require('../modules/importer'),
      _playlist = require('../modules/playlist');

const LOGIN_URL = "http://localhost:8888/youtube/login";

module.exports = (app) => {
  app.use('/', router);

  // router.get('/youtube/channels', (req, res) => {
  //   const channel = {
  //     part: 'id',
  //     fields: "*",
  //     mine: true
  //   };
  //   _channel.fetchChannels(channel).then((channels) => {
  //     res.send(channels);
  //   }).catch((error) => {
  //     console.log(error);
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   });
  // });
  //
  // router.get('/youtube/playlists', (req, res) => {
  //   const playlist = {
  //     part: 'snippet,contentDetails',
  //     fields: "items(id,snippet(title, channelId),contentDetails(itemCount))",
  //     mine: true
  //   };
  //   _playlist.fetchPlaylists(playlist).then((playlists) => {
  //     res.send(playlists);
  //   }).catch((error) => {
  //     console.log(error);
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   });
  // });
  //
  // router.get('/youtube/playlist/tracks', (req, res) => {
  //   const playlist = {
  //     playlistId: "PLRN8mPVz6WbwBotbTvhW1vxpXqKbsLdUW",
  //     part: 'snippet,contentDetails',
  //     fields: "items(snippet(title, resourceId(videoId)))"
  //   };
  //   _playlist.fetchPlaylistTracks(playlist).then((playlists) => {
  //     res.send(playlists);
  //   }).catch((error) => {
  //     console.log(error);
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   });
  // });

  router.get('/youtube/import', async (req, res) => {
    try {
      const ids = await (importer.importPlaylists());
      res.send(ids);
    } catch (error) {
      console.log(error);
      if(error && error.msg.includes("access_token is null"))
        res.redirect(LOGIN_URL);
      else
        res.send(error);
    }
  });
};
