var eggs = require('eggs');
var async = require('async');
var routes = require('../routes');
var helpers = require('../lib/helpers');

module.exports = function($,callback){
  helpers.models = this.models;
  helpers.url = this.url;
  async.forEach(routes,function(route,done){
    var ViewModel = route.viewModel(helpers);
    eggs($,{selector : route.selector},ViewModel,done);
  },function(err){
    if(callback && $.html){
      var html = $.html();
      callback(err,html);
    }
  });
}
