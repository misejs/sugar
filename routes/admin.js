exports.home = function(req,res,next){
  res.render('admin/admin');
};

exports.index = function(req,res,next){
  res.render('admin/index');
};

exports.create = function(req,res,next){
  res.render('admin/create');
};

exports.update = function(req,res,next){
  res.render('admin/update');
};
