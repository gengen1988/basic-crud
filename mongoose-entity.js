var mongoose = require('mongoose');

module.exports = function(opts) {

  var seneca = this;

  var models = opts.models;

  seneca.add('init:mongoose-entity', init);
  seneca.add('role:mongoose-entity, cmd:find-all', findAll);
  seneca.add('role:mongoose-entity, cmd:create', create);
  seneca.add('role:mongoose-entity, cmd:find-by-id', findById);
  seneca.add('role:mongoose-entity, cmd:update-by-id', updateById);
  seneca.add('role:mongoose-entity, cmd:destroy-by-id', destroyById);

  return;

  function init(args, done) {
    var mongodb = opts.mongodb;
    mongoose.connect(mongodb);
    done();
  }

  function findAll(args, done) {
    var model = args.model;
    var Model = models[model];

    Promise.all([
      Model.count(),
      Model.find()
    ]).then(function(results) {
      console.log('find all', Model);
      done(null, {
        count: results[0],
        entities: results[1]
      });
    }).catch(done);
  }

  function create(args, done) {
    var data = args.data;
    var model = args.model;
    var Model = models[model];

    delete data.model;

    var entity = new Model(args);
    entity.save().then(function() {
      done(null, entity);
    }).catch(done);
  }

  function findById(args, done) {
    var id = args.id;
    var model = args.model;
    var Model = models[model];

    Model.findById(id).then(function(entity) {
      done(null, entity)
    }).catch(done);
  }

  function updateById(args, done) {
    var id = args.id;
    var data = args.data;
    var model = args.model;
    var Model = models[model];

    Model.findByIdAndUpdate(id, data).then(function(entity) {
      done(null, entity)
    }).catch(done);
  }

  function destroyById(args, done) {
    var id = args.id;
    var model = args.model;
    var Model = models[model];

    Model.findByIdAndRemove(id).then(function(entity) {
      done(null, entity)
    }).catch(done);
  }

}
