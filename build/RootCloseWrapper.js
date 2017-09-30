'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _contains = require('dom-helpers/query/contains');

var _contains2 = _interopRequireDefault(_contains);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _addEventListener = require('./utils/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = {
  onRootClose: _propTypes2["default"].func,
  children: _propTypes2["default"].element,
  /**
   * 是否禁用
   */
  disabled: _propTypes2["default"].bool,
  /**
   * 触发事件选择
   */
  event: _propTypes2["default"].oneOf(['click', 'mousedown'])
};

var defaultProps = {
  event: 'click'
};

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

var RootCloseWrapper = function (_Component) {
  _inherits(RootCloseWrapper, _Component);

  function RootCloseWrapper(props, context) {
    _classCallCheck(this, RootCloseWrapper);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.handleMouseCapture = function (e) {
      _this.preventMouseRootClose = isModifiedEvent(e) || !isLeftClickEvent(e) || (0, _contains2["default"])(_reactDom2["default"].findDOMNode(_this), e.target);
    };

    _this.handleMouse = function () {
      if (!_this.preventMouseRootClose && _this.props.onRootClose) {
        _this.props.onRootClose();
      }
    };

    _this.handleKeyUp = function (e) {
      if (e.keyCode === 27 && _this.props.onRootClose) {
        _this.props.onRootClose();
      }
    };

    _this.preventMouseRootClose = false;

    _this.addEventListeners = _this.addEventListeners.bind(_this);
    _this.removeEventListeners = _this.removeEventListeners.bind(_this);

    return _this;
  }

  RootCloseWrapper.prototype.componentDidMount = function componentDidMount() {
    if (!this.props.disabled) {
      this.addEventListeners();
    }
  };

  RootCloseWrapper.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (!this.props.disabled && prevProps.disabled) {
      this.addEventListeners();
    } else if (this.props.disabled && !prevProps.disabled) {
      this.removeEventListeners();
    }
  };

  RootCloseWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
    if (!this.props.disabled) {
      this.removeEventListeners();
    }
  };

  RootCloseWrapper.prototype.addEventListeners = function addEventListeners() {
    var event = this.props.event;

    var doc = (0, _ownerDocument2["default"])(this);

    // 避免react的监听事件触发引起判断的不准确
    this.documentMouseCaptureListener = (0, _addEventListener2["default"])(doc, event, this.handleMouseCapture, true);

    this.documentMouseListener = (0, _addEventListener2["default"])(doc, event, this.handleMouse);

    this.documentKeyupListener = (0, _addEventListener2["default"])(doc, 'keyup', this.handleKeyUp);
  };

  RootCloseWrapper.prototype.removeEventListeners = function removeEventListeners() {
    if (this.documentMouseCaptureListener) {
      this.documentMouseCaptureListener.remove();
    }

    if (this.documentMouseListener) {
      this.documentMouseListener.remove();
    }

    if (this.documentKeyupListener) {
      this.documentKeyupListener.remove();
    }
  };

  RootCloseWrapper.prototype.render = function render() {
    return this.props.children;
  };

  return RootCloseWrapper;
}(_react.Component);

RootCloseWrapper.propTypes = propTypes;

RootCloseWrapper.defaultProps = defaultProps;

exports["default"] = RootCloseWrapper;
module.exports = exports['default'];