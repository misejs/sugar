var eggs = require('eggs');
var async = require('async');
var routes = require('../routes');
var helpers = require('../lib/helpers');

module.exports = function($,callback){
  helpers.models = this.models;
  helpers.url = this.url;
  async.forEach(routes,function(route,done){
    var viewModel;
    var bind = function(){
      var e = eggs($,{selector : route.selector});
      e.bind(viewModel);
      done();
    }
    var ViewModel = route.viewModel(helpers);
    var viewModel = new ViewModel(bind);
    if(!ViewModel.length){
      bind();
    }
  },function(err){
    if(callback){
      var html = $.html();
      callback(err,html);
    }
  });
}
