'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _offset = require('dom-helpers/query/offset');

var _offset2 = _interopRequireDefault(_offset);

var _requestAnimationFrame = require('dom-helpers/util/requestAnimationFrame');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tinperBeeCore = require('tinper-bee-core');

var _Affix = require('./Affix');

var _Affix2 = _interopRequireDefault(_Affix);

var _addEventListener = require('./utils/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _getContainer = require('./utils/getContainer');

var _getContainer2 = _interopRequireDefault(_getContainer);

var _getDocumentHeight = require('./utils/getDocumentHeight');

var _getDocumentHeight2 = _interopRequireDefault(_getDocumentHeight);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _ownerWindow = require('./utils/ownerWindow');

var _ownerWindow2 = _interopRequireDefault(_ownerWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = _extends({}, _Affix2["default"].propTypes, {
  /**
   * 容器组件
   */
  container: _propTypes2["default"].oneOfType([_tinperBeeCore.componentOrElement, _propTypes2["default"].func]),
  /**
   * 是否自适应宽度
   */
  autoWidth: _propTypes2["default"].bool
});

var defaultProps = {
  viewportOffsetTop: 0,
  autoWidth: true
};

/**
 * 对Affix进行包装，提供自动计算偏移量
 */

var AutoAffix = function (_Component) {
  _inherits(AutoAffix, _Component);

  function AutoAffix(props, context) {
    _classCallCheck(this, AutoAffix);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      offsetTop: null,
      offsetBottom: null,
      width: null
    };

    _this.onWindowScroll = _this.onWindowScroll.bind(_this);
    _this.onWindowResize = _this.onWindowResize.bind(_this);
    _this.onDocumentClick = _this.onDocumentClick.bind(_this);
    _this.onUpdate = _this.onUpdate.bind(_this);
    _this.updateState = _this.updateState.bind(_this);

    return _this;
  }

  AutoAffix.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this._isMounted = true;

    this._windowScrollListener = (0, _addEventListener2["default"])((0, _ownerWindow2["default"])(this), 'scroll', function () {
      return _this2.onWindowScroll();
    });

    this._windowResizeListener = (0, _addEventListener2["default"])((0, _ownerWindow2["default"])(this), 'resize', function () {
      return _this2.onWindowResize();
    });

    this._documentClickListener = (0, _addEventListener2["default"])((0, _ownerDocument2["default"])(this), 'click', function () {
      return _this2.onDocumentClick();
    });

    this.onUpdate();
  };

  AutoAffix.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    this._needPositionUpdate = true;
  };

  AutoAffix.prototype.componentDidUpdate = function componentDidUpdate() {
    if (this._needPositionUpdate) {
      this._needPositionUpdate = false;
      this.onUpdate();
    }
  };

  AutoAffix.prototype.componentWillUnmount = function componentWillUnmount() {
    this._isMounted = false;

    if (this._windowScrollListener) {
      this._windowScrollListener.remove();
    }
    if (this._documentClickListener) {
      this._documentClickListener.remove();
    }
    if (this._windowResizeListener) {
      this._windowResizeListener.remove();
    }
  };

  AutoAffix.prototype.onWindowScroll = function onWindowScroll() {
    this.onUpdate();
  };

  AutoAffix.prototype.onWindowResize = function onWindowResize() {
    var _this3 = this;

    if (this.props.autoWidth) {
      (0, _requestAnimationFrame2["default"])(function () {
        return _this3.onUpdate();
      });
    }
  };

  AutoAffix.prototype.onDocumentClick = function onDocumentClick() {
    var _this4 = this;

    (0, _requestAnimationFrame2["default"])(function () {
      return _this4.onUpdate();
    });
  };

  AutoAffix.prototype.onUpdate = function onUpdate() {
    if (!this._isMounted) {
      return;
    }

    var _getOffset = (0, _offset2["default"])(this.refs.positioner),
        offsetTop = _getOffset.top,
        width = _getOffset.width;

    var container = (0, _getContainer2["default"])(this.props.container);
    var offsetBottom = void 0;
    if (container) {
      var documentHeight = (0, _getDocumentHeight2["default"])((0, _ownerDocument2["default"])(this));

      var _getOffset2 = (0, _offset2["default"])(container),
          top = _getOffset2.top,
          height = _getOffset2.height;

      offsetBottom = documentHeight - top - height;
    } else {
      offsetBottom = null;
    }

    this.updateState(offsetTop, offsetBottom, width);
  };

  AutoAffix.prototype.updateState = function updateState(offsetTop, offsetBottom, width) {
    if (offsetTop === this.state.offsetTop && offsetBottom === this.state.offsetBottom && width === this.state.width) {
      return;
    }

    this.setState({ offsetTop: offsetTop, offsetBottom: offsetBottom, width: width });
  };

  AutoAffix.prototype.render = function render() {
    var _props = this.props,
        autoWidth = _props.autoWidth,
        viewportOffsetTop = _props.viewportOffsetTop,
        children = _props.children,
        props = _objectWithoutProperties(_props, ['autoWidth', 'viewportOffsetTop', 'children']);

    var _state = this.state,
        offsetTop = _state.offsetTop,
        offsetBottom = _state.offsetBottom,
        width = _state.width;


    delete props.container;

    var effectiveOffsetTop = Math.max(offsetTop, viewportOffsetTop || 0);

    var _props2 = this.props,
        affixStyle = _props2.affixStyle,
        bottomStyle = _props2.bottomStyle;

    if (autoWidth) {
      affixStyle = _extends({ width: width }, affixStyle);
      bottomStyle = _extends({ width: width }, bottomStyle);
    }

    return _react2["default"].createElement(
      'div',
      null,
      _react2["default"].createElement('div', { ref: 'positioner' }),
      _react2["default"].createElement(
        _Affix2["default"],
        _extends({}, props, {
          offsetTop: effectiveOffsetTop,
          viewportOffsetTop: viewportOffsetTop,
          offsetBottom: offsetBottom,
          affixStyle: affixStyle,
          bottomStyle: bottomStyle
        }),
        children
      )
    );
  };

  return AutoAffix;
}(_react.Component);

AutoAffix.propTypes = propTypes;

AutoAffix.defaultProps = defaultProps;

exports["default"] = AutoAffix;
module.exports = exports['default'];