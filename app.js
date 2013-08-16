//=========================================== File: app.js ========
//== ClipGet by Mariusz J. Galus   Contact: mg@ieee.org           =
//== Site: www.mariuszgalus.com                                   =
//=================================================================
//= About: This program runs a NodeJs HTTP server which takes GET =
//= http requests to /get and /clip with the following parameters =
//= server:port/get - returns the last clip'd data as JSON        =
//= server:port/clip?key1=value1&k2=v2&kn=vn sets key:value pairs =
//=================================================================
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

var fs = require('fs');

var restify = require('restify')
 , DB = require('./db.js');

var getClientIp = function(req) {
  var ipAddress = null;
  var forwardedIpsStr = req.headers['x-forwarded-for'];
  if (forwardedIpsStr) {
    ipAddress = forwardedIpsStr[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}


var server = restify.createServer({name: 'jsonclipboard-api'});

server.use(restify.bodyParser());
server.use(restify.fullResponse());
server.use(restify.queryParser({ mapParams: false }));

function getClipboard(req, res, next){
  test.find().sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}

function postClipboard(req, res, next){

  var test = new test();
  test.stringkey = req.params.stringkey;
  test.date = new Date();
  test.save(function() {
    res.send(req.body);
  });
}


// server.get('/test', getClipboard);
// server.post('/test', postClipboard);
var globalHTMLCLIPGET = null;


server.get('/bookmarklet', function indexHTML(req, res, next) {
    fs.readFile(__dirname + '/clipget.html', function (err, data) {
        if (err) {
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
});
  });




server.get('/echo/:name/:address', function(req, res, next) {
  res.send({name: req.params.name, address: req.params.address});
  console.log(req.params);

  next();
});

server.get('/', function(req, res, next) {
  var imgURL = "http://behance.vo.llnwd.net/profiles22/1198365/projects/9810483/b94b9a556b68d8e51c215c7656256578.jpg";
  var imgURLj = "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-prn1/994898_10151830312061983_60984449_n.jpg";
 var body = '<html><body><a href="http://64labs.com"><img src='+imgURL+'></a></br><p><!--Application specific REST API server by Mariusz J. Galus /get /clip?key1=valu1&key2=value2--></p></body></html>';
res.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/html'
});
res.write(body);

console.log(getClientIp(req), " connected at ", getDateTime());
res.end();
  next();
});



server.get('/query', function(req, res, next) {
  res.send(req.query);
  console.log(req.query);
  console.log(req.query.me + 'is the best');
  console.log(JSON.stringify(req.query));
  next();
});

//This below code will grab any query strings
//Example: localhost:8888/clip?key=value&key2=value2
//and respond back to the page with them, also storing into
//the database
server.get('/clip', function(req, res, next){
  res.send(req.query); 
   var myClip = new DB.Clip({ //Makes a new Buffer collection Mongoose
     dataStr : JSON.stringify(req.query),
     date : new Date()
   });
   myClip.save();
   var myData = myClip.toObject();
   myObject = JSON.parse(myData.dataStr);
   console.log('New Clip: ', myObject.lname, myData.date);
   next();
});

server.get('/get', function(req, res, next){
  //res.send('Check Console Doe');
  DB.Clip.find().sort({date: -1}).limit(1).exec( function(err, data){
    if(err) { console.log(err) 
     } else if (data) {
      res.send(data);
      var now = new Date().toString().replace(/T/, ' ').replace(/\..+/, '')
      console.log('Getting Clip ', now );
    }
  });
  next();
  // DB.Clip.getClip( function(data){
  //   console.log(data);
  //   req.send(JSON.stringify(data));
  //   next();
  // });
  //console.log(DB.Clips.find());
});
//server.get('/p/:email/:fname/:lname/:eduPrev/:eduCurr/:major/:state/:city/:state/:country')


server.listen(port, host, function() { //8888, function() {
  console.log("%s listening at %s", server.name, server.url);
});











//  var server = restify.createServer({ name: "mongo-api" });
//  server.listen(8888, function() {
//   console.log("%s listening at %s", server.name, server.url);
//  });

// server.use(restify.fullResponse());
// server.use(restify.bodyParser());
// server.pre(restify.pre.userAgentConnection());


// server.get('/user', function (req, res, next) {
//  User.find({}, function (error, users) {
//  res.send(users)
//  })
// })



//   server.post('/ctrlv', function(err, req, res, next){
//     assert.ifError(err);
//     console.log('%d -> %j', res.statusCode, res.headers);
//     console.log('%j', );
//   })

// // server.post('/user', function (req, res, next) {
// //  if (req.params.email === undefined) {
// //   return next(new restify.InvalidArgumentError('Email parameter missing'))
// //  }
// //  var userData = {
// //   email: req.params.email,
// //   fname: req.params.fname,
// //   lname: req.params.lname
// //  }


//  var user = new User(userData);
//  user.save(function (error, data) {
//   if (error) {
//    return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
//   }
//   else {
//    res.json(data);
//   }
//   res.send(201, user)
//  })
// })


//  // var db = mongoose.connect("mongodb://localhost/example-api");
//  // var Schema = mongoose.Schema;
//  //  ObjectId = Schema.ObjectID;
//  // var User = new Schema({
//  //  email: { type: String, required: true, trim: true},
//  //  fname: { type: String, required: false, trim: true},
//  //  lname: { type: String, required: false, trim: true},
//  // });
//  // var User = mongoose.model('User', User);


//  


//============FOR DEBUGGING SYSOP ONLY!==========
// db.runCommand( { count: 'clips' } )
// using mongo.exe will give you the number of saved clips.
//-----------------------------------------------
//FOR USE IN JAVASCRIPT BOOKMARKLET!!!!!
// getClip gets the latest clip
//Usage var example = getClip(); 
//returns the data within the last clipped object
//----------CODE----------------------------------
// var getClip = function(theUrl) {
//  theUrl = "http://localhost:8888/get";

  // function httpGet(theUrl)
  //   {
  //   var xmlHttp = null;

  //   xmlHttp = new XMLHttpRequest();
  //   xmlHttp.open( "GET", theUrl, false );
  //   xmlHttp.send( null );
  //   return xmlHttp.responseText;
  //   }


// var string1 = httpGet(theUrl);
// var obj1 = JSON.parse(string1 );
// var obj2 = obj1[0].dataStr;
// var data = JSON.parse(obj2);
// return data
// }

//-----------------------------------------------
//SETCLIP makes a new clip
//Usage, hit the server:8888/Clip?key1=value1&key2=value2...etc
//Which will make a new clip with the above key:value pairs.
//----------CODE----------------------------------
  // var setClip = function(theUrl) {
  // function httpGet(theUrl)
  //   {
  //   var xmlHttp = null;
  //   xmlHttp = new XMLHttpRequest();
  //   xmlHttp.open( "GET", theUrl, false );
  //   xmlHttp.send( null );
  //   console.log(xmlHttp.responseText);
  //   return xmlHttp.responseText;
  //   }
  // }
//   var setClip = function(theUrl) {
//   function httpGet(theUrl)
//     {
//     var xmlHttp = null;
//     xmlHttp = new XMLHttpRequest();
//     xmlHttp.open( "GET", theUrl, false );
//     xmlHttp.send( null );
//     console.log(xmlHttp.responseText);
//     return xmlHttp.responseText;
//     }
//   }
//-----------------------------------------------
// var responz = setClip("http://localhost:8888/clip?This=Is&A=Test&Yolo=Swag+SWAGITTY");
