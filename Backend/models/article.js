const mongoose=require('mongoose');

const articleSchema=new mongoose.Schema({
  title: String,
  link: { type: String, unique: true }, 
  snippet: String,
  photo_url: String,
  published_datetime_utc: Date,
  source_name: String,
  topic: String, 
}, { timestamps: true });

module.exports=mongoose.model('Article',articleSchema);
