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

// jsonData.json is an array
jsonData.json.forEach(elem => {
  console.log(elem);
  let id;
  for (let prop in elem) {
    let value = elem[prop];
    if (prop === "id") {
      id = value;
      continue;
    }

    if (typeof value !== "object") {
      // eg. dbnative.set(7777, 'testglobal', '1');
      dbnative.set(value, 'pet', id, prop);
    } else {
      for (let propLvl2 in value) {
        let valueLvl2 = value[propLvl2];
        if (typeof valueLvl2 !== "object") {
          // eg. dbnative.set(7777, 'testglobal', '1');
          dbnative.set(valueLvl2, 'pet', id, prop, propLvl2);
        }
      }
    }
    
  }  
});

// close connection
connection.close();

