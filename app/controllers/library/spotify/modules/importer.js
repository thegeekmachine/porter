const request = require('request'),
      config = require('../../../../../config/spotify'),
      _playlist = require('./playlist'),
      importMQ = require('../../MQ/import/publish'),
      _ = require('underscore');

/**
 * Fetches Playlists
 */
 const importPlaylists = async () => {

   return new Promise(async (resolve, reject) => {
     let _error = {
       service: "spotify",
       name: "import"
     };

     if(!config.accToken) {
       _error.msg = "unauthorized service. access_token is null";
       reject(_error);
     }

     const fields = "items(id, owner(id), uri, name, href, snapshot_id, tracks(total))";

     try {
       let ids = [];
       const playlists = await (
         _playlist.fetchPlaylists(fields, config.user_info.id)
       );

       //TODO : Deal with limits set by spotify server

       _.each(playlists.items, async (item) => {

         const playlist = {
           name: item.name,
           uri: item.id,
           fields: "items(track(id, name,href,album(name,id)))",
           service: "spotify",
           ownerId: item.owner.id
         };

         ids.push(importMQ.publish(playlist));
       });

      Promise.all(ids).then((_ids) => {
        resolve(_ids);
      })
     } catch (error) {
       console.log("error invoking importPlaylists", error);
       reject(error);
     }
   });
 };

module.exports = {
  importPlaylists
};
