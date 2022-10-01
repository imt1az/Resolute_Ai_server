const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");

var MongoClient = require("mongodb").MongoClient;

require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER, process.env.DB_PASSWORD)
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-cployfw-shard-00-00.sezwgec.mongodb.net:27017,ac-cployfw-shard-00-01.sezwgec.mongodb.net:27017,ac-cployfw-shard-00-02.sezwgec.mongodb.net:27017/?ssl=true&replicaSet=atlas-hpdqux-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
async function run(){
  try{
    await client.connect();
    const studentsCollection = client.db("ALL_Students").collection("students");
     app.post('/addStudents',async(req,res)=>{
        const students = req.body;
        const result = await studentsCollection.insertOne(students);
        res.send(result);
     })
     app.get('/students',async(req,res)=>{
      const query = {}
      const cursor = studentsCollection.find(query);
      const students = await cursor.toArray();
        res.send(students);
     })


     // get Single Student for Viw
    app.get('/student/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsCollection.findOne(query);

      console.log(id);
      res.send(result);
    })
     // Update Single Student for Viw
    app.get('/updateStudent/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsCollection.findOne(query);

      console.log(id);
      res.send(result);
    })

    // Update Details
    app.put('/updateStudent/:id',async(req,res)=>{
      const id = req.params.id;
      const updateStudent = req.body;
      const filter = {_id: ObjectId(id)}
      const options = {upsert:true}
      const updateDoc ={
        $set:{
         firstName : updateStudent.firstName,
         middleName : updateStudent.middleName,
         lastName : updateStudent.lastName,
         classes : updateStudent.classes,
         division : updateStudent.division,
         rollNumber : updateStudent.rollNumber,
         addressLine1 : updateStudent.addressLine1,
         addressLine2 : updateStudent.addressLine2,
         landMark : updateStudent.landMark,
         city : updateStudent.city,
         pincode : updateStudent.pincode,
        }
      }
      const result = await studentsCollection.updateOne(filter,updateDoc,options)
      res.send(result);
    })

      //Delete Products
      app.delete("/student/:id",async(req, res) => {
        const id = req.params.id;
        const filter ={ _id: ObjectId(id) };
        const result = await studentsCollection.deleteOne(filter);
        res.send(result);
      });
  }
  finally{

  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running Resolutesssss Tech');
  })

app.listen(port, () => console.log("Listening from", port));