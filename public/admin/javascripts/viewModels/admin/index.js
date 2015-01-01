module.exports = function(helpers){
  function AdminIndexViewModel(ready) {
    var Model = helpers.currentModel();
    var self = this;
    self.items = [];
    self.collection = helpers.currentCollection();
    self.createLink = '/admin/'+self.collection+'/create';

    var decorateItems = function(items){
      items = items.map(function(item){
        item = new Model(item);
        return {
          item : item,
          remove : function(){
            if(confirm('Are you sure you want to delete this item? This cannot be undone.')){
              item.destroy(function(){
                reload();
              },function(err){
                console.error('error removing item: ',err);
              });
            }
          },
          link : '/admin/'+self.collection+'/' + item._id
        }
      });
      return items;
    };

    var reload = function(cb){
      Model.index(function(items){
        items = items[self.collection];
        self.items = decorateItems(items);
      },function(err){
        console.error('error listing items: ',err);
      },cb);
    }

    reload(ready);
  };
  return AdminIndexViewModel;
}
