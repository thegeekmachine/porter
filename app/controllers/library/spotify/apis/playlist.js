const express = require('express'),
      router = express.Router(),
      importer = require('../modules/importer'),
      playlist = require('../modules/playlist');

const LOGIN_URL = "http://localhost:8888/login";

module.exports = (app) => {
  app.use('/', router);

  // router.get('/spotify/fetchPlaylistTracks', (req, res) => {
  //   const _playlist = {
  //     id: "4ek13qkSUNQfq9VfmPT5Vf",
  //     fields: "items(track(id, name,href,album(name,id)))"
  //   };
  //
  //   playlist.fetchPlaylistTracks(_playlist).then((songs) => {
  //     res.send(songs);
  //   }).catch((error) => {
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   });
  // });
  //
  // router.get('/spotify/createPlaylist', (req, res) => {
  //   let newPlaylist = {
  //     description: 'Test Run',
  //     public: true,
  //     name: 'Porter'
  //   };
  //
  //   playlist.createPlaylist(newPlaylist).then((playlist, response) => {
  //     res.send(playlist);
  //   }).catch((error) => {
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   });
  // });
  //
  // router.get('/spotify/modifyPlaylist', (req, res) => {
  //   let _modifyDetails = {
  //     id: '1MmgyUfACCSR5aNfXt1B7u',
  //     details: {
  //       name: 'Porter2'
  //     }
  //   };
  //
  //   try {
  //     const status = playlist.modifyPlaylistDetails(_modifyDetails);
  //     res.send(status);
  //   } catch (error) {
  //     console.log(error);
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   }
  // });
  //
  // router.get('/spotify/addTracks', (req, res) => {
  //   let _playlist = {
  //     id: "4ek13qkSUNQfq9VfmPT5Vf",
  //     trackIds: [
  //       'spotify:track:4VXpBpn8rWoVBn9dGDgkME',
  //       'spotify:track:0JAMI01LCOOGFSSok2HgnZ'
  //     ]
  //   };
  //   try {
  //     const snapshotId = playlist.modifyTracks(_playlist, true);
  //     res.send(snapshotId);
  //   } catch (error) {
  //     console.log(error);
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   }
  // });
  //
  // router.get('/spotify/removeTracks', (req, res) => {
  //   let _playlist = {
  //     id: "4ek13qkSUNQfq9VfmPT5Vf",
  //     trackIds: [
  //       'spotify:track:4VXpBpn8rWoVBn9dGDgkME',
  //       'spotify:track:0JAMI01LCOOGFSSok2HgnZ'
  //     ]
  //   };
  //   try {
  //     const snapshotId = playlist.modifyTracks(_playlist, false);
  //     res.send(snapshotId);
  //   } catch (error) {
  //     console.log(error);
  //     if(error.msg.includes("access_token is null"))
  //       res.redirect(LOGIN_URL);
  //     else
  //       res.send(error);
  //   }
  // });

  router.get('/spotify/import', async (req, res) => {
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
