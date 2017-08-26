const config = require('../../../../../config/config'),
      token = require(config.root + '/config/youtube'),
      google = require('googleapis'),
      _ = require('underscore');

/**
 * Lists Channel Ids
 *
 * channel.mine         : Boolean (set true to retrieve logged in users channel)
 * channel.id           : [String] of channel Ids
 * channel.forUsername  : String - Retrieve channels of user
 * channel.maxResults   : Integer
 * channel.part         : Snippet response - Required
 * channel.fields       : Fields to filter from channel.part
 */
const fetchChannels = (channel) => {
  return new Promise((resolve, reject) => {
    let _error = {
      service: "youtube",
      name: "getChannel"
    };

    if (!token.Oauth2Client) {
      _error.msg = "unauthorized service. access_token is null";
      reject(_error);
    }

    const service = google.youtube('v3');

    let options = {
      auth: token.Oauth2Client,
    };

    if(channel.mine)
      options.mine = true;
    else if(channel.forUsername)
      options.forUsername = channel.forUsername;
    else if(channel.id)
      options.id = channel.id;

    if (channel.maxResults)
      options.maxResults = channel.maxResults;

    if (channel.fields)
      options.fields = channel.fields

    if (channel.part)
      options.part = channel.part;
    else {
      _error.msg = "Missing parameter: part";
      reject(_error);
    }

    service.channels.list(options, (err, response) => {
      if (err) {
        _error.msg = err;
        reject(_error);
        return _error;
      }
      const channels = response.items;

      let channelIds = [];
      _.each(channels, (_channel) => {
        channelIds.push(_channel.id);
      });

      if(_.size(channels) == channelIds.length)
        resolve(channelIds);
    });
  });
}

module.exports = {
  fetchChannels
}
