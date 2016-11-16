'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

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
  target: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func]),

  /**
   * 存放的容器元素
   */
  container: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func]),
  /**
   * 容器padding值
   */
  containerPadding: _react2["default"].PropTypes.number,
  /**
   * 位置设置
   */
  placement: _react2["default"].PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  /**
   * 是否需要更新位置
   */
  shouldUpdatePosition: _react2["default"].PropTypes.bool
};

var defaultProps = {
  containerPadding: 0,
  placement: 'right',
  shouldUpdatePosition: false
};

/**
 * 计算子组件的位置的组件
 */

var Position = function (_React$Component) {
  _inherits(Position, _React$Component);

  function Position(props, context) {
    _classCallCheck(this, Position);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.state = {
      positionLeft: 0,
      positionTop: 0,
      arrowOffsetLeft: null,
      arrowOffsetTop: null
    };

    _this._needsFlush = false;
    _this._lastTarget = null;
    return _this;
  }

  Position.prototype.componentDidMount = function componentDidMount() {
    this.updatePosition(this.getTarget());
  };

  Position.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    this._needsFlush = true;
  };

  Position.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this._needsFlush) {
      this._needsFlush = false;
      this.maybeUpdatePosition(this.props.placement !== prevProps.placement);
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

    if (!this.props.shouldUpdatePosition && target === this._lastTarget && !placementChanged) {
      return;
    }

    this.updatePosition(target);
  };
  /**
   * 更新位置
   */

  Position.prototype.updatePosition = function updatePosition(target) {
    this._lastTarget = target;

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
    var _props = this.props;
    var children = _props.children;
    var className = _props.className;

    var props = _objectWithoutProperties(_props, ['children', 'className']);

    var _state = this.state;
    var positionLeft = _state.positionLeft;
    var positionTop = _state.positionTop;

    var arrowPosition = _objectWithoutProperties(_state, ['positionLeft', 'positionTop']);

    // These should not be forwarded to the child.


    delete props.target;
    delete props.container;
    delete props.containerPadding;
    delete props.shouldUpdatePosition;

    var child = _react2["default"].Children.only(children);
    return (0, _react.cloneElement)(child, _extends({}, props, arrowPosition, {
      // FIXME:不要使用props来转发下面两个参数
      positionLeft: positionLeft,
      positionTop: positionTop,
      className: (0, _classnames2["default"])(className, child.props.className),
      style: _extends({}, child.props.style, {
        left: positionLeft,
        top: positionTop
      })
    }));
  };

  return Position;
}(_react2["default"].Component);

Position.propTypes = propTypes;
Position.defaultProps = defaultProps;

exports["default"] = Position;
module.exports = exports['default'];