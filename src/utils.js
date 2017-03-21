function none(obj) {
  return (obj === null || obj === undefined || (isNaN(obj) && obj === false))
}
function createSearch(collection, property) {
  return function(value) {
    return collection.find(c => c[property] === value)
  }
}

function unless(exp, cb) {
  if(none(exp)) {
    cb()
  }
}

module.exports = {
  createSearch: createSearch,
  unless: unless
}
