'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _Position = require('./Position');

var _Position2 = _interopRequireDefault(_Position);

var _RootCloseWrapper = require('./RootCloseWrapper');

var _RootCloseWrapper2 = _interopRequireDefault(_RootCloseWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = _extends({}, _Portal2["default"].propTypes, _Position2["default"].propTypes, {

  /**
   * 是否显示
   */
  show: _react.PropTypes.bool,

  /**
   * 点击其他地方，是否隐藏overlay
   */
  rootClose: _react.PropTypes.bool,

  /**
   * 当rootClose为true的时候，触发的隐藏方法
   * @type func
   */
  onHide: function onHide(props) {
    var propType = _react.PropTypes.func;
    if (props.rootClose) {
      propType = propType.isRequired;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return propType.apply(undefined, [props].concat(args));
  },


  /**
   * 过渡动画组件
   */
  transition: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string, _react.PropTypes.func]),

  /**
   * overlay添加动画前的钩子函数
   */
  onEnter: _react.PropTypes.func,

  /**
   * 开始动画的钩子函数
   */
  onEntering: _react.PropTypes.func,

  /**
   * 渲染之后的钩子函数
   */
  onEntered: _react.PropTypes.func,

  /**
   * 关闭开始时的钩子函数
   */
  onExit: _react.PropTypes.func,

  /**
   * 关闭时的钩子函数
   */
  onExiting: _react.PropTypes.func,

  /**
   * 关闭后的钩子函数
   */
  onExited: _react.PropTypes.func
});

function noop() {}

var defaultProps = {
  show: false,
  rootClose: true
};

/**
 * 悬浮组件
 */

var Overlay = function (_Component) {
  _inherits(Overlay, _Component);

  function Overlay(props, context) {
    _classCallCheck(this, Overlay);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = { exited: !props.show };
    _this.onHiddenListener = _this.handleHidden.bind(_this);
    return _this;
  }

  Overlay.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({ exited: false });
    } else if (!nextProps.transition) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({ exited: true });
    }
  };

  Overlay.prototype.handleHidden = function handleHidden() {
    this.setState({ exited: true });

    if (this.props.onExited) {
      var _props;

      (_props = this.props).onExited.apply(_props, arguments);
    }
  };

  Overlay.prototype.render = function render() {
    var _props2 = this.props;
    var container = _props2.container;
    var containerPadding = _props2.containerPadding;
    var target = _props2.target;
    var placement = _props2.placement;
    var shouldUpdatePosition = _props2.shouldUpdatePosition;
    var rootClose = _props2.rootClose;
    var children = _props2.children;
    var Transition = _props2.transition;

    var props = _objectWithoutProperties(_props2, ['container', 'containerPadding', 'target', 'placement', 'shouldUpdatePosition', 'rootClose', 'children', 'transition']);

    // Don't un-render the overlay while it's transitioning out.


    var mountOverlay = props.show || Transition && !this.state.exited;
    if (!mountOverlay) {
      // Don't bother showing anything if we don't have to.
      return null;
    }

    var child = children;

    // Position is be inner-most because it adds inline styles into the child,
    // which the other wrappers don't forward correctly.
    child = _react2["default"].createElement(
      _Position2["default"],
      {
        container: container,
        containerPadding: containerPadding,
        target: target,
        placement: placement,
        shouldUpdatePosition: shouldUpdatePosition },
      child
    );

    if (Transition) {
      var onExit = props.onExit;
      var onExiting = props.onExiting;
      var onEnter = props.onEnter;
      var onEntering = props.onEntering;
      var onEntered = props.onEntered;

      // This animates the child node by injecting props, so it must precede
      // anything that adds a wrapping div.

      child = _react2["default"].createElement(
        Transition,
        {
          'in': props.show,
          transitionAppear: true,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.onHiddenListener,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered
        },
        child
      );
    }

    // This goes after everything else because it adds a wrapping div.
    if (rootClose) {
      child = _react2["default"].createElement(
        _RootCloseWrapper2["default"],
        { onRootClose: props.onHide },
        child
      );
    }

    return _react2["default"].createElement(
      _Portal2["default"],
      { container: container },
      child
    );
  };

  return Overlay;
}(_react.Component);

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

exports["default"] = Overlay;
module.exports = exports['default'];