var amqp = require('amqplib/callback_api'),
    _playlist = require('../../youtube/modules/playlist'),
    _ = require("underscore");

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    var queue = 'import_youtube';

    ch.assertQueue(queue, {durable: false});
    ch.prefetch(1);
    console.log("[*] Awaiting requests", queue);

    ch.consume(queue, async(playlist) => {
      console.log(" [x] Received %s", playlist.content.toString());
      const msg = JSON.parse(playlist.content.toString());
      const id = queue + "_"+ msg.channelId + "_" + msg.uri;

      ch.sendToQueue(
        playlist.properties.replyTo,
        new Buffer(JSON.stringify(id)),
        { correlationId: playlist.properties.correlationId }
      );

      ch.ack(playlist);

      try {
        const input = {
          playlistId: msg.uri,
          part: 'snippet,contentDetails',
          fields: 'items(snippet(title, resourceId(videoId)))'
        }

        const playlistTracks =
          await _playlist.fetchPlaylistTracks(input);

        // TODO: Update DB upon forming the object as per our schema
        console.log(JSON.stringify(playlistTracks));

      } catch (e) {
        console.log(e);
      }

    });
  });
});
