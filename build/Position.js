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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _tinperBeeCore = require('tinper-bee-core');

var _calculatePosition = require('./utils/calculatePosition');

var _calculatePosition2 = _interopRequireDefault(_calculatePosition);

var _getContainer = require('./utils/getContainer');

var _getContainer2 = _interopRequireDefault(_getContainer);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = {
  /**
   * 要设置定位的元素
   */
  target: _propTypes2["default"].oneOfType([_tinperBeeCore.componentOrElement, _propTypes2["default"].func]),

  /**
   * 存放的容器元素
   */
  container: _propTypes2["default"].oneOfType([_tinperBeeCore.componentOrElement, _propTypes2["default"].func]),
  /**
   * 容器padding值
   */
  containerPadding: _propTypes2["default"].number,
  /**
   * 位置设置
   */
  placement: _propTypes2["default"].oneOf(['top', 'right', 'bottom', 'left']),
  /**
   * 是否需要更新位置
   */
  shouldUpdatePosition: _propTypes2["default"].bool
};

var defaultProps = {
  containerPadding: 0,
  placement: 'right',
  shouldUpdatePosition: false
};

/**
 * 计算子组件的位置的组件
 */

var Position = function (_Component) {
  _inherits(Position, _Component);

  function Position(props, context) {
    _classCallCheck(this, Position);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      positionLeft: 0,
      positionTop: 0,
      arrowOffsetLeft: null,
      arrowOffsetTop: null
    };

    _this.needsFlush = false;
    _this.lastTarget = null;

    _this.getTarget = _this.getTarget.bind(_this);
    _this.maybeUpdatePosition = _this.maybeUpdatePosition.bind(_this);
    _this.updatePosition = _this.updatePosition.bind(_this);
    return _this;
  }

  Position.prototype.componentDidMount = function componentDidMount() {
    this.updatePosition(this.getTarget());
  };

  Position.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    this.needsFlush = true;
  };

  Position.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.needsFlush) {
      this.needsFlush = false;

      this.maybeUpdatePosition();
    }
  };
  /**
   * 获取要设置位置的子元素
   */


  Position.prototype.getTarget = function getTarget() {
    var target = this.props.target;

    var targetElement = typeof target === 'function' ? target() : target;
    return targetElement && _reactDom2["default"].findDOMNode(targetElement) || null;
  };

  /**
   * 验证是否需要更新位置
   */


  Position.prototype.maybeUpdatePosition = function maybeUpdatePosition(placementChanged) {
    var target = this.getTarget();
    if (!this.props.shouldUpdatePosition && target === this.lastTarget && !placementChanged) {
      return;
    }

    this.updatePosition(target);
  };
  /**
   * 更新位置
   */

  Position.prototype.updatePosition = function updatePosition(target) {
    this.lastTarget = target;

    if (!target) {
      this.setState({
        positionLeft: 0,
        positionTop: 0,
        arrowOffsetLeft: null,
        arrowOffsetTop: null
      });

      return;
    }

    var overlay = _reactDom2["default"].findDOMNode(this);
    var container = (0, _getContainer2["default"])(this.props.container, (0, _ownerDocument2["default"])(this).body);

    this.setState((0, _calculatePosition2["default"])(this.props.placement, overlay, target, container, this.props.containerPadding));
  };

  Position.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        props = _objectWithoutProperties(_props, ['children', 'className']);

    var _state = this.state,
        positionLeft = _state.positionLeft,
        positionTop = _state.positionTop,
        arrowPosition = _objectWithoutProperties(_state, ['positionLeft', 'positionTop']);

    // These should not be forwarded to the child.


    delete props.target;
    delete props.container;
    delete props.containerPadding;
    delete props.shouldUpdatePosition;

    var child = _react2["default"].Children.only(children);
    return (0, _react.cloneElement)(child, {
      className: (0, _classnames2["default"])(className, child.props.className),
      style: _extends({}, child.props.style, {
        left: positionLeft,
        top: positionTop
      })
    });
  };

  return Position;
}(_react.Component);

Position.propTypes = propTypes;
Position.defaultProps = defaultProps;

exports["default"] = Position;
module.exports = exports['default'];