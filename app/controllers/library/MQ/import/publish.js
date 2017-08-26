const amqp = require('amqplib/callback_api');

const publish = (payload) => {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://localhost', (err, conn) => {
      conn.createChannel((err, ch) => {
        ch.assertQueue("", {exclusive: true}, (err, q) => {
          const corr = payload.uri;
          const queue = "import_" + payload.service;

          ch.consume(q.queue, function(playlist) {
            if (playlist.properties.correlationId == corr) {
              resolve(playlist.content.toString());
            } else {
              console.log('Unidentified CorrId %s', playlist.content.toString());
            }
          }, {autoAck: true});

          ch.sendToQueue(
            queue,
            new Buffer(JSON.stringify(payload)),
            {correlationId: corr, replyTo: q.queue }
          );

        });
      });
    });
  });
};

module.exports = {
  publish
};
