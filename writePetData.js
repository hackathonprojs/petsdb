const irisnative = require('intersystems-iris-native')

let sampleData = 
{
  "id": new Date().getTime(),
  "organization_id": "CA595",
  "url": "https://www.petfinder.com/dog/fiona-46168887/ca/san-jose/city-of-san-jose-animal-care-center-ca595/?referrer_id=cbc05715-9bfd-4050-aac7-4f115ffe1350",
  "type": "Dog",
  "species": "Dog",
  "breeds": {
      "primary": "Yorkshire Terrier",
      "secondary": "Maltese",
      "mixed": true,
      "unknown": false
  },
  "colors": {
      "primary": null,
      "secondary": null,
      "tertiary": null
  },
  "age": "Adult",
  "gender": "Female",
  "size": "Small",
  "coat": null,
  "attributes": {
      "spayed_neutered": true,
      "house_trained": false,
      "declawed": null,
      "special_needs": false,
      "shots_current": false
  },
  "environment": {
      "children": null,
      "dogs": null,
      "cats": null
  },
  "tags": [],
  "name": "FIONA",
  "description": null,
  "photos": [
      {
          "small": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/46168887/1/?bust=1570133020&width=100",
          "medium": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/46168887/1/?bust=1570133020&width=300",
          "large": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/46168887/1/?bust=1570133020&width=600",
          "full": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/46168887/1/?bust=1570133020"
      }
  ],
  "status": "adoptable",
  "status_changed_at": "2019-10-03T20:01:37+0000",
  "published_at": "2019-10-03T20:01:37+0000",
  "distance": 48.4589,
  "contact": {
      "email": null,
      "phone": "(408) 794-7297",
      "address": {
          "address1": "2750 Monterey Road",
          "address2": null,
          "city": "San Jose",
          "state": "CA",
          "postcode": "95111",
          "country": "US"
      }
  },
  "_links": {
      "self": {
          "href": "/v2/animals/46168887"
      },
      "type": {
          "href": "/v2/types/dog"
      },
      "organization": {
          "href": "/v2/organizations/ca595"
      }
  }
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

console.log('writing the data into intersystems db from a json data');

/**
 * write one piece of data
 */
function writeOne() {
  let elem = sampleData;
  sampleData.id = sampleData.id++;
  let id = sampleData.id;

  console.log(elem);
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
}

// don't close the connection?
// close connection
//connection.close();


module.exports = {
  writeOne: writeOne,
};
