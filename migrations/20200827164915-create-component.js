'use strict';

exports.setup = function(options, seedLink) {
};

exports.up = function(db) {
  return db.createTable('component', {
        id: {type: 'bigint', autoIncrement: true, primaryKey: true},
        name: {type: 'string', length: 200},
        provider: {type: 'string', length: 200},
        description: {type: 'string', length: 1600},
        path: {type: 'string', length: 200},
        version_id: {type: 'bigint',},
        version_name: {type: 'string', length: 200}
      }
  );
};

exports.down = function(db) {
  return db.dropTable('component');
};

exports._meta = {
  "version": 1
};