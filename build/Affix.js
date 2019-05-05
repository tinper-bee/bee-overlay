'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _height = require('dom-helpers/query/height');

var _height2 = _interopRequireDefault(_height);

var _offset = require('dom-helpers/query/offset');

var _offset2 = _interopRequireDefault(_offset);

var _offsetParent = require('dom-helpers/query/offsetParent');

var _offsetParent2 = _interopRequireDefault(_offsetParent);

var _scrollTop = require('dom-helpers/query/scrollTop');

var _scrollTop2 = _interopRequireDefault(_scrollTop);

var _requestAnimationFrame = require('dom-helpers/util/requestAnimationFrame');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _addEventListener = require('./utils/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _getDocumentHeight = require('./utils/getDocumentHeight');

var _getDocumentHeight2 = _interopRequireDefault(_getDocumentHeight);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _ownerWindow = require('./utils/ownerWindow');

var _ownerWindow2 = _interopRequireDefault(_ownerWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = {
  /**
   * 到屏幕顶部偏移的像素
   */
  offsetTop: _propTypes2["default"].number,

  /**
   * 添加时,到窗口的偏移像素
   */
  viewportOffsetTop: _propTypes2["default"].number,

  /**
   * 到屏幕的底部的偏移像素
   */
  offsetBottom: _propTypes2["default"].number,

  /**
   * 在顶部时添加的class
   */
  topClassName: _propTypes2["default"].string,

  /**
   * 在顶部添加的style
   */
  topStyle: _propTypes2["default"].object,

  /**
   * 当固定定位时，添加的class
   */
  affixClassName: _propTypes2["default"].string,
  /**
   * 当固定定位时，添加的style
   */
  affixStyle: _propTypes2["default"].object,

  /**
   * 在底部时添加的class
   */
  bottomClassName: _propTypes2["default"].string,

  /**
   * 在底部时添加的style
   */
  bottomStyle: _propTypes2["default"].object,

  /**
   * 在affixstyle和affixClassName添加之前的钩子函数
   */
  onAffix: _propTypes2["default"].func,
  /**
   * 在affixstyle和affixClassName添加之后的钩子函数
   */
  onAffixed: _propTypes2["default"].func,

  /**
   * 在topStyle和topClassName添加之前的钩子函数
   */
  onAffixTop: _propTypes2["default"].func,

  /**
   * 在topStyle和topClassName添加之后的钩子函数
   */
  onAffixedTop: _propTypes2["default"].func,

  /**
   * 在bottomStyle和bottomClassName添加之前的钩子函数
   */
  onAffixBottom: _propTypes2["default"].func,

  /**
   * 在bottomStyle和bottomClassName添加之后的钩子函数
   */
  onAffixedBottom: _propTypes2["default"].func
};

var defaultProps = {
  offsetTop: 0,
  viewportOffsetTop: null,
  offsetBottom: 0
};

/**
 * Affix组件是用来提供fixed定位,并在顶部和顶部将定位转化为absoluted
 */

var Affix = function (_Component) {
  _inherits(Affix, _Component);

  function Affix(props, context) {
    _classCallCheck(this, Affix);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      affixed: 'top',
      position: null,
      top: null
    };

    _this._needPositionUpdate = false;

    _this.onWindowScroll = _this.onWindowScroll.bind(_this);
    _this.onDocumentClick = _this.onDocumentClick.bind(_this);
    _this.onUpdate = _this.onUpdate.bind(_this);
    _this.getPositionTopMax = _this.getPositionTopMax.bind(_this);
    _this.updateState = _this.updateState.bind(_this);
    _this.updateStateAtBottom = _this.updateStateAtBottom.bind(_this);
    return _this;
  }

  Affix.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this._isMounted = true;

    this._windowScrollListener = (0, _addEventListener2["default"])((0, _ownerWindow2["default"])(this), 'scroll', function () {
      return _this2.onWindowScroll();
    });
    this._documentClickListener = (0, _addEventListener2["default"])((0, _ownerDocument2["default"])(this), 'click', function () {
      return _this2.onDocumentClick();
    });

    this.onUpdate();
  };

  Affix.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    this._needPositionUpdate = true;
  };

  Affix.prototype.componentDidUpdate = function componentDidUpdate() {
    if (this._needPositionUpdate) {
      this._needPositionUpdate = false;
      this.onUpdate();
    }
  };

  Affix.prototype.componentWillUnmount = function componentWillUnmount() {
    this._isMounted = false;

    if (this._windowScrollListener) {
      this._windowScrollListener.remove();
    }
    if (this._documentClickListener) {
      this._documentClickListener.remove();
    }
  };
  /**
   * 屏幕滑动时更新
  **/


  Affix.prototype.onWindowScroll = function onWindowScroll() {
    this.onUpdate();
  };
  /**
   * 屏幕点击时更新
  **/


  Affix.prototype.onDocumentClick = function onDocumentClick() {
    var _this3 = this;

    (0, _requestAnimationFrame2["default"])(function () {
      return _this3.onUpdate();
    });
  };
  //更新位置时状态的更新


  Affix.prototype.onUpdate = function onUpdate() {
    var _this4 = this;

    if (!this._isMounted) {
      return;
    }

    var _props = this.props,
        offsetTop = _props.offsetTop,
        viewportOffsetTop = _props.viewportOffsetTop;

    var scrollTop = (0, _scrollTop2["default"])((0, _ownerWindow2["default"])(this));
    var positionTopMin = scrollTop + (viewportOffsetTop || 0);

    if (positionTopMin <= offsetTop) {
      this.updateState('top', null, null);
      return;
    }

    if (positionTopMin > this.getPositionTopMax()) {
      if (this.state.affixed === 'bottom') {
        this.updateStateAtBottom();
      } else {
        // 设置位置远离“fixed”可以更改affix的偏移父对象，所以我们不能在更新其位置之后计算正确的位置。
        this.setState({
          affixed: 'bottom',
          position: 'absolute',
          top: null
        }, function () {
          if (!_this4._isMounted) {
            return;
          }

          _this4.updateStateAtBottom();
        });
      }
      return;
    }

    this.updateState('affix', 'fixed', viewportOffsetTop);
  };

  Affix.prototype.getPositionTopMax = function getPositionTopMax() {
    var documentHeight = (0, _getDocumentHeight2["default"])((0, _ownerDocument2["default"])(this));
    var height = (0, _height2["default"])(_reactDom2["default"].findDOMNode(this));

    return documentHeight - height - this.props.offsetBottom;
  };

  Affix.prototype.updateState = function updateState(affixed, position, top) {
    var _this5 = this;

    if (affixed === this.state.affixed && position === this.state.position && top === this.state.top) {
      return;
    }

    var upperName = affixed === 'affix' ? '' : affixed.charAt(0).toUpperCase() + affixed.substr(1);

    if (this.props['onAffix' + upperName]) {
      this.props['onAffix' + upperName]();
    }

    this.setState({ affixed: affixed, position: position, top: top }, function () {
      if (_this5.props['onAffixed' + upperName]) {
        _this5.props['onAffixed' + upperName]();
      }
    });
  };
  //在底部时的更新函数


  Affix.prototype.updateStateAtBottom = function updateStateAtBottom() {
    var positionTopMax = this.getPositionTopMax();
    var offsetParent = (0, _offsetParent2["default"])(_reactDom2["default"].findDOMNode(this));
    var parentTop = (0, _offset2["default"])(offsetParent).top;

    this.updateState('bottom', 'absolute', positionTopMax - parentTop);
  };

  Affix.prototype.render = function render() {
    var child = _react2["default"].Children.only(this.props.children);
    var _child$props = child.props,
        className = _child$props.className,
        style = _child$props.style;
    var _state = this.state,
        affixed = _state.affixed,
        position = _state.position,
        top = _state.top;

    var positionStyle = { position: position, top: top };

    var affixClassName = void 0;
    var affixStyle = void 0;
    if (affixed === 'top') {
      affixClassName = this.props.topClassName;
      affixStyle = this.props.topStyle;
    } else if (affixed === 'bottom') {
      affixClassName = this.props.bottomClassName;
      affixStyle = this.props.bottomStyle;
    } else {
      affixClassName = this.props.affixClassName;
      affixStyle = this.props.affixStyle;
    }

    return _react2["default"].cloneElement(child, {
      className: (0, _classnames2["default"])(affixClassName, className),
      style: _extends({}, positionStyle, affixStyle, style)
    });
  };

  return Affix;
}(_react.Component);

Affix.propTypes = propTypes;

Affix.defaultProps = defaultProps;

exports["default"] = Affix;
module.exports = exports['default'];