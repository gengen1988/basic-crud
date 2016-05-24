module.exports = function(opts) {

  var seneca = this;
  var mongoose;

  seneca.add('init:mongoose-entity', init);
  seneca.add('role:mongoose-entity, cmd:find-all', findAll);
  seneca.add('role:mongoose-entity, cmd:create', create);
  seneca.add('role:mongoose-entity, cmd:find-by-id', findById);
  seneca.add('role:mongoose-entity, cmd:update-by-id', updateById);
  seneca.add('role:mongoose-entity, cmd:destroy-by-id', destroyById);

  return;

  function init(args, done) {
    mongoose = opts.mongoose;
    done();
  }

  function findAll(args, done) {
    var model = args.model;
    var Model = mongoose.model(model);

    console.log('model', model);

    Promise.all([
      Model.count(),
      Model.find()
    ]).then(function(results) {
      done(null, {
        count: results[0],
        entities: results[1]
      });
    }).catch(done);
  }

  function create(args, done) {
    var data = args.data;
    var model = args.model;
    var Model = mongoose.model(model);

    var entity = new Model(data);
    entity.save().then(function() {
      done(null, entity);
    }).catch(done);
  }

  function findById(args, done) {
    var id = args.id;
    var model = args.model;
    var Model = mongoose.model(model);

    Model.findById(id).then(function(entity) {
      done(null, entity)
    }).catch(done);
  }

  function updateById(args, done) {
    var id = args.id;
    var data = args.data;
    var model = args.model;
    var Model = mongoose.model(model);

    Model.findByIdAndUpdate(id, data).then(function(entity) {
      done(null, entity)
    }).catch(done);
  }

  function destroyById(args, done) {
    var id = args.id;
    var model = args.model;
    var Model = mongoose.model(model);

    Model.findByIdAndRemove(id).then(function(entity) {
      done(null, entity)
    }).catch(done);
  }

}
