const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dbUtil = require('../model/dbUtil.js');
const config = require('../config.json');
const tweets = dbUtil.tweets;
const history = dbUtil.history;

// route middleware to authenticate and check token
router.use(function(req, res, next) {
	let token = req.body.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				req.decoded = decoded;	
				next();
			}
		});
	} else {
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
	}
});

router.get('/tweets', function(req, res, next) {
  tweets.find({},{'id':1,'text' :1,'_id' : 0},{sort : {'date' : -1}},function(err,findRes){
  	if(err){
  		res.send({'Error' : err});
  	}
  	else{
  		res.send({'results' : findRes,'count' : findRes.length});	
  	}
  });
});
router.get('/tweets/:id', function(req, res, next) {
  let returnJson = {};
  tweets.findOne({'id' : req.params.id},{'id':1,'text' :1,'_id' : 0},{sort : {'date' : -1}},function(err,findRes){
  	if(err){
  		res.send({'Error' : err});
  	}
  	else{
  		returnJson['results'] = findRes;
  		history.find({'tweet_id' : req.params.id},{id : 1,text : 1,_id : 0},function(err,historyRes){
  			if(err){
		  		res.send(err);
		  	}
		  	else{
		  		returnJson['versions'] = historyRes;
  				res.send(returnJson);
  			}
  		});
  	}
  });
});
router.post('/tweets',function(req,res){
	let tweetsObj = new dbUtil.tweets();
	tweetsObj.text = req.body.text;
	getCounter(tweets,function(err,counter){
		if(err){
			res.send({'Error' : err});
		}
		else{
			if(counter === 0){
				tweetsObj.id = 1;
			}
			else{
				tweetsObj.id = counter + 1;
			}
			tweetsObj.save(function(err,tweetsCreation, numAffected) {
				if(err){
					res.send({'Error' : err});
				}
				else{
					res.send({'TweetsCreation' : tweetsCreation,'NumberOfDocumentsAffected' : numAffected});
				}
			});	
		}
	});
});
router.put('/tweets/:id',function(req,res){
	insertIntoHistory(req.params.id,req.body.text,function(err,insertResponse){
		if(err){
			res.send({'Error' : err});
		}
		else{
			tweets.findOneAndUpdate({id : req.params.id},{'text' : req.body.text},function(err,doc){
				if(err){
					res.send({'Error' : err});
				}
				else{
					res.send({'TweetUpdate' : doc,'HistoryUpdate' : insertResponse});
				}
			});
		}
	});
});
router.delete('/tweets/:id',function(req,res){
	deleteHistory(req.params.id,function(err,deleteResponse){
		if(err){
			res.send({'Error' : err});
		}
		tweets.remove({id : req.params.id},function(err,response){
			if(err){
				res.send({'Error' : err});
			}
			else{
				res.send({'TweetDelete' : response,'HistoryDelete' : deleteResponse});
			}
		});
	})
});
router.get('/history/:tweetid/:historyid',function(req,res){
	history.find({id : req.params.historyid,tweet_id : req.params.tweetid},function(err,findRes){
		if(err){
			res.send({'Error' : err});
		}
		else{
			res.send({'results' : findRes});
		}
	});
});
router.put('/history/:tweetid/:historyid',function(req,res){
	history.findOneAndUpdate({id : req.params.historyid,tweet_id : req.params.tweetid},{text : req.body.text},function(err,historyUpdate){
		if(err){
			res.send({'Error' : err});
		}
		else{
			res.send({'HistoryUpdate' : historyUpdate});
		}
	});
});
router.delete('/history/:tweetid/:historyid',function(req,res){
	deleteTweetHistory(req.params.tweetid,req.params.historyid,function(err,deleteResponse){
		if(err){
			res.send({'Error' : err});
		}
		else{
			res.send({'HistoryDelete' : deleteResponse});
		}
	});
})
function insertIntoHistory(tweetId,putText,callback){
	let historyObject = new dbUtil.history();
	tweets.findOne({'id' : tweetId,'text' : {$ne :putText}},function(err,res){
		if(err){
			return callback(err,null);
		}
		else if(res != null){
			getHistoryCounter(history,tweetId,function(err,counter){
				if(err){
					return callback(err);
				}
				if(counter === 0){
					historyObject.id = 1;
				}
				else{
					historyObject.id = counter + 1;
				}
				historyObject.tweet_id = tweetId;
				historyObject.text = res.text;
				historyObject.save(function(err,historyCreation, numAffected) {
					if(err){
						return callback(err,null);
					}
					else{ 
						callback(null,{'HistoryCreation' : historyCreation,'NumberOfDocumentsAffected' : numAffected});
					}
				});
			});
		}
		else{
			callback(null,null);
		}
	});
}

function deleteTweetHistory(tweetId,historyId,callback){
	history.remove({tweet_id : tweetId,id : historyId},function(err,res){
		callback(err,res);
	});
}
function deleteHistory(tweetId,callback){
	history.remove({tweet_id : tweetId},function(err,res){
		callback(err,res);
	});
}
function getCounter(collectionName,callback){
	collectionName.count({},function(err,res){
		callback(err,res);
	});
}function getHistoryCounter(collectionName,id,callback){
	collectionName.count({'tweet_id' : id},function(err,res){
		callback(err,res);
	});
}

module.exports = router;
