const express=require('express');
const cors=require('cors');
const app=express();
const fetchNewsFromAPI = require('./services/fetchNews');
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running smoothly',
    timestamp: new Date().toISOString(),
    service: 'News_Aggregator-Backend'
  });
});
// app.get('/',(req,res)=>res.send("API is running"));

app.use('/',require('./routes/newsRoute.js'))

module.exports=app;

