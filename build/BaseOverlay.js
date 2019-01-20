'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _Position = require('./Position');

var _Position2 = _interopRequireDefault(_Position);

var _RootCloseWrapper = require('./RootCloseWrapper');

var _RootCloseWrapper2 = _interopRequireDefault(_RootCloseWrapper);

var _tinperBeeCore = require('tinper-bee-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var isReact16 = _reactDom2["default"].createPortal !== undefined;

var propTypes = _extends({}, _Position2["default"].propTypes, {

  /**
   * 是否显示
   */
  show: _propTypes2["default"].bool,

  /**
   * 点击其他地方，是否隐藏overlay
   */
  rootClose: _propTypes2["default"].bool,

  /**
   * 当rootClose为true的时候，触发的隐藏方法
   * @type func
   */
  onHide: function onHide(props) {
    var propType = _propTypes2["default"].func;
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
  transition: _propTypes2["default"].oneOfType([_tinperBeeCore.elementType, _propTypes2["default"].func]),

  /**
   * overlay添加动画前的钩子函数
   */
  onEnter: _propTypes2["default"].func,

  /**
   * 开始动画的钩子函数
   */
  onEntering: _propTypes2["default"].func,

  /**
   * 渲染之后的钩子函数
   */
  onEntered: _propTypes2["default"].func,

  /**
   * 关闭开始时的钩子函数
   */
  onExit: _propTypes2["default"].func,

  /**
   * 关闭时的钩子函数
   */
  onExiting: _propTypes2["default"].func,

  /**
   * 关闭后的钩子函数
   */
  onExited: _propTypes2["default"].func
});

function noop() {}

var defaultProps = {
  show: false,
  rootClose: true
};

/**
 * 悬浮组件
 */

var BaseOverlay = function (_Component) {
  _inherits(BaseOverlay, _Component);

  function BaseOverlay(props, context) {
    _classCallCheck(this, BaseOverlay);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = { exited: !props.show };
    _this.onHiddenListener = _this.handleHidden.bind(_this);
    return _this;
  }

  BaseOverlay.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({ exited: false });
    } else if (!nextProps.transition) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({ exited: true });
    }
  };

  BaseOverlay.prototype.handleHidden = function handleHidden() {
    this.setState({ exited: true });

    if (this.props.onExited) {
      var _props;

      (_props = this.props).onExited.apply(_props, arguments);
    }
  };

  BaseOverlay.prototype.render = function render() {
    var _props2 = this.props,
        container = _props2.container,
        containerPadding = _props2.containerPadding,
        target = _props2.target,
        placement = _props2.placement,
        secondPlacement = _props2.secondPlacement,
        shouldUpdatePosition = _props2.shouldUpdatePosition,
        rootClose = _props2.rootClose,
        positionLeft = _props2.positionLeft,
        positionTop = _props2.positionTop,
        children = _props2.children,
        Transition = _props2.transition,
        props = _objectWithoutProperties(_props2, ['container', 'containerPadding', 'target', 'placement', 'secondPlacement', 'shouldUpdatePosition', 'rootClose', 'positionLeft', 'positionTop', 'children', 'transition']);

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
        positionLeft: positionLeft,
        positionTop: positionTop,
        placement: placement,
        secondPlacement: secondPlacement,
        shouldUpdatePosition: shouldUpdatePosition },
      child
    );

    if (Transition) {
      var onExit = props.onExit,
          onExiting = props.onExiting,
          onEnter = props.onEnter,
          onEntering = props.onEntering,
          onEntered = props.onEntered;

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

    if (isReact16) {
      return child;
    } else {
      return _react2["default"].createElement(
        _Portal2["default"],
        { container: container },
        child
      );
    }
  };

  return BaseOverlay;
}(_react.Component);

BaseOverlay.propTypes = propTypes;
BaseOverlay.defaultProps = defaultProps;

exports["default"] = BaseOverlay;
module.exports = exports['default'];