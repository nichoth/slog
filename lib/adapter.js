var slogdb = require('slog-db-level');

module.exports = adapter;

function adapter(db) {

  var sdb = slogdb(db);

  var a = {
    getValues: sdb.getValues,
    fetchNode: sdb.fetchNode,
    putNode: sdb.putNode,
    fetchNodes: sdb.fetchNodes
  };

  return a;
}
