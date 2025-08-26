const express=require('express');
const cors=require('cors');
const app=express();
const fetchNewsFromAPI = require('./services/fetchNews');
app.use(cors());
app.use(express.json());

// app.get('/',(req,res)=>res.send("API is running"));

app.use('/',require('./routes/newsRoute.js'))

module.exports=app;

