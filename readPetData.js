const irisnative = require('intersystems-iris-native')


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

console.log('read the data of a certain pet');
//let value = dbnative.get('pet', 46163360);


// Get a list of child subscripts under node heros('dogs')
// let iterDogs = dbnative.iterator('pet', 46163360).keys();
// let output = "\nSubscripts under node heros(46163360): ";

// let iter = iterDogs.next();
// while (!iter.done) {
//   output += iter.value + ' ';
//   iter = iterDogs.next();
// }
// console.log(output);


// let key
// let value;
// let subscript = "";
// subscript = dbnative.order({global: "pet", subscripts: [46163360, subscript]});
// //let subscriptIter = dbnative.order({global: "pet", subscripts: [46163360, ""]);
// //let subscriptIter = dbnative.iterator('pet(46163360)');  
// while (subscript !== "") {
//   console.log("subscript=", subscript);
//   subscript = dbnative.order({global: "pet", subscripts: [46163360, subscript]});  
// }

// let subscriptIter = dbnative.iterator('pet', 46163360);
// let node = subscriptIter.next();
// while (!node.done) {
//     console.log('subscript='+ node.value[0] +', value='+ node.value[1]);
//     node = subscriptIter.next();
// }



// let subscriptIter = dbnative.iterator('pet');  
// for ([key,value] of subscriptIter) {
//     console.log('subscript='+ key +', value=' + value);
// };

// console.log('Iterate backwards a different way');
// let revIter = dbnative.iterator('pet', 46163360, 'breeds').reversed();
// let node = revIter.next();
// while (!node.done) {
//     console.log('subscript='+ node.value[0] +', value='+ node.value[1]);
//     node = revIter.next();
// }

let petId = 46163360;
var iter = dbnative.iterator('^pet',petId).keys();
var pet = iter.next();
console.log(iter);
while (!pet.done) {
  // console.log(pet.value[0]);
  let output = "Key="+pet.value
  let state = dbnative.isDefined('^pet',petId,pet.value)
  if (state == 1 || state == 11) {
      output += " ; value="+dbnative.get('^pet',petId,pet.value)
  }
  console.log(output); //[0]+" ; value="+pet.value[1]);
  console.log(iter);

  pet = iter.next();
}


function findAllHeros() {
  const root = 'pet';
  console.log('List all subnodes of root node '+root+':\n'+root)
  let iterRoot = dbnative.iterator(root);
  let hasChild = false;

  // Iterate over children of root node heros
  console.log(iterRoot);
  let ndoe = iterRoot.next();
  while (!node.done) {
    console.log(node.value[0]);
  }

  for ([sub1,value] of iterRoot) {
    hasChild = testNode(value,root,sub1);

    // Iterate over children of heros(sub1)
    if (hasChild) {
      let iterOne = dbnative.iterator(root,sub1);
      for ([sub2,value] of iterOne) {
        hasChild = testNode(value,root,sub1,sub2);

        // Iterate over children of heros(sub1,sub2)
        if (hasChild) {
          let iterTwo = dbnative.iterator(root,sub1,sub2);
          for ([sub3,value] of iterTwo) {
            testNode(value,root,sub1,sub2,sub3); //no child nodes below level 3
          }
        } //end level 2
      }
    } //end level 1
  } // end main loop
} // end findAllHeros()

function testNode(value, root, ...subs) {

  // Test for values and child nodes
  let state = native.isDefined(root,...subs);
  let hasValue = (state%10 > 0); // has value if state is 1 or 11
  let hasChild = (state > 9);    // has child if state is 10 or 11

  // format the node address output string
  let subList = Array.from(subs);
  let level = subList.length-1;
  let indent = '  ' + String('      ').slice(0,(level*2));
  let address = indent + root+'(' + subList.join() + ')';

  // Add node value to string and note special cases
  if (hasValue) { // ignore valueless nodes
    address += ' = ' + value;
    for (name of ['Timmy','Dolly']) {
      if (name == subList[level]) {
        address += ' (not a dog!)'
      }
    }
  }
  console.log(address);
  return hasChild;
}




// close connection
connection.close();

