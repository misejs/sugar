var request = require('superagent');
var prefix = require('superagent-prefix');

var validateRequest = function(){
  if(typeof window == 'undefined' && request.url[0] === '/'){
    throw new Error('When initializing models on the server, you must provide a baseURL.');
  }
}

var generateModel = function(Model){
  var collection = Model.prototype.collection;
  Model.index = function(success,error,complete){
    validateRequest();
    request
      .get('/api/' + collection)
      .end(function(err,res){
        if(err){
          error(err);
        } else {
          success(res.body);
        }
        complete();
      });
  };
  Model.show = function(id,success,error,complete){
    validateRequest();
    request
      .get('/api/' + collection + '/' + id)
      .end(function(err,res){
        if(err){
          error(err);
        } else {
          success(res.body);
        }
        complete();
      });
  };
  Model.prototype.save = function(success,error,complete){
    validateRequest();
    var data = this.toObject();
    method = !!data._id ? 'put' : 'post';
    request
      [method]('/api/' + collection + (data._id ? '/' + data._id : ''))
      .send(data)
      .end(function(err,res){
        if(err){
          error(err);
        } else {
          success(res.body);
        }
        complete();
      });
  };
  Model.prototype.destroy = function(success,error,complete){
    validateRequest();
    var data = this.toObject();
    request
      .delete('/api/' + collection + '/' + data._id)
      .end(function(err,res){
        if(err){
          error(err);
        } else {
          success(res.body);
        }
        complete();
      });
  };
  return Model;
};

module.exports = function(model,baseURL){
  if(baseURL) prefix(baseURL)(request);
  return generateModel(model);
};
