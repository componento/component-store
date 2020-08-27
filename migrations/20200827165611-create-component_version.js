'use strict';

exports.setup = function(options, seedLink) {
};

exports.up = function(db) {
  return db.createTable('component_version', {
        id: {type: 'bigint', autoIncrement: true, primaryKey: true},
        version_id: {type: 'bigint', autoIncrement: true, notNull: true},
        uuid: {type: 'string', length: 36},
        name: {type: 'string', length: 200},
        provider: {type: 'string', length: 200},
        description: {type: 'string', length: 1600},
        old_path: {type: 'string', length: 200},
        version_name: {type: 'string', length: 200}
      }
  );
};

exports.down = function(db) {
  return db.dropTable('component_version');
};

exports._meta = {
  "version": 1
};