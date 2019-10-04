const irisnative = require('intersystems-iris-native')

let sampleData = 
{
  "id": new Date().getTime(),
  starting: "SFO",
  destination: "SJO",
  startingDate: new Date().getTime() + (1000 * 60 * 60 * 24 * 10),
  endingDate: new Date().getTime() + (1000 * 60 * 60 * 24 * 15),
  price: 235,
}


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

/**
 * write one piece of data
 */
function writeOne() {
  console.log('writing flight data into intersystems db from a json data');

  let elem = getRandomData(sampleData);
  elem.id = new Date().getTime();
  let id = elem.id;

  console.log(elem);
  for (let prop in elem) {
    let value = elem[prop];
    if (prop === "id") {
      id = value;
      continue;
    }

    if (typeof value !== "object") {
      // eg. dbnative.set(7777, 'testglobal', '1');
      dbnative.set(value, 'flight', id, prop);
    } else {
      for (let propLvl2 in value) {
        let valueLvl2 = value[propLvl2];
        if (typeof valueLvl2 !== "object") {
          // eg. dbnative.set(7777, 'testglobal', '1');
          dbnative.set(valueLvl2, 'flight', id, prop, propLvl2);
        }
      }
    }
    
  }  
}

let seq = 0;
function getRandomData(data) {
  let airports = ["CVO", "AET", "AHN", "SMF", "TXK", "WYS"];
  data.destination = airports[seq++ % airports.length];
  data.price = data.price + (Math.random() * 10);
  return data;
}

// don't close the connection?
// close connection
//connection.close();


module.exports = {
  writeOne: writeOne,
};
