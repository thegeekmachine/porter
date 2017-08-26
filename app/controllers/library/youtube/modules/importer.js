const request = require('request'),
      config = require('../../../../../config/config'),
      token = require(config.root + '/config/youtube'),
      _playlist = require('./playlist'),
      importMQ = require('../../MQ/import/publish'),
      _ = require('underscore');

/**
 * Fetches Playlists
 */
 const importPlaylists = async () => {

   return new Promise(async (resolve, reject) => {
     let _error = {
       service: "youtube",
       name: "import"
     };

     if (!token.Oauth2Client) {
       _error.msg = "unauthorized service. access_token is null";
       reject(_error);
     }

     const input = {
       part: 'snippet,contentDetails',
       fields: "items(id,snippet(title,channelId),contentDetails(itemCount))",
       mine: true
     };

     try {
       let ids = [];
       const playlists = await (_playlist.fetchPlaylists(input));
       //TODO : Deal with limits set by youtube server

       _.each(playlists, async (item) => {

         const playlist = {
           name: item.snippet.title,
           uri: item.id,
           part: 'snippet,contentDetails',
           fields: "items(snippet(title, resourceId(videoId)))",
           service: "youtube",
           channelId: item.snippet.channelId
         };
         ids.push(importMQ.publish(playlist));
       });
      Promise.all(ids).then((_ids) => {
        resolve(_ids);
      });
     } catch (error) {
       console.log("error invoking importPlaylists", error);
       reject(error);
     }
   });
 };

module.exports = {
  importPlaylists
};
