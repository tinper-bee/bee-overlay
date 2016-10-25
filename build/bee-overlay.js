'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

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

/**
 * The `<Affix/>` component toggles `position: fixed;` on and off, emulating
 * the effect found with `position: sticky;`.
 */
var Affix = function (_React$Component) {
  _inherits(Affix, _React$Component);

  function Affix(props, context) {
    _classCallCheck(this, Affix);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.state = {
      affixed: 'top',
      position: null,
      top: null
    };

    _this._needPositionUpdate = false;
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

  Affix.prototype.onWindowScroll = function onWindowScroll() {
    this.onUpdate();
  };

  Affix.prototype.onDocumentClick = function onDocumentClick() {
    var _this3 = this;

    (0, _requestAnimationFrame2["default"])(function () {
      return _this3.onUpdate();
    });
  };

  Affix.prototype.onUpdate = function onUpdate() {
    var _this4 = this;

    if (!this._isMounted) {
      return;
    }

    var _props = this.props;
    var offsetTop = _props.offsetTop;
    var viewportOffsetTop = _props.viewportOffsetTop;

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
        // Setting position away from `fixed` can change the offset parent of
        // the affix, so we can't calculate the correct position until after
        // we've updated its position.
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

  Affix.prototype.updateStateAtBottom = function updateStateAtBottom() {
    var positionTopMax = this.getPositionTopMax();
    var offsetParent = (0, _offsetParent2["default"])(_reactDom2["default"].findDOMNode(this));
    var parentTop = (0, _offset2["default"])(offsetParent).top;

    this.updateState('bottom', 'absolute', positionTopMax - parentTop);
  };

  Affix.prototype.render = function render() {
    var child = _react2["default"].Children.only(this.props.children);
    var _child$props = child.props;
    var className = _child$props.className;
    var style = _child$props.style;
    var _state = this.state;
    var affixed = _state.affixed;
    var position = _state.position;
    var top = _state.top;

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
}(_react2["default"].Component);

Affix.propTypes = {
  /**
   * Pixels to offset from top of screen when calculating position
   */
  offsetTop: _react2["default"].PropTypes.number,

  /**
   * When affixed, pixels to offset from top of viewport
   */
  viewportOffsetTop: _react2["default"].PropTypes.number,

  /**
   * Pixels to offset from bottom of screen when calculating position
   */
  offsetBottom: _react2["default"].PropTypes.number,

  /**
   * CSS class or classes to apply when at top
   */
  topClassName: _react2["default"].PropTypes.string,

  /**
   * Style to apply when at top
   */
  topStyle: _react2["default"].PropTypes.object,

  /**
   * CSS class or classes to apply when affixed
   */
  affixClassName: _react2["default"].PropTypes.string,
  /**
   * Style to apply when affixed
   */
  affixStyle: _react2["default"].PropTypes.object,

  /**
   * CSS class or classes to apply when at bottom
   */
  bottomClassName: _react2["default"].PropTypes.string,

  /**
   * Style to apply when at bottom
   */
  bottomStyle: _react2["default"].PropTypes.object,

  /**
   * Callback fired when the right before the `affixStyle` and `affixStyle` props are rendered
   */
  onAffix: _react2["default"].PropTypes.func,
  /**
   * Callback fired after the component `affixStyle` and `affixClassName` props have been rendered.
   */
  onAffixed: _react2["default"].PropTypes.func,

  /**
   * Callback fired when the right before the `topStyle` and `topClassName` props are rendered
   */
  onAffixTop: _react2["default"].PropTypes.func,

  /**
   * Callback fired after the component `topStyle` and `topClassName` props have been rendered.
   */
  onAffixedTop: _react2["default"].PropTypes.func,

  /**
   * Callback fired when the right before the `bottomStyle` and `bottomClassName` props are rendered
   */
  onAffixBottom: _react2["default"].PropTypes.func,

  /**
   * Callback fired after the component `bottomStyle` and `bottomClassName` props have been rendered.
   */
  onAffixedBottom: _react2["default"].PropTypes.func
};

Affix.defaultProps = {
  offsetTop: 0,
  viewportOffsetTop: null,
  offsetBottom: 0
};

exports["default"] = Affix;
module.exports = exports['default'];
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

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

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

/**
 * The `<AutoAffix/>` component wraps `<Affix/>` to automatically calculate
 * offsets in many common cases.
 */
var AutoAffix = function (_React$Component) {
  _inherits(AutoAffix, _React$Component);

  function AutoAffix(props, context) {
    _classCallCheck(this, AutoAffix);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.state = {
      offsetTop: null,
      offsetBottom: null,
      width: null
    };
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

    var _getOffset = (0, _offset2["default"])(this.refs.positioner);

    var offsetTop = _getOffset.top;
    var width = _getOffset.width;


    var container = (0, _getContainer2["default"])(this.props.container);
    var offsetBottom = void 0;
    if (container) {
      var documentHeight = (0, _getDocumentHeight2["default"])((0, _ownerDocument2["default"])(this));

      var _getOffset2 = (0, _offset2["default"])(container);

      var top = _getOffset2.top;
      var height = _getOffset2.height;

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
    var _props = this.props;
    var autoWidth = _props.autoWidth;
    var viewportOffsetTop = _props.viewportOffsetTop;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['autoWidth', 'viewportOffsetTop', 'children']);

    var _state = this.state;
    var offsetTop = _state.offsetTop;
    var offsetBottom = _state.offsetBottom;
    var width = _state.width;


    delete props.container;

    var effectiveOffsetTop = Math.max(offsetTop, viewportOffsetTop || 0);

    var _props2 = this.props;
    var affixStyle = _props2.affixStyle;
    var bottomStyle = _props2.bottomStyle;

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
}(_react2["default"].Component);

AutoAffix.propTypes = _extends({}, _Affix2["default"].propTypes, {
  /**
   * The logical container node or component for determining offset from bottom
   * of viewport, or a function that returns it
   */
  container: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func]),
  /**
   * Automatically set width when affixed
   */
  autoWidth: _react2["default"].PropTypes.bool
});

// This intentionally doesn't inherit default props from `<Affix>`, so that the
// auto-calculated offsets can apply.
AutoAffix.defaultProps = {
  viewportOffsetTop: 0,
  autoWidth: true
};

exports["default"] = AutoAffix;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transition = exports.Position = exports.Portal = exports.Overlay = exports.Modal = exports.AutoAffix = exports.Affix = undefined;

var _Affix2 = require('./Affix');

var _Affix3 = _interopRequireDefault(_Affix2);

var _AutoAffix2 = require('./AutoAffix');

var _AutoAffix3 = _interopRequireDefault(_AutoAffix2);

var _Modal2 = require('./Modal');

var _Modal3 = _interopRequireDefault(_Modal2);

var _Overlay2 = require('./Overlay');

var _Overlay3 = _interopRequireDefault(_Overlay2);

var _Portal2 = require('./Portal');

var _Portal3 = _interopRequireDefault(_Portal2);

var _Position2 = require('./Position');

var _Position3 = _interopRequireDefault(_Position2);

var _Transition2 = require('./Transition');

var _Transition3 = _interopRequireDefault(_Transition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.Affix = _Affix3["default"];
exports.AutoAffix = _AutoAffix3["default"];
exports.Modal = _Modal3["default"];
exports.Overlay = _Overlay3["default"];
exports.Portal = _Portal3["default"];
exports.Position = _Position3["default"];
exports.Transition = _Transition3["default"];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*eslint-disable react/prop-types */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

var _elementType = require('react-prop-types/lib/elementType');

var _elementType2 = _interopRequireDefault(_elementType);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _ModalManager = require('./ModalManager');

var _ModalManager2 = _interopRequireDefault(_ModalManager);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _addEventListener = require('./utils/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _addFocusListener = require('./utils/addFocusListener');

var _addFocusListener2 = _interopRequireDefault(_addFocusListener);

var _inDOM = require('dom-helpers/util/inDOM');

var _inDOM2 = _interopRequireDefault(_inDOM);

var _activeElement = require('dom-helpers/activeElement');

var _activeElement2 = _interopRequireDefault(_activeElement);

var _contains = require('dom-helpers/query/contains');

var _contains2 = _interopRequireDefault(_contains);

var _getContainer = require('./utils/getContainer');

var _getContainer2 = _interopRequireDefault(_getContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var modalManager = new _ModalManager2["default"]();

/**
 * Love them or hate them, `<Modal/>` provides a solid foundation for creating dialogs, lightboxes, or whatever else.
 * The Modal component renders its `children` node in front of a backdrop component.
 *
 * The Modal offers a few helpful features over using just a `<Portal/>` component and some styles:
 *
 * - Manages dialog stacking when one-at-a-time just isn't enough.
 * - Creates a backdrop, for disabling interaction below the modal.
 * - It properly manages focus; moving to the modal content, and keeping it there until the modal is closed.
 * - It disables scrolling of the page content while open.
 * - Adds the appropriate ARIA roles are automatically.
 * - Easily pluggable animations via a `<Transition/>` component.
 *
 * Note that, in the same way the backdrop element prevents users from clicking or interacting
 * with the page content underneath the Modal, Screen readers also need to be signaled to not to
 * interact with page content while the Modal is open. To do this, we use a common technique of applying
 * the `aria-hidden='true'` attribute to the non-Modal elements in the Modal `container`. This means that for
 * a Modal to be truly modal, it should have a `container` that is _outside_ your app's
 * React hierarchy (such as the default: document.body).
 */
var Modal = _react2["default"].createClass({
  displayName: 'Modal',


  propTypes: _extends({}, _Portal2["default"].propTypes, {

    /**
     * Set the visibility of the Modal
     */
    show: _react2["default"].PropTypes.bool,

    /**
     * A Node, Component instance, or function that returns either. The Modal is appended to it's container element.
     *
     * For the sake of assistive technologies, the container should usually be the document body, so that the rest of the
     * page content can be placed behind a virtual backdrop as well as a visual one.
     */
    container: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func]),

    /**
     * A callback fired when the Modal is opening.
     */
    onShow: _react2["default"].PropTypes.func,

    /**
     * A callback fired when either the backdrop is clicked, or the escape key is pressed.
     *
     * The `onHide` callback only signals intent from the Modal,
     * you must actually set the `show` prop to `false` for the Modal to close.
     */
    onHide: _react2["default"].PropTypes.func,

    /**
     * Include a backdrop component.
     */
    backdrop: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.bool, _react2["default"].PropTypes.oneOf(['static'])]),

    /**
     * A function that returns a backdrop component. Useful for custom
     * backdrop rendering.
     *
     * ```js
     *  renderBackdrop={props => <MyBackdrop {...props} />}
     * ```
     */
    renderBackdrop: _react2["default"].PropTypes.func,

    /**
     * A callback fired when the escape key, if specified in `keyboard`, is pressed.
     */
    onEscapeKeyUp: _react2["default"].PropTypes.func,

    /**
     * A callback fired when the backdrop, if specified, is clicked.
     */
    onBackdropClick: _react2["default"].PropTypes.func,

    /**
     * A style object for the backdrop component.
     */
    backdropStyle: _react2["default"].PropTypes.object,

    /**
     * A css class or classes for the backdrop component.
     */
    backdropClassName: _react2["default"].PropTypes.string,

    /**
     * A css class or set of classes applied to the modal container when the modal is open,
     * and removed when it is closed.
     */
    containerClassName: _react2["default"].PropTypes.string,

    /**
     * Close the modal when escape key is pressed
     */
    keyboard: _react2["default"].PropTypes.bool,

    /**
     * A `<Transition/>` component to use for the dialog and backdrop components.
     */
    transition: _elementType2["default"],

    /**
     * The `timeout` of the dialog transition if specified. This number is used to ensure that
     * transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    dialogTransitionTimeout: _react2["default"].PropTypes.number,

    /**
     * The `timeout` of the backdrop transition if specified. This number is used to
     * ensure that transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    backdropTransitionTimeout: _react2["default"].PropTypes.number,

    /**
     * When `true` The modal will automatically shift focus to itself when it opens, and
     * replace it to the last focused element when it closes. This also
     * works correctly with any Modal children that have the `autoFocus` prop.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    autoFocus: _react2["default"].PropTypes.bool,

    /**
     * When `true` The modal will prevent focus from leaving the Modal while open.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    enforceFocus: _react2["default"].PropTypes.bool,

    /**
     * Callback fired before the Modal transitions in
     */
    onEnter: _react2["default"].PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition in
     */
    onEntering: _react2["default"].PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning in
     */
    onEntered: _react2["default"].PropTypes.func,

    /**
     * Callback fired right before the Modal transitions out
     */
    onExit: _react2["default"].PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition out
     */
    onExiting: _react2["default"].PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning out
     */
    onExited: _react2["default"].PropTypes.func,

    /**
     * A ModalManager instance used to track and manage the state of open
     * Modals. Useful when customizing how modals interact within a container
     */
    manager: _react2["default"].PropTypes.object.isRequired
  }),

  getDefaultProps: function getDefaultProps() {
    var noop = function noop() {};

    return {
      show: false,
      backdrop: true,
      keyboard: true,
      autoFocus: true,
      enforceFocus: true,
      onHide: noop,
      manager: modalManager,
      renderBackdrop: function renderBackdrop(props) {
        return _react2["default"].createElement('div', props);
      }
    };
  },
  getInitialState: function getInitialState() {
    return { exited: !this.props.show };
  },
  render: function render() {
    var _props = this.props;
    var show = _props.show;
    var container = _props.container;
    var children = _props.children;
    var Transition = _props.transition;
    var backdrop = _props.backdrop;
    var dialogTransitionTimeout = _props.dialogTransitionTimeout;
    var className = _props.className;
    var style = _props.style;
    var onExit = _props.onExit;
    var onExiting = _props.onExiting;
    var onEnter = _props.onEnter;
    var onEntering = _props.onEntering;
    var onEntered = _props.onEntered;


    var dialog = _react2["default"].Children.only(children);

    var mountModal = show || Transition && !this.state.exited;
    if (!mountModal) {
      return null;
    }

    var _dialog$props = dialog.props;
    var role = _dialog$props.role;
    var tabIndex = _dialog$props.tabIndex;


    if (role === undefined || tabIndex === undefined) {
      dialog = (0, _react.cloneElement)(dialog, {
        role: role === undefined ? 'document' : role,
        tabIndex: tabIndex == null ? '-1' : tabIndex
      });
    }

    if (Transition) {
      dialog = _react2["default"].createElement(
        Transition,
        {
          transitionAppear: true,
          unmountOnExit: true,
          'in': show,
          timeout: dialogTransitionTimeout,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.handleHidden,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered
        },
        dialog
      );
    }

    return _react2["default"].createElement(
      _Portal2["default"],
      {
        ref: this.setMountNode,
        container: container
      },
      _react2["default"].createElement(
        'div',
        {
          ref: 'modal',
          role: role || 'dialog',
          style: style,
          className: className
        },
        backdrop && this.renderBackdrop(),
        dialog
      )
    );
  },
  renderBackdrop: function renderBackdrop() {
    var _this = this;

    var _props2 = this.props;
    var backdropStyle = _props2.backdropStyle;
    var backdropClassName = _props2.backdropClassName;
    var renderBackdrop = _props2.renderBackdrop;
    var Transition = _props2.transition;
    var backdropTransitionTimeout = _props2.backdropTransitionTimeout;


    var backdropRef = function backdropRef(ref) {
      return _this.backdrop = ref;
    };

    var backdrop = _react2["default"].createElement('div', {
      ref: backdropRef,
      style: this.props.backdropStyle,
      className: this.props.backdropClassName,
      onClick: this.handleBackdropClick
    });

    if (Transition) {
      backdrop = _react2["default"].createElement(
        Transition,
        { transitionAppear: true,
          'in': this.props.show,
          timeout: backdropTransitionTimeout
        },
        renderBackdrop({
          ref: backdropRef,
          style: backdropStyle,
          className: backdropClassName,
          onClick: this.handleBackdropClick
        })
      );
    }

    return backdrop;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({ exited: false });
    } else if (!nextProps.transition) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({ exited: true });
    }
  },
  componentWillUpdate: function componentWillUpdate(nextProps) {
    if (!this.props.show && nextProps.show) {
      this.checkForFocus();
    }
  },
  componentDidMount: function componentDidMount() {
    if (this.props.show) {
      this.onShow();
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    var transition = this.props.transition;


    if (prevProps.show && !this.props.show && !transition) {
      // Otherwise handleHidden will call this.
      this.onHide();
    } else if (!prevProps.show && this.props.show) {
      this.onShow();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    var _props3 = this.props;
    var show = _props3.show;
    var transition = _props3.transition;


    if (show || transition && !this.state.exited) {
      this.onHide();
    }
  },
  onShow: function onShow() {
    var doc = (0, _ownerDocument2["default"])(this);
    var container = (0, _getContainer2["default"])(this.props.container, doc.body);

    this.props.manager.add(this, container, this.props.containerClassName);

    this._onDocumentKeyupListener = (0, _addEventListener2["default"])(doc, 'keyup', this.handleDocumentKeyUp);

    this._onFocusinListener = (0, _addFocusListener2["default"])(this.enforceFocus);

    this.focus();

    if (this.props.onShow) {
      this.props.onShow();
    }
  },
  onHide: function onHide() {
    this.props.manager.remove(this);

    this._onDocumentKeyupListener.remove();

    this._onFocusinListener.remove();

    this.restoreLastFocus();
  },
  setMountNode: function setMountNode(ref) {
    this.mountNode = ref ? ref.getMountNode() : ref;
  },
  handleHidden: function handleHidden() {
    this.setState({ exited: true });
    this.onHide();

    if (this.props.onExited) {
      var _props4;

      (_props4 = this.props).onExited.apply(_props4, arguments);
    }
  },
  handleBackdropClick: function handleBackdropClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (this.props.onBackdropClick) {
      this.props.onBackdropClick(e);
    }

    if (this.props.backdrop === true) {
      this.props.onHide();
    }
  },
  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
    if (this.props.keyboard && e.keyCode === 27 && this.isTopModal()) {
      if (this.props.onEscapeKeyUp) {
        this.props.onEscapeKeyUp(e);
      }
      this.props.onHide();
    }
  },
  checkForFocus: function checkForFocus() {
    if (_inDOM2["default"]) {
      this.lastFocus = (0, _activeElement2["default"])();
    }
  },
  focus: function focus() {
    var autoFocus = this.props.autoFocus;
    var modalContent = this.getDialogElement();
    var current = (0, _activeElement2["default"])((0, _ownerDocument2["default"])(this));
    var focusInModal = current && (0, _contains2["default"])(modalContent, current);

    if (modalContent && autoFocus && !focusInModal) {
      this.lastFocus = current;

      if (!modalContent.hasAttribute('tabIndex')) {
        modalContent.setAttribute('tabIndex', -1);
        (0, _warning2["default"])(false, 'The modal content node does not accept focus. ' + 'For the benefit of assistive technologies, the tabIndex of the node is being set to "-1".');
      }

      modalContent.focus();
    }
  },
  restoreLastFocus: function restoreLastFocus() {
    // Support: <=IE11 doesn't support `focus()` on svg elements (RB: #917)
    if (this.lastFocus && this.lastFocus.focus) {
      this.lastFocus.focus();
      this.lastFocus = null;
    }
  },
  enforceFocus: function enforceFocus() {
    var enforceFocus = this.props.enforceFocus;


    if (!enforceFocus || !this.isMounted() || !this.isTopModal()) {
      return;
    }

    var active = (0, _activeElement2["default"])((0, _ownerDocument2["default"])(this));
    var modal = this.getDialogElement();

    if (modal && modal !== active && !(0, _contains2["default"])(modal, active)) {
      modal.focus();
    }
  },


  //instead of a ref, which might conflict with one the parent applied.
  getDialogElement: function getDialogElement() {
    var node = this.refs.modal;
    return node && node.lastChild;
  },
  isTopModal: function isTopModal() {
    return this.props.manager.isTopModal(this);
  }
});

Modal.Manager = _ModalManager2["default"];

exports["default"] = Modal;
module.exports = exports['default'];
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

function findContainer(data, modal) {
  return findIndexOf(data, function (d) {
    return d.modals.indexOf(modal) !== -1;
  });
}

function setContainerStyle(state, container) {
  var style = { overflow: 'hidden' };

  // we are only interested in the actual `style` here
  // becasue we will override it
  state.style = {
    overflow: container.style.overflow,
    paddingRight: container.style.paddingRight
  };

  if (state.overflowing) {
    // use computed style, here to get the real padding
    // to add our scrollbar width
    style.paddingRight = parseInt((0, _style2["default"])(container, 'paddingRight') || 0, 10) + (0, _scrollbarSize2["default"])() + 'px';
  }

  (0, _style2["default"])(container, style);
}

function removeContainerStyle(_ref, container) {
  var style = _ref.style;


  Object.keys(style).forEach(function (key) {
    return container.style[key] = style[key];
  });
}
/**
 * Proper state managment for containers and the modals in those containers.
 *
 * @internal Used by the Modal to ensure proper styling of containers.
 */

var ModalManager = function () {
  function ModalManager() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref2$hideSiblingNode = _ref2.hideSiblingNodes;
    var hideSiblingNodes = _ref2$hideSiblingNode === undefined ? true : _ref2$hideSiblingNode;
    var _ref2$handleContainer = _ref2.handleContainerOverflow;
    var handleContainerOverflow = _ref2$handleContainer === undefined ? true : _ref2$handleContainer;

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

var _elementType = require('react-prop-types/lib/elementType');

var _elementType2 = _interopRequireDefault(_elementType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

/**
 * Built on top of `<Position/>` and `<Portal/>`, the overlay component is great for custom tooltip overlays.
 */
var Overlay = function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay(props, context) {
    _classCallCheck(this, Overlay);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

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

  Overlay.prototype.render = function render() {
    var _props = this.props;
    var container = _props.container;
    var containerPadding = _props.containerPadding;
    var target = _props.target;
    var placement = _props.placement;
    var shouldUpdatePosition = _props.shouldUpdatePosition;
    var rootClose = _props.rootClose;
    var children = _props.children;
    var Transition = _props.transition;

    var props = _objectWithoutProperties(_props, ['container', 'containerPadding', 'target', 'placement', 'shouldUpdatePosition', 'rootClose', 'children', 'transition']);

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
      { container: container, containerPadding: containerPadding, target: target, placement: placement, shouldUpdatePosition: shouldUpdatePosition },
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

  Overlay.prototype.handleHidden = function handleHidden() {
    this.setState({ exited: true });

    if (this.props.onExited) {
      var _props2;

      (_props2 = this.props).onExited.apply(_props2, arguments);
    }
  };

  return Overlay;
}(_react2["default"].Component);

Overlay.propTypes = _extends({}, _Portal2["default"].propTypes, _Position2["default"].propTypes, {

  /**
   * Set the visibility of the Overlay
   */
  show: _react2["default"].PropTypes.bool,

  /**
   * Specify whether the overlay should trigger `onHide` when the user clicks outside the overlay
   */
  rootClose: _react2["default"].PropTypes.bool,

  /**
   * A Callback fired by the Overlay when it wishes to be hidden.
   *
   * __required__ when `rootClose` is `true`.
   *
   * @type func
   */
  onHide: function onHide(props) {
    var propType = _react2["default"].PropTypes.func;
    if (props.rootClose) {
      propType = propType.isRequired;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return propType.apply(undefined, [props].concat(args));
  },


  /**
   * A `<Transition/>` component used to animate the overlay changes visibility.
   */
  transition: _elementType2["default"],

  /**
   * Callback fired before the Overlay transitions in
   */
  onEnter: _react2["default"].PropTypes.func,

  /**
   * Callback fired as the Overlay begins to transition in
   */
  onEntering: _react2["default"].PropTypes.func,

  /**
   * Callback fired after the Overlay finishes transitioning in
   */
  onEntered: _react2["default"].PropTypes.func,

  /**
   * Callback fired right before the Overlay transitions out
   */
  onExit: _react2["default"].PropTypes.func,

  /**
   * Callback fired as the Overlay begins to transition out
   */
  onExiting: _react2["default"].PropTypes.func,

  /**
   * Callback fired after the Overlay finishes transitioning out
   */
  onExited: _react2["default"].PropTypes.func
});

exports["default"] = Overlay;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _getContainer = require('./utils/getContainer');

var _getContainer2 = _interopRequireDefault(_getContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * The `<Portal/>` component renders its children into a new "subtree" outside of current component hierarchy.
 * You can think of it as a declarative `appendChild()`, or jQuery's `$.fn.appendTo()`.
 * The children of `<Portal/>` component will be appended to the `container` specified.
 */
var Portal = _react2["default"].createClass({

  displayName: 'Portal',

  propTypes: {
    /**
     * A Node, Component instance, or function that returns either. The `container` will have the Portal children
     * appended to it.
     */
    container: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func])
  },

  componentDidMount: function componentDidMount() {
    this._renderOverlay();
  },
  componentDidUpdate: function componentDidUpdate() {
    this._renderOverlay();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this._overlayTarget && nextProps.container !== this.props.container) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._portalContainerNode = (0, _getContainer2["default"])(nextProps.container, (0, _ownerDocument2["default"])(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this._unrenderOverlay();
    this._unmountOverlayTarget();
  },
  _mountOverlayTarget: function _mountOverlayTarget() {
    if (!this._overlayTarget) {
      this._overlayTarget = document.createElement('div');
      this._portalContainerNode = (0, _getContainer2["default"])(this.props.container, (0, _ownerDocument2["default"])(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },
  _unmountOverlayTarget: function _unmountOverlayTarget() {
    if (this._overlayTarget) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._overlayTarget = null;
    }
    this._portalContainerNode = null;
  },
  _renderOverlay: function _renderOverlay() {

    var overlay = !this.props.children ? null : _react2["default"].Children.only(this.props.children);

    // Save reference for future access.
    if (overlay !== null) {
      this._mountOverlayTarget();
      this._overlayInstance = _reactDom2["default"].unstable_renderSubtreeIntoContainer(this, overlay, this._overlayTarget);
    } else {
      // Unrender if the component is null for transitions to null
      this._unrenderOverlay();
      this._unmountOverlayTarget();
    }
  },
  _unrenderOverlay: function _unrenderOverlay() {
    if (this._overlayTarget) {
      _reactDom2["default"].unmountComponentAtNode(this._overlayTarget);
      this._overlayInstance = null;
    }
  },
  render: function render() {
    return null;
  },
  getMountNode: function getMountNode() {
    return this._overlayTarget;
  },
  getOverlayDOMNode: function getOverlayDOMNode() {
    if (!this.isMounted()) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
    }

    if (this._overlayInstance) {
      return _reactDom2["default"].findDOMNode(this._overlayInstance);
    }

    return null;
  }
});

exports["default"] = Portal;
module.exports = exports['default'];
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

/**
 * The Position component calculates the coordinates for its child, to position
 * it relative to a `target` component or node. Useful for creating callouts
 * and tooltips, the Position component injects a `style` props with `left` and
 * `top` values for positioning your component.
 *
 * It also injects "arrow" `left`, and `top` values for styling callout arrows
 * for giving your components a sense of directionality.
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
      // FIXME: Don't forward `positionLeft` and `positionTop` via both props
      // and `props.style`.
      positionLeft: positionLeft,
      positionTop: positionTop,
      className: (0, _classnames2["default"])(className, child.props.className),
      style: _extends({}, child.props.style, {
        left: positionLeft,
        top: positionTop
      })
    }));
  };

  Position.prototype.getTarget = function getTarget() {
    var target = this.props.target;

    var targetElement = typeof target === 'function' ? target() : target;
    return targetElement && _reactDom2["default"].findDOMNode(targetElement) || null;
  };

  Position.prototype.maybeUpdatePosition = function maybeUpdatePosition(placementChanged) {
    var target = this.getTarget();

    if (!this.props.shouldUpdatePosition && target === this._lastTarget && !placementChanged) {
      return;
    }

    this.updatePosition(target);
  };

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

  return Position;
}(_react2["default"].Component);

Position.propTypes = {
  /**
   * A node, element, or function that returns either. The child will be
   * be positioned next to the `target` specified.
   */
  target: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func]),

  /**
   * "offsetParent" of the component
   */
  container: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func]),
  /**
   * Minimum spacing in pixels between container border and component border
   */
  containerPadding: _react2["default"].PropTypes.number,
  /**
   * How to position the component relative to the target
   */
  placement: _react2["default"].PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  /**
   * Whether the position should be changed on each update
   */
  shouldUpdatePosition: _react2["default"].PropTypes.bool
};

Position.displayName = 'Position';

Position.defaultProps = {
  containerPadding: 0,
  placement: 'right',
  shouldUpdatePosition: false
};

exports["default"] = Position;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _contains = require('dom-helpers/query/contains');

var _contains2 = _interopRequireDefault(_contains);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
  onRootClose: _react.PropTypes.func,
  children: _react.PropTypes.element,

  /**
   * Disable the the RootCloseWrapper, preventing it from triggering
   * `onRootClose`.
   */
  disabled: _react.PropTypes.bool,
  /**
   * Choose which document mouse event to bind to
   */
  event: _react.PropTypes.oneOf(['click', 'mousedown'])
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

    // Use capture for this listener so it fires before React's listener, to
    // avoid false positives in the contains() check below if the target DOM
    // element is removed in the React mouse callback.
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXITING = exports.ENTERED = exports.ENTERING = exports.EXITED = exports.UNMOUNTED = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _properties = require('dom-helpers/transition/properties');

var _properties2 = _interopRequireDefault(_properties);

var _on = require('dom-helpers/events/on');

var _on2 = _interopRequireDefault(_on);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var transitionEndEvent = _properties2["default"].end;

var UNMOUNTED = exports.UNMOUNTED = 0;
var EXITED = exports.EXITED = 1;
var ENTERING = exports.ENTERING = 2;
var ENTERED = exports.ENTERED = 3;
var EXITING = exports.EXITING = 4;

/**
 * The Transition component lets you define and run css transitions with a simple declarative api.
 * It works similar to React's own [CSSTransitionGroup](http://facebook.github.io/react/docs/animation.html#high-level-api-reactcsstransitiongroup)
 * but is specifically optimized for transitioning a single child "in" or "out".
 *
 * You don't even need to use class based css transitions if you don't want to (but it is easiest).
 * The extensive set of lifecyle callbacks means you have control over
 * the transitioning now at each step of the way.
 */

var Transition = function (_React$Component) {
  _inherits(Transition, _React$Component);

  function Transition(props, context) {
    _classCallCheck(this, Transition);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    var initialStatus = void 0;
    if (props["in"]) {
      // Start enter transition in componentDidMount.
      initialStatus = props.transitionAppear ? EXITED : ENTERED;
    } else {
      initialStatus = props.unmountOnExit ? UNMOUNTED : EXITED;
    }
    _this.state = { status: initialStatus };

    _this.nextCallback = null;
    return _this;
  }

  Transition.prototype.componentDidMount = function componentDidMount() {
    if (this.props.transitionAppear && this.props["in"]) {
      this.performEnter(this.props);
    }
  };

  Transition.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps["in"] && this.props.unmountOnExit) {
      if (this.state.status === UNMOUNTED) {
        // Start enter transition in componentDidUpdate.
        this.setState({ status: EXITED });
      }
    } else {
      this._needsUpdate = true;
    }
  };

  Transition.prototype.componentDidUpdate = function componentDidUpdate() {
    var status = this.state.status;

    if (this.props.unmountOnExit && status === EXITED) {
      // EXITED is always a transitional state to either ENTERING or UNMOUNTED
      // when using unmountOnExit.
      if (this.props["in"]) {
        this.performEnter(this.props);
      } else {
        this.setState({ status: UNMOUNTED });
      }

      return;
    }

    // guard ensures we are only responding to prop changes
    if (this._needsUpdate) {
      this._needsUpdate = false;

      if (this.props["in"]) {
        if (status === EXITING) {
          this.performEnter(this.props);
        } else if (status === EXITED) {
          this.performEnter(this.props);
        }
        // Otherwise we're already entering or entered.
      } else {
        if (status === ENTERING || status === ENTERED) {
          this.performExit(this.props);
        }
        // Otherwise we're already exited or exiting.
      }
    }
  };

  Transition.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };

  Transition.prototype.performEnter = function performEnter(props) {
    var _this2 = this;

    this.cancelNextCallback();
    var node = _reactDom2["default"].findDOMNode(this);

    // Not this.props, because we might be about to receive new props.
    props.onEnter(node);

    this.safeSetState({ status: ENTERING }, function () {
      _this2.props.onEntering(node);

      _this2.onTransitionEnd(node, function () {
        _this2.safeSetState({ status: ENTERED }, function () {
          _this2.props.onEntered(node);
        });
      });
    });
  };

  Transition.prototype.performExit = function performExit(props) {
    var _this3 = this;

    this.cancelNextCallback();
    var node = _reactDom2["default"].findDOMNode(this);

    // Not this.props, because we might be about to receive new props.
    props.onExit(node);

    this.safeSetState({ status: EXITING }, function () {
      _this3.props.onExiting(node);

      _this3.onTransitionEnd(node, function () {
        _this3.safeSetState({ status: EXITED }, function () {
          _this3.props.onExited(node);
        });
      });
    });
  };

  Transition.prototype.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };

  Transition.prototype.safeSetState = function safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    this.setState(nextState, this.setNextCallback(callback));
  };

  Transition.prototype.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;

    var active = true;

    this.nextCallback = function (event) {
      if (active) {
        active = false;
        _this4.nextCallback = null;

        callback(event);
      }
    };

    this.nextCallback.cancel = function () {
      active = false;
    };

    return this.nextCallback;
  };

  Transition.prototype.onTransitionEnd = function onTransitionEnd(node, handler) {
    this.setNextCallback(handler);

    if (node) {
      (0, _on2["default"])(node, transitionEndEvent, this.nextCallback);
      setTimeout(this.nextCallback, this.props.timeout);
    } else {
      setTimeout(this.nextCallback, 0);
    }
  };

  Transition.prototype.render = function render() {
    var status = this.state.status;
    if (status === UNMOUNTED) {
      return null;
    }

    var _props = this.props;
    var children = _props.children;
    var className = _props.className;

    var childProps = _objectWithoutProperties(_props, ['children', 'className']);

    Object.keys(Transition.propTypes).forEach(function (key) {
      return delete childProps[key];
    });

    var transitionClassName = void 0;
    if (status === EXITED) {
      transitionClassName = this.props.exitedClassName;
    } else if (status === ENTERING) {
      transitionClassName = this.props.enteringClassName;
    } else if (status === ENTERED) {
      transitionClassName = this.props.enteredClassName;
    } else if (status === EXITING) {
      transitionClassName = this.props.exitingClassName;
    }

    var child = _react2["default"].Children.only(children);
    return _react2["default"].cloneElement(child, _extends({}, childProps, {
      className: (0, _classnames2["default"])(child.props.className, className, transitionClassName)
    }));
  };

  return Transition;
}(_react2["default"].Component);

Transition.propTypes = {
  /**
   * Show the component; triggers the enter or exit animation
   */
  "in": _react2["default"].PropTypes.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is not shown
   */
  unmountOnExit: _react2["default"].PropTypes.bool,

  /**
   * Run the enter animation when the component mounts, if it is initially
   * shown
   */
  transitionAppear: _react2["default"].PropTypes.bool,

  /**
   * A Timeout for the animation, in milliseconds, to ensure that a node doesn't
   * transition indefinately if the browser transitionEnd events are
   * canceled or interrupted.
   *
   * By default this is set to a high number (5 seconds) as a failsafe. You should consider
   * setting this to the duration of your animation (or a bit above it).
   */
  timeout: _react2["default"].PropTypes.number,

  /**
   * CSS class or classes applied when the component is exited
   */
  exitedClassName: _react2["default"].PropTypes.string,
  /**
   * CSS class or classes applied while the component is exiting
   */
  exitingClassName: _react2["default"].PropTypes.string,
  /**
   * CSS class or classes applied when the component is entered
   */
  enteredClassName: _react2["default"].PropTypes.string,
  /**
   * CSS class or classes applied while the component is entering
   */
  enteringClassName: _react2["default"].PropTypes.string,

  /**
   * Callback fired before the "entering" classes are applied
   */
  onEnter: _react2["default"].PropTypes.func,
  /**
   * Callback fired after the "entering" classes are applied
   */
  onEntering: _react2["default"].PropTypes.func,
  /**
   * Callback fired after the "enter" classes are applied
   */
  onEntered: _react2["default"].PropTypes.func,
  /**
   * Callback fired before the "exiting" classes are applied
   */
  onExit: _react2["default"].PropTypes.func,
  /**
   * Callback fired after the "exiting" classes are applied
   */
  onExiting: _react2["default"].PropTypes.func,
  /**
   * Callback fired after the "exited" classes are applied
   */
  onExited: _react2["default"].PropTypes.func
};

// Name the function so it is clearer in the documentation
function noop() {}

Transition.displayName = 'Transition';

Transition.defaultProps = {
  "in": false,
  unmountOnExit: false,
  transitionAppear: false,

  timeout: 5000,

  onEnter: noop,
  onEntering: noop,
  onEntered: noop,

  onExit: noop,
  onExiting: noop,
  onExited: noop
};

exports["default"] = Transition;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (node, event, handler, capture) {
  (0, _on2["default"])(node, event, handler, capture);

  return {
    remove: function remove() {
      (0, _off2["default"])(node, event, handler, capture);
    }
  };
};

var _on = require('dom-helpers/events/on');

var _on2 = _interopRequireDefault(_on);

var _off = require('dom-helpers/events/off');

var _off2 = _interopRequireDefault(_off);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = addFocusListener;
/**
 * Firefox doesn't have a focusin event so using capture is easiest way to get bubbling
 * IE8 can't do addEventListener, but does have onfocusin, so we use that in ie8
 *
 * We only allow one Listener at a time to avoid stack overflows
 */
function addFocusListener(handler) {
  var useFocusin = !document.addEventListener;
  var remove = void 0;

  if (useFocusin) {
    document.attachEvent('onfocusin', handler);
    remove = function remove() {
      return document.detachEvent('onfocusin', handler);
    };
  } else {
    document.addEventListener('focus', handler, true);
    remove = function remove() {
      return document.removeEventListener('focus', handler, true);
    };
  }

  return { remove: remove };
}
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = calculatePosition;

var _offset = require('dom-helpers/query/offset');

var _offset2 = _interopRequireDefault(_offset);

var _position = require('dom-helpers/query/position');

var _position2 = _interopRequireDefault(_position);

var _scrollTop = require('dom-helpers/query/scrollTop');

var _scrollTop2 = _interopRequireDefault(_scrollTop);

var _ownerDocument = require('./ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getContainerDimensions(containerNode) {
  var width = void 0,
      height = void 0,
      scroll = void 0;

  if (containerNode.tagName === 'BODY') {
    width = window.innerWidth;
    height = window.innerHeight;

    scroll = (0, _scrollTop2["default"])((0, _ownerDocument2["default"])(containerNode).documentElement) || (0, _scrollTop2["default"])(containerNode);
  } else {
    var _getOffset = (0, _offset2["default"])(containerNode);

    width = _getOffset.width;
    height = _getOffset.height;

    scroll = (0, _scrollTop2["default"])(containerNode);
  }

  return { width: width, height: height, scroll: scroll };
}

function getTopDelta(top, overlayHeight, container, padding) {
  var containerDimensions = getContainerDimensions(container);
  var containerScroll = containerDimensions.scroll;
  var containerHeight = containerDimensions.height;

  var topEdgeOffset = top - padding - containerScroll;
  var bottomEdgeOffset = top + padding - containerScroll + overlayHeight;

  if (topEdgeOffset < 0) {
    return -topEdgeOffset;
  } else if (bottomEdgeOffset > containerHeight) {
    return containerHeight - bottomEdgeOffset;
  } else {
    return 0;
  }
}

function getLeftDelta(left, overlayWidth, container, padding) {
  var containerDimensions = getContainerDimensions(container);
  var containerWidth = containerDimensions.width;

  var leftEdgeOffset = left - padding;
  var rightEdgeOffset = left + padding + overlayWidth;

  if (leftEdgeOffset < 0) {
    return -leftEdgeOffset;
  } else if (rightEdgeOffset > containerWidth) {
    return containerWidth - rightEdgeOffset;
  }

  return 0;
}

function calculatePosition(placement, overlayNode, target, container, padding) {
  var childOffset = container.tagName === 'BODY' ? (0, _offset2["default"])(target) : (0, _position2["default"])(target, container);

  var _getOffset2 = (0, _offset2["default"])(overlayNode);

  var overlayHeight = _getOffset2.height;
  var overlayWidth = _getOffset2.width;


  var positionLeft = void 0,
      positionTop = void 0,
      arrowOffsetLeft = void 0,
      arrowOffsetTop = void 0;

  if (placement === 'left' || placement === 'right') {
    positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;

    if (placement === 'left') {
      positionLeft = childOffset.left - overlayWidth;
    } else {
      positionLeft = childOffset.left + childOffset.width;
    }

    var topDelta = getTopDelta(positionTop, overlayHeight, container, padding);

    positionTop += topDelta;
    arrowOffsetTop = 50 * (1 - 2 * topDelta / overlayHeight) + '%';
    arrowOffsetLeft = void 0;
  } else if (placement === 'top' || placement === 'bottom') {
    positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;

    if (placement === 'top') {
      positionTop = childOffset.top - overlayHeight;
    } else {
      positionTop = childOffset.top + childOffset.height;
    }

    var leftDelta = getLeftDelta(positionLeft, overlayWidth, container, padding);

    positionLeft += leftDelta;
    arrowOffsetLeft = 50 * (1 - 2 * leftDelta / overlayWidth) + '%';
    arrowOffsetTop = void 0;
  } else {
    throw new Error('calcOverlayPosition(): No such placement of "' + placement + '" found.');
  }

  return { positionLeft: positionLeft, positionTop: positionTop, arrowOffsetLeft: arrowOffsetLeft, arrowOffsetTop: arrowOffsetTop };
}
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
function createChainedFunction() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return funcs.filter(function (f) {
    return f != null;
  }).reduce(function (acc, f) {
    if (typeof f !== 'function') {
      throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
    }

    if (acc === null) {
      return f;
    }

    return function chainedFunction() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      acc.apply(this, args);
      f.apply(this, args);
    };
  }, null);
}

exports["default"] = createChainedFunction;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getContainer;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getContainer(container, defaultContainer) {
  container = typeof container === 'function' ? container() : container;
  return _reactDom2["default"].findDOMNode(container) || defaultContainer;
}
module.exports = exports['default'];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (doc) {
  return Math.max(doc.documentElement.offsetHeight || 0, doc.height || 0, doc.body.scrollHeight || 0, doc.body.offsetHeight || 0);
};

module.exports = exports["default"]; /**
                                      * Get the height of the document
                                      *
                                      * @returns {documentHeight: number}
                                      */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isOverflowing;

var _isWindow = require('dom-helpers/query/isWindow');

var _isWindow2 = _interopRequireDefault(_isWindow);

var _ownerDocument = require('dom-helpers/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isBody(node) {
  return node && node.tagName.toLowerCase() === 'body';
}

function bodyIsOverflowing(node) {
  var doc = (0, _ownerDocument2["default"])(node);
  var win = (0, _isWindow2["default"])(doc);
  var fullWidth = win.innerWidth;

  // Support: ie8, no innerWidth
  if (!fullWidth) {
    var documentElementRect = doc.documentElement.getBoundingClientRect();
    fullWidth = documentElementRect.right - Math.abs(documentElementRect.left);
  }

  return doc.body.clientWidth < fullWidth;
}

function isOverflowing(container) {
  var win = (0, _isWindow2["default"])(container);

  return win || isBody(container) ? bodyIsOverflowing(container) : container.scrollHeight > container.clientHeight;
}
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ariaHidden = ariaHidden;
exports.hideSiblings = hideSiblings;
exports.showSiblings = showSiblings;

var BLACKLIST = ['template', 'script', 'style'];

var isHidable = function isHidable(_ref) {
  var nodeType = _ref.nodeType;
  var tagName = _ref.tagName;
  return nodeType === 1 && BLACKLIST.indexOf(tagName.toLowerCase()) === -1;
};

var siblings = function siblings(container, mount, cb) {
  mount = [].concat(mount);

  [].forEach.call(container.children, function (node) {
    if (mount.indexOf(node) === -1 && isHidable(node)) {
      cb(node);
    }
  });
};

function ariaHidden(show, node) {
  if (!node) {
    return;
  }
  if (show) {
    node.setAttribute('aria-hidden', 'true');
  } else {
    node.removeAttribute('aria-hidden');
  }
}

function hideSiblings(container, mountNode) {
  siblings(container, mountNode, function (node) {
    return ariaHidden(true, node);
  });
}

function showSiblings(container, mountNode) {
  siblings(container, mountNode, function (node) {
    return ariaHidden(false, node);
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (componentOrElement) {
  return (0, _ownerDocument2["default"])(_reactDom2["default"].findDOMNode(componentOrElement));
};

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ownerDocument = require('dom-helpers/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (componentOrElement) {
  return (0, _ownerWindow2["default"])(_reactDom2["default"].findDOMNode(componentOrElement));
};

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ownerWindow = require('dom-helpers/ownerWindow');

var _ownerWindow2 = _interopRequireDefault(_ownerWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = exports['default'];