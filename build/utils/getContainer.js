'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getContainer;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 获取容器组件
 * @param  {[type]} container        [description]
 * @param  {[type]} defaultContainer [description]
 * @return {[type]}                  [description]
 */
function getContainer(container, defaultContainer) {
  container = typeof container === 'function' ? container() : container;
  return _reactDom2["default"].findDOMNode(container) || defaultContainer;
}
module.exports = exports['default'];