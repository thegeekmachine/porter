var amqp = require('amqplib/callback_api'),
    _ = require("underscore");

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    var queue = 'import_youtube';

    ch.assertQueue(queue, {durable: false});
    ch.prefetch(1);
    console.log("[*] Awaiting requests", queue);

    ch.consume(queue, (playlist) => {
      console.log(" [x] Received %s", playlist.content.toString());
      const msg = JSON.parse(playlist.content.toString());
      const id = queue + "_" + msg.uri.toString();

      ch.sendToQueue(
        playlist.properties.replyTo,
        new Buffer(JSON.stringify(id)),
        { correlationId: playlist.properties.correlationId }
      );

      ch.ack(playlist);
    });
  });
});
