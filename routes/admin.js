exports.home = function(req,res,next){
  res.render('admin/admin',{layout : 'admin/layout'});
};

exports.index = function(req,res,next){
  res.render('admin/index',{layout : 'admin/layout'});
};

exports.create = function(req,res,next){
  res.render('admin/create',{layout : 'admin/layout'});
};

exports.update = function(req,res,next){
  res.render('admin/update',{layout : 'admin/layout'});
};
