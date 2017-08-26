var amqp = require('amqplib/callback_api'),
    _ = require("underscore"),
    _playlist = require('../../spotify/modules/playlist');

const util = require('util');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    var queue = 'import_spotify';

    ch.assertQueue(queue, {durable: false});
    ch.prefetch(1);
    console.log("[*] Awaiting requests", queue);

    ch.consume(queue, async (playlist) => {
      //console.log(" [x] Received %s", playlist.content.toString());
      const msg = JSON.parse(playlist.content.toString());
      const id = queue + "_"+ msg.ownerId.toString() + "_" + msg.uri.toString();

      ch.sendToQueue(
        playlist.properties.replyTo,
        new Buffer(JSON.stringify(id)),
        { correlationId: playlist.properties.correlationId }
      );

      ch.ack(playlist);

      try {
        const input = {
          id: msg.uri,
          fields: "items(track(id, name,href,album(name,id)))"
        }

        const playlistTracks =
          await _playlist.fetchPlaylistTracks(input, msg.ownerId);

        // TODO: Update DB upon forming the object as per our schema
        getTracks(playlistTracks, msg.uri);

      } catch (e) {
        console.log(e);
      }
    });
  });
});


const getTracks = (payloads, _id) => {
  let Tracks = [], ServiceTracks = [];

  let _error = {
    service: "spotify",
    name: "getTracks"
  };

  if(!payloads) {
    _error.msg = "input null";
    throw _error;
  } else if(!payloads.items) {
    _error.msg = _id + " : "+ payloads
    throw _error;
  }

  _.each(payloads.items, (payload) => {

    const track = {
      title : payload.track.name,
      album : {
        title : payload.track.album.name
      }
    };

    const serviceTrack = {
      service: "spotify",
      uri: payload.track.id,
      // "track": track map to track present in porter
    };

    ServiceTracks.push(serviceTrack);
    Tracks.push(track);
  });

  if(_.size(payloads.item) == _.size(Tracks.length)) {
    //TODO: resolve the output
    console.log(Tracks, ServiceTracks);
  }
}
