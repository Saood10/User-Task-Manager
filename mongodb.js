
const { MongoClient , ObjectID} = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
// objectid optional if u want your own generated id
// const id = new ObjectID();

// Database Name
const databaseName = 'my-project'

client.connect()
console.log("connected");
        

        // const db = client.db(databaseName)          // creating database with a name

        // db.collection('users').insertOne({          // give table name users and clollection as cloumns
        //     'name':'Saood',
        //     'age':'22'
        // },(err,result) => {
        //     if(err)
        //     {
        //         console.log("unable to insert data");
        //     }

        //     console.log(result.ops)

        // })



