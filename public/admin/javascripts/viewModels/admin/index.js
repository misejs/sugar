module.exports = function(helpers){
  function AdminIndexViewModel(ready) {
    var Model = helpers.currentModel();
    var self = this;
    self.items = [];
    self.collection = helpers.currentCollection();
    self.createLink = '/admin/'+self.collection+'/create';

    self.remove = function(info){
      if(confirm('Are you sure you want to delete this item? This cannot be undone.')){
        var item = new Model(info);
        item.link = '/admin/'+self.collection+'/' + item._id;
        item.destroy(function(){
          reload();
        },function(err){
          console.error('error removing item: ',err);
        });
      }
    };

    var reload = function(cb){
      Model.index(function(items){
        if(items) self.items = items[self.collection];
      },function(err){
        console.error('error listing items: ',err);
      },cb);
    }

    reload(ready);
  };
  return AdminIndexViewModel;
}
