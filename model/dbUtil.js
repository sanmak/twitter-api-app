const mongoose = require('mongoose');
const config = require('../config.json');
const connectionUrl = 'mongodb://'+config.mongoConfig.host+':'+config.mongoConfig.port+'/'+config.mongoConfig.db;
mongoose.connect(connectionUrl);

const Schema = mongoose.Schema;

const tweets = new Schema({
  id:  {type : Number,unique : true},
  text: {type : String},
  date: { type: Date, default: Date.now }
});

const history = new Schema({
  id: {type : Number},
  text: {type : String,index : true, unique : true},
  tweet_id : {type : Number},
  date: {type: Date, default: Date.now },
});

const users = new Schema({
  username: {type : String, unique : true},
  password: {type : String, unique : true},
  date: {type: Date, default: Date.now },
});

module.exports = {
  tweets : mongoose.model('tweets', tweets),
  history : mongoose.model('history', history),
  users : mongoose.model('users', users)
};