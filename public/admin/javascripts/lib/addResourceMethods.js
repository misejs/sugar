var request = require('superagent');
var prefix = require('superagent-prefix');

var getURL = function(url,baseURL){
  if(!baseURL) return url;
  url = url.replace(/^\//,'');
  return baseURL.replace(/((?:https?:\/\/)?[^\/]+).+/i,'$1/' + url);
}

var handleResponse = function(err,res,success,error,complete){
  err = err || res.error || (res.body && res.body.error);
  if(err){
    error(err);
  } else {
    success(res.body);
  }
  if(complete) complete();
};

var generateModel = function(Model,baseURL){
  var collection = Model.prototype.collection;
  Model.index = function(success,error,complete){
    request
      .get(getURL('/api/' + collection,baseURL))
      .end(function(err,res){
        handleResponse(err,res,success,error,complete);
      });
  };
  Model.show = function(id,success,error,complete){
    request
      .get(getURL('/api/' + collection + '/' + id,baseURL))
      .end(function(err,res){
        handleResponse(err,res,success,error,complete);
      });
  };
  Model.prototype.save = function(success,error,complete){
    var data = this.toObject();
    method = !!data._id ? 'put' : 'post';
    request
      [method](getURL('/api/' + collection + (data._id ? '/' + data._id : ''),baseURL))
      .send(data)
      .end(function(err,res){
        handleResponse(err,res,success,error,complete);
      });
  };
  Model.prototype.destroy = function(success,error,complete){
    var data = this.toObject();
    request
      .del(getURL('/api/' + collection + '/' + data._id,baseURL))
      .end(function(err,res){
        handleResponse(err,res,success,error,complete);
      });
  };
  return Model;
};

module.exports = generateModel;
