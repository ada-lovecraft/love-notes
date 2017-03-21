'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function none(obj) {
  return obj === null || obj === undefined || isNaN(obj) && obj === false;
}
function createSearch(collection, property) {
  return function (value) {
    return collection.find(function (c) {
      return c[property] === value;
    });
  };
}

function unless(exp, cb) {
  if (none(exp)) {
    cb();
  }
}

function truncValues(obj) {
  var demark = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\n';
  var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 80;

  var o = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var key = _ref2[0];
      var value = _ref2[1];

      if (typeof value === 'string') {
        var splits = value.split(demark);
        if (splits.length > 1) {
          value = splits[0] + '...' + splits[splits.length - 1];
        }

        if (value.length > length - 3) {
          value = value.substr(0, length - 3) + '...';
        }
      }
      o[key] = value;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return o;
}

module.exports = {
  createSearch: createSearch,
  unless: unless,
  truncValues: truncValues
};