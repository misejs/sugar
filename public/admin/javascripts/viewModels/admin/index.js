var helpers = require('./helpers');

function AdminIndexViewModel(ready) {
  var Model = helpers.currentModel();
  var self = this;
  self.items = [];
  self.collection = helpers.currentCollection();
  self.remove = function(info){
    if(confirm('Are you sure you want to delete this item? This cannot be undone.')){
      var item = new Model(info);
      item.destroy(function(){
        reload();
      },function(){
        console.error(arguments);
      });
    }
  };

  var reload = function(cb){
    Model.index(function(items){
      self.items(items);
    },function(){
      console.error(arguments);
    },cb);
  }

  reload(ready);
}

module.exports = AdminIndexViewModel;
