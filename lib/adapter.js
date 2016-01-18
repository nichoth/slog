module.exports = adapter;

function adapter(db) {

  var a = {
    getValues: db.slogGetValues,
    fetchNode: db.slogFetchNode,
    putNode: db.slogPutNode,
    fetchNodes: db.slogFetchNodes,
    delNode: db.slogDelNode
  };

  return a;
}
