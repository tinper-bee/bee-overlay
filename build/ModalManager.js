'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _style = require('dom-helpers/style');

var _style2 = _interopRequireDefault(_style);

var _class = require('dom-helpers/class');

var _class2 = _interopRequireDefault(_class);

var _scrollbarSize = require('dom-helpers/util/scrollbarSize');

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _isOverflowing = require('./utils/isOverflowing');

var _isOverflowing2 = _interopRequireDefault(_isOverflowing);

var _manageAriaHidden = require('./utils/manageAriaHidden');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function findIndexOf(arr, cb) {
  var idx = -1;
  arr.some(function (d, i) {
    if (cb(d, i)) {
      idx = i;
      return true;
    }
  });
  return idx;
}

//查找容器
function findContainer(data, modal) {
  return findIndexOf(data, function (d) {
    return d.modals.indexOf(modal) !== -1;
  });
}

//设置容器style
function setContainerStyle(state, container) {
  var style = { overflow: 'hidden' };

  state.style = {
    overflow: container.style.overflow,
    paddingRight: container.style.paddingRight
  };

  if (state.overflowing) {
    //设置内边距，和添加滚动条宽度
    style.paddingRight = parseInt((0, _style2["default"])(container, 'paddingRight') || 0, 10) + (0, _scrollbarSize2["default"])() + 'px';
  }

  (0, _style2["default"])(container, style);
}
//移除容器style
function removeContainerStyle(_ref, container) {
  var style = _ref.style;


  Object.keys(style).forEach(function (key) {
    return container.style[key] = style[key];
  });
}
/**
 * 容器的正确状态管理和那些容器中的模态。
 */

var ModalManager = function () {
  function ModalManager() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$hideSiblingNode = _ref2.hideSiblingNodes,
        hideSiblingNodes = _ref2$hideSiblingNode === undefined ? true : _ref2$hideSiblingNode,
        _ref2$handleContainer = _ref2.handleContainerOverflow,
        handleContainerOverflow = _ref2$handleContainer === undefined ? true : _ref2$handleContainer;

    _classCallCheck(this, ModalManager);

    this.hideSiblingNodes = hideSiblingNodes;
    this.handleContainerOverflow = handleContainerOverflow;
    this.modals = [];
    this.containers = [];
    this.data = [];
  }

  ModalManager.prototype.add = function add(modal, container, className) {
    var modalIdx = this.modals.indexOf(modal);
    var containerIdx = this.containers.indexOf(container);

    if (modalIdx !== -1) {
      return modalIdx;
    }

    modalIdx = this.modals.length;
    this.modals.push(modal);

    if (this.hideSiblingNodes) {
      (0, _manageAriaHidden.hideSiblings)(container, modal.mountNode);
    }

    if (containerIdx !== -1) {
      this.data[containerIdx].modals.push(modal);
      return modalIdx;
    }

    var data = {
      modals: [modal],
      //right now only the first modal of a container will have its classes applied
      classes: className ? className.split(/\s+/) : [],

      overflowing: (0, _isOverflowing2["default"])(container)
    };

    if (this.handleContainerOverflow) {
      setContainerStyle(data, container);
    }

    data.classes.forEach(_class2["default"].addClass.bind(null, container));

    this.containers.push(container);
    this.data.push(data);

    return modalIdx;
  };

  ModalManager.prototype.remove = function remove(modal) {
    var modalIdx = this.modals.indexOf(modal);

    if (modalIdx === -1) {
      return;
    }

    var containerIdx = findContainer(this.data, modal);
    var data = this.data[containerIdx];
    var container = this.containers[containerIdx];

    data.modals.splice(data.modals.indexOf(modal), 1);

    this.modals.splice(modalIdx, 1);

    // if that was the last modal in a container,
    // clean up the container
    if (data.modals.length === 0) {
      data.classes.forEach(_class2["default"].removeClass.bind(null, container));

      if (this.handleContainerOverflow) {
        removeContainerStyle(data, container);
      }

      if (this.hideSiblingNodes) {
        (0, _manageAriaHidden.showSiblings)(container, modal.mountNode);
      }
      this.containers.splice(containerIdx, 1);
      this.data.splice(containerIdx, 1);
    } else if (this.hideSiblingNodes) {
      //otherwise make sure the next top modal is visible to a SR
      (0, _manageAriaHidden.ariaHidden)(false, data.modals[data.modals.length - 1].mountNode);
    }
  };

  ModalManager.prototype.isTopModal = function isTopModal(modal) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
  };

  return ModalManager;
}();

exports["default"] = ModalManager;
module.exports = exports['default'];