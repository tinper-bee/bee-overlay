'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _contains = require('dom-helpers/query/contains');

var _contains2 = _interopRequireDefault(_contains);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _Overlay = require('./Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _createChainedFunction = require('./utils/createChainedFunction');

var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var isReact16 = _reactDom2["default"].createPortal !== undefined;
var createPortal = isReact16 ? _reactDom2["default"].createPortal : _reactDom2["default"].unstable_renderSubtreeIntoContainer;

/**
 * 检查值是属于这个值，还是等于这个值
 *
 * @param {string} one
 * @param {string|array} of
 * @returns {boolean}
 */
function isOneOf(one, of) {
    if (Array.isArray(of)) {
        return of.indexOf(one) >= 0;
    }
    return one === of;
}

var triggerType = _propTypes2["default"].oneOf(['click', 'hover', 'focus']);

var propTypes = _extends({}, _Portal2["default"].propTypes, _Overlay2["default"].propTypes, {

    /**
     * 指定哪些操作或操作触发叠加层可见性
     */
    trigger: _propTypes2["default"].oneOfType([triggerType, _propTypes2["default"].arrayOf(triggerType)]),

    /**
     * 显示和隐藏覆盖一旦触发的毫秒延迟量
     */
    delay: _propTypes2["default"].number,
    /**
     * 触发后显示叠加层之前的延迟毫秒
     */
    delayShow: _propTypes2["default"].number,
    /**
     * 触发后隐藏叠加层的延迟毫秒
     */
    delayHide: _propTypes2["default"].number,

    // FIXME: This should be `defaultShow`.
    /**
     * 覆盖的初始可见性状态。对于更细微的可见性控制，请考虑直接使用覆盖组件。
     */
    defaultOverlayShown: _propTypes2["default"].bool,
    visible: _propTypes2["default"].bool,

    /**
     * 要覆盖在目标旁边的元素或文本。
     */
    overlay: _propTypes2["default"].node.isRequired,

    /**
     * @private
     */
    onBlur: _propTypes2["default"].func,
    /**
     * @private
     */
    onClick: _propTypes2["default"].func,
    /**
     * @private
     */
    onFocus: _propTypes2["default"].func,
    /**
     * @private
     */
    onMouseOut: _propTypes2["default"].func,
    /**
     * @private
     */
    onMouseOver: _propTypes2["default"].func,

    // Overridden props from `<Overlay>`.
    /**
     * @private
     */
    target: _propTypes2["default"].oneOf([null]),
    /**
     * @private
     */
    onHide: _propTypes2["default"].func,
    /**
     * @private
     */
    show: _propTypes2["default"].bool
});

var defaultProps = {
    defaultOverlayShown: false,
    trigger: ['hover', 'focus']
};

var OverlayTrigger = function (_Component) {
    _inherits(OverlayTrigger, _Component);

    function OverlayTrigger(props, context) {
        _classCallCheck(this, OverlayTrigger);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.handleToggle = _this.handleToggle.bind(_this);
        _this.handleDelayedShow = _this.handleDelayedShow.bind(_this);
        _this.handleDelayedHide = _this.handleDelayedHide.bind(_this);
        _this.handleHide = _this.handleHide.bind(_this);
        _this.makeOverlay = _this.makeOverlay.bind(_this);

        _this.handleMouseOver = function (e) {
            return _this.handleMouseOverOut(_this.handleDelayedShow, e);
        };
        _this.handleMouseOut = function (e) {
            return _this.handleMouseOverOut(_this.handleDelayedHide, e);
        };

        _this._mountNode = null;

        var visible = void 0;
        if ('visible' in props) {
            visible = !!props.visible;
        } else {
            visible = !!props.defaultOverlayShown;
        }

        _this.state = {
            show: visible
        };
        return _this;
    }

    OverlayTrigger.prototype.componentDidMount = function componentDidMount() {
        this._mountNode = document.createElement('div');
        !isReact16 && this.renderOverlay();
    };

    OverlayTrigger.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        !isReact16 && this.renderOverlay();
        if ('visible' in this.props && prevProps.visible !== this.props.visible) {
            this.setState({
                show: this.props.visible
            });
        }
        if ('isHoverShow' in this.props && prevProps.isHoverShow !== this.props.isHoverShow) {
            this.setState({
                show: this.props.isHoverShow
            });
        }
    };

    OverlayTrigger.prototype.componentWillUnmount = function componentWillUnmount() {
        !isReact16 && _reactDom2["default"].unmountComponentAtNode(this._mountNode);
        this._mountNode = null;
        // 加判断去掉 clearTimeout
        this._hoverShowDelay && clearTimeout(this._hoverShowDelay);
        this._hoverShowDelay && clearTimeout(this._hoverHideDelay);
    };

    OverlayTrigger.prototype.handleToggle = function handleToggle() {
        if (this.state.show) {
            this.hide();
        } else {
            this.show();
        }
    };

    OverlayTrigger.prototype.handleDelayedShow = function handleDelayedShow() {
        var _this2 = this;

        if (this._hoverHideDelay != null) {
            clearTimeout(this._hoverHideDelay);
            this._hoverHideDelay = null;
            return;
        }

        if (this.state.show || this._hoverShowDelay != null) {
            return;
        }

        var delay = this.props.delayShow != null ? this.props.delayShow : this.props.delay;

        if (!delay) {
            this.show();
            return;
        }

        this._hoverShowDelay = setTimeout(function () {
            _this2._hoverShowDelay = null;
            _this2.show();
        }, delay);
    };

    OverlayTrigger.prototype.handleDelayedHide = function handleDelayedHide() {
        var _this3 = this;

        if (this._hoverShowDelay != null) {
            clearTimeout(this._hoverShowDelay);
            this._hoverShowDelay = null;
            return;
        }

        if (!this.state.show || this._hoverHideDelay != null) {
            return;
        }

        var delay = this.props.delayHide != null ? this.props.delayHide : this.props.delay;

        if (!delay) {
            this.hide();
            return;
        }

        this._hoverHideDelay = setTimeout(function () {
            _this3._hoverHideDelay = null;
            _this3.hide();
        }, delay);
    };

    // 简单实现mouseEnter和mouseLeave。
    // React的内置版本是有问题的：https://github.com/facebook/react/issues/4251
    //在触发器被禁用的情况下，mouseOut / Over可能导致闪烁
    //从一个子元素移动到另一个子元素。


    OverlayTrigger.prototype.handleMouseOverOut = function handleMouseOverOut(handler, e) {
        var target = e.currentTarget;
        var related = e.relatedTarget || e.nativeEvent.toElement;

        if (!related || related !== target && !(0, _contains2["default"])(target, related)) {
            handler(e);
        }
    };

    OverlayTrigger.prototype.handleHide = function handleHide() {
        this.hide();
    };

    OverlayTrigger.prototype.show = function show() {
        this.setState({ show: true });
    };

    OverlayTrigger.prototype.hide = function hide() {
        this.setState({ show: false });
        this.props.onHide && this.props.onHide();
    };

    OverlayTrigger.prototype.makeOverlay = function makeOverlay(overlay, props) {
        return _react2["default"].createElement(
            _Overlay2["default"],
            _extends({}, props, {
                show: this.state.show,
                onHide: this.handleHide,
                target: this
            }),
            overlay
        );
    };

    OverlayTrigger.prototype.renderOverlay = function renderOverlay() {
        _reactDom2["default"].unstable_renderSubtreeIntoContainer(this, this._overlay, this._mountNode);
    };

    OverlayTrigger.prototype.render = function render() {
        var _props = this.props,
            trigger = _props.trigger,
            overlay = _props.overlay,
            children = _props.children,
            onBlur = _props.onBlur,
            onClick = _props.onClick,
            onFocus = _props.onFocus,
            onMouseOut = _props.onMouseOut,
            onMouseOver = _props.onMouseOver,
            props = _objectWithoutProperties(_props, ['trigger', 'overlay', 'children', 'onBlur', 'onClick', 'onFocus', 'onMouseOut', 'onMouseOver']);

        delete props.delay;
        delete props.delayShow;
        delete props.delayHide;
        delete props.defaultOverlayShown;

        var child = _react2["default"].Children.only(children);
        var childProps = child.props;

        var triggerProps = {
            'aria-describedby': overlay.props.id
        };

        // FIXME: 这里用于传递这个组件上的处理程序的逻辑是不一致的。我们不应该通过任何这些道具。

        triggerProps.onClick = (0, _createChainedFunction2["default"])(childProps.onClick, onClick);

        if (isOneOf('click', trigger) && !('visible' in this.props)) {
            triggerProps.onClick = (0, _createChainedFunction2["default"])(triggerProps.onClick, this.handleToggle);
        }

        if (isOneOf('hover', trigger) && !('visible' in this.props)) {
            // warning(!(trigger === 'hover'),
            //     '[react-bootstrap] Specifying only the `"hover"` trigger limits the ' +
            //     'visibility of the overlay to just mouse users. Consider also ' +
            //     'including the `"focus"` trigger so that touch and keyboard only ' +
            //     'users can see the overlay as well.'
            // );

            triggerProps.onMouseOver = (0, _createChainedFunction2["default"])(childProps.onMouseOver, onMouseOver, this.handleMouseOver);
            triggerProps.onMouseOut = (0, _createChainedFunction2["default"])(childProps.onMouseOut, onMouseOut, this.handleMouseOut);
        }

        if (isOneOf('focus', trigger) && !('visible' in this.props)) {
            triggerProps.onFocus = (0, _createChainedFunction2["default"])(childProps.onFocus, onFocus, this.handleDelayedShow);
            triggerProps.onBlur = (0, _createChainedFunction2["default"])(childProps.onBlur, onBlur, this.handleDelayedHide);
        }

        this._overlay = this.makeOverlay(overlay, props);

        if (!isReact16) {
            return (0, _react.cloneElement)(child, triggerProps);
        }
        triggerProps.key = 'overlay';

        var portal = _react2["default"].createElement(
            _Portal2["default"],
            {
                key: 'portal',
                container: props.container },
            this._overlay
        );

        return [(0, _react.cloneElement)(child, triggerProps), portal];
    };

    return OverlayTrigger;
}(_react.Component);

OverlayTrigger.propTypes = propTypes;
OverlayTrigger.defaultProps = defaultProps;

exports["default"] = OverlayTrigger;
module.exports = exports['default'];