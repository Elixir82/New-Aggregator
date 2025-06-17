const app=require('./app');
const mongoose=require('mongoose');
require('dotenv').config();

const port = process.env.PORT||5000;

try {
  mongoose.connect(process.env.MongoURI).then(()=>{
    console.log("Database connected successfully");
    app.listen(port,()=>{
      console.log("Server listening on",port);
    })
  })
} catch (error) {
  console.log("Unable to connect to DB, Original error being ",error);
}