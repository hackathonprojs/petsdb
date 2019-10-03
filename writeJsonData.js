const irisnative = require('intersystems-iris-native')
const jsonData = require('./petJson');


// Modify connection info based on environment
let connectionInfo = {
    host: '127.0.0.1', 
    port: 5001,
    ns: 'USER', 
    user: 'superuser',
    pwd: 'sys' 
};
// create database connection
const connection = irisnative.createConnection(connectionInfo);

//create IRIS instance
const dbnative = connection.createIris();

console.log('writing the data into intersystems db from a json data');

jsonData.json.forEach(elem => {
  console.log(elem);
});

// close connection
connection.close();