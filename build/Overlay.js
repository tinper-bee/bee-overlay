'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _BaseOverlay = require('./BaseOverlay');

var _BaseOverlay2 = _interopRequireDefault(_BaseOverlay);

var _tinperBeeCore = require('tinper-bee-core');

var _Fade = require('./Fade');

var _Fade2 = _interopRequireDefault(_Fade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = _extends({}, _BaseOverlay2["default"].propTypes, {

  /**
   * 是否显示
   */
  show: _propTypes2["default"].bool,
  /**
   * 是
   */
  rootClose: _propTypes2["default"].bool,
  /**
   * 当点击rootClose触发close时的回调函数
   */
  onHide: _propTypes2["default"].func,

  /**
   * 使用动画
   */
  animation: _propTypes2["default"].oneOfType([_tinperBeeCore.elementType, _propTypes2["default"].func]),

  /**
   * Callback fired before the Overlay transitions in
   */
  onEnter: _propTypes2["default"].func,

  /**
   * Callback fired as the Overlay begins to transition in
   */
  onEntering: _propTypes2["default"].func,

  /**
   * Callback fired after the Overlay finishes transitioning in
   */
  onEntered: _propTypes2["default"].func,

  /**
   * Callback fired right before the Overlay transitions out
   */
  onExit: _propTypes2["default"].func,

  /**
   * Callback fired as the Overlay begins to transition out
   */
  onExiting: _propTypes2["default"].func,

  /**
   * Callback fired after the Overlay finishes transitioning out
   */
  onExited: _propTypes2["default"].func,

  /**
   * Sets the direction of the Overlay.
   */
  placement: _propTypes2["default"].oneOf(["top", "right", "bottom", "left", "topLeft", "rightTop", "bottomLeft", "leftTop", "topRight", "rightBottom", "bottomRight", "leftBottom"]),

  /**
   * 当Overlay在placement方向放不下时的第二优先级方向
   */
  secondPlacement: _propTypes2["default"].oneOf(['top', 'right', 'bottom', 'left'])
});

var defaultProps = {
  animation: _Fade2["default"],
  rootClose: false,
  show: false,
  placement: 'right'
};

var Overlay = function (_Component) {
  _inherits(Overlay, _Component);

  function Overlay() {
    _classCallCheck(this, Overlay);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Overlay.prototype.render = function render() {
    var _props = this.props,
        animation = _props.animation,
        children = _props.children,
        props = _objectWithoutProperties(_props, ['animation', 'children']);

    var transition = animation === true ? _Fade2["default"] : animation || null;

    var child = void 0;

    if (!transition) {
      child = (0, _react.cloneElement)(children, {
        className: (0, _classnames2["default"])(children.props.className, 'in')
      });
    } else {
      child = children;
    }

    return _react2["default"].createElement(
      _BaseOverlay2["default"],
      _extends({}, props, {
        transition: transition,
        onHide: props.onHide
      }),
      child
    );
  };

  return Overlay;
}(_react.Component);

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

exports["default"] = Overlay;
module.exports = exports['default'];