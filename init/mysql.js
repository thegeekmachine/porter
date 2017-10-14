const mysql = require("mysql");

const tableQueries = [
  `CREATE TABLE USERS (
    id INT NOT NULL AUTO_INCREMENT,
    serviceId INT NOT NULL,
    name varchar(255) NOT NULL,
    accessToken varchar(255) NOT NULL,
    refreshToken varchar(255) NOT NULL,
    clientId varchar(255) NOT NULL,
    clientSecret varchar(255) NOT NULL,
    clientScopes varchar(255) NOT NULL,
    redirectURI varchar(255) NOT NULL,
    PRIMARY KEY (id))
  `,
  `CREATE TABLE SERVICES (
    name varchar(255) NOT NULL,
    photo varchar(255),
    PRIMARY KEY (name))
  `,
  `CREATE TABLE PLAYLISTS (
    id varchar(255) NOT NULL,
    serviceId INT NOT NULL,
    name varchar(255) NOT NULL,
    uri varchar(255) NOT NULL,
    photo varchar(255),
    PRIMARY KEY (id, serviceId))
  `,
  `CREATE TABLE TRACKS (
    id INT NOT NULL,
    title INT NOT NULL,
    photo varchar(255),
    PRIMARY KEY (id))
  `,
  `CREATE TABLE ARTISTS (
    id INT NOT NULL,
    name INT NOT NULL,
    photo varchar(255),
    PRIMARY KEY (id))
  `,
  `CREATE TABLE USER_PLAYlIST (
    userId INT NOT NULL,
    playlistId INT NOT NULL)
  `,
  `CREATE TABLE TRACK_SERVICE (
    trackId INT NOT NULL,
    serviceId INT NOT NULL,
    uri varchar(255) NOT NULL)
  `,
  `CREATE TABLE TRACK_ARTIST (
    trackId INT NOT NULL,
    artistId INT NOT NULL)
  `,
  `CREATE TABLE PLAYLIST_TRACK (
    playlistId INT NOT NULL,
    trackId INT NOT NULL)
  `,
];

const setup = (client) => {
  return new Promise((resolve, reject) => {
    let queries = [];
    tableQueries.forEach(query => {
      query = query.replace(/\n/g, '')
      queries.push(createTable(client, query));
    });

    Promise.all(queries).then(() => {
      console.log("table creation: success");
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
};

const createDatabase = config => {
  return new Promise((resolve, reject) => {
    const query = "CREATE DATABASE " + (config.database);
    let _config = Object.assign({}, config); delete _config.database;
    const client = mysql.createConnection(_config);
    client.query(query, (err, result) => {
      if(err) reject(err);
      client.end();
      resolve(mysql.createConnection(config));
    });
  });
};

const createTable = (client, query) => {
  return new Promise((resolve, reject) => {
    client.query(query, (error, result) => {
      if(error) {
        const _error = {
          name: "createTable",
          message: "table creation failed" + query,
          trace: error
        };
        reject(_error);
      }
      resolve();
    });
  });
};

const cleanSlate = (client, database) => {
  return new Promise((resolve, reject) => {
    client.query("DROP DATABASE " + database, (error,  result) => {
      if(error) {
        const _error = {
          name: "cleanSlate",
          message: "failed deleting" + database,
          trace: error
        };
        reject(_error);
      }
      resolve();
    });
  });
}
module.exports = {
  setup,
  createDatabase,
  cleanSlate
}
