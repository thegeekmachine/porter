const request = require('request'),
      _ = require('underscore'),
      config = require('../../../../../config/spotify');

/**
 * Search album / artist / playlist / track
 * search : search query (Required)
 *    wildcard  : *
 *    operator  : NOT, OR
 *    year      : Date
 *    tag       : [hipster, new] Only when type == album
 *    genre     : String. Only when type == ['artist' , 'track']
 * type   : Array ['album', 'artist', 'playlist','track'] (Required)
 * market : String (locale)
 * limit  : Default 20, Min : 1, Max : 50
 * offset : Default 0, Max 100.000
 *
 * Note   : Specific user search happens via their playlist name
 */
const searchBox = async (_searchItem) => {
  return new Promise((resolve, reject) => {
    const types = ['album', 'artist', 'playlist','track'];
    let _error = {
      service: "spotify",
      name: "searchBox",
    };

    if(!_searchItem) {
      _error.msg = "input data invalid";
      reject(_error);
    }

    if(!_searchItem.type) {
      _error.msg = "search type invalid";
      reject(_error);
    }

    if(_searchItem.type.length > 0) {
      _.each(_searchItem.type, (_type) => {
        if(!_.contains(types, _type)) {
          _error.msg = "search type invalid" + _type;
          reject(_error);
        }
      });
    } else {
      _error.msg = "search type not provided";
      reject(_error);
    }

    if(!_searchItem.query) {
      _error.msg = "query data not provided";
      reject(_error);
    }

    if(!config.accToken) {
      _error.msg = "unauthorized service. access_token is null";
      reject(_error);
    }

    const url = config.base_uri + "/v1/search"

    let options = {
      url: url,
      qs: {
        q: _searchItem.query,
        type: _searchItem.type.toString()
      },
      headers: { 'Authorization': 'Bearer ' + config.accToken },
      json: true,
    };

    if(_searchItem.offset)
      options.qs.offset = _searchItem.offset;
    if(_searchItem.limit)
      options.qs.limit = _searchItem.limit;
    if(_searchItem.market)
      options.qs.market = _searchItem.market;

    request.get(options, function(error, response, searchResult) {
      if(error) {
        _error.msg = "error searching" + _searchItem.type + " : "
          + _searchItem.query;
        _error.stack = error;
        reject(_error);
      }

      resolve(searchResult, response);
    });
  });
};

module.exports = {
  searchBox
}
