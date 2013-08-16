//=========================================== File: db.js =========
//== ClipGet by Mariusz J. Galus   Contact: mg@ieee.org           =
//== Site: www.mariuszgalus.com                                   =
//=================================================================
//= About: This program runs a NodeJs HTTP server which takes GET =
//= http requests to /get and /clip with the following parameters =
//= server:port/get - returns the last clip'd data as JSON        =
//= server:port/clip?key1=value1&k2=v2&kn=vn sets key:value pairs =
//=================================================================
var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://localhost/jsonclipboard");
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectID;
var db1 = mongoose.connection;

var dbcallback = function() {



// ClipModel.statics.Add( function(err, queryData) {
//   if(err) {
//     console.log(err);
//   } else if (queryData) {
//       var instance = new ClipModel( 
//       {
//         instance.data = queryData;
//         instance.dataStr = JSON.stringify
//       });
//   }
// });

// ClipModel.statics.getClip = function (cb) {
//   this.findOne().sort({date: -1}, function(err, data) {
//     if(err) { console.log('Error in getClip', err);
//     } else if (data) {
//       cb(err, data);
//     }
//   });
// };

};



//Define Schemas
var clipSchema = new Schema({
  dataStr: String,
  date: Date
});
//Define Schema Static Methods
clipSchema.statics.getClip = function (cb) {
  this.find().sort({date: -1}).limit(1, function(err, data) {
    if(err) { console.log('Error in getClip', err);
    } else if (data) {
      cb(data);
    }
  });
};
//Declare Scehma as mongoose model and start collection
var ClipModel = mongoose.model('Clip', clipSchema);
//Export Model for other .js files accessability
exports.Clip = ClipModel;


db1.on('error', console.error.bind(console, 'connection error:'));
db1.once('open', dbcallback);

