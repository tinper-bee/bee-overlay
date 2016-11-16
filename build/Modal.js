'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*eslint-disable react/prop-types */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

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

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var modalManager = new _ModalManager2["default"]();

/**
 * 模态框
 */

var propTypes = _extends({}, _Portal2["default"].propTypes, {

  /**
   * 是否显示
   */
  show: _react.PropTypes.bool,

  /**
   * 容器
   */
  container: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string, _react.PropTypes.func]),

  /**
   * 当模态框打开时的钩子函数
   */
  onShow: _react.PropTypes.func,

  /**
   * 当show参数为false时触发的模态框关闭时的钩子函数
   */
  onHide: _react.PropTypes.func,

  /**
   * 是否包含背景
   */
  backdrop: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.oneOf(['static'])]),

  /**
   *返回背景组件的函数
   */
  renderBackdrop: _react.PropTypes.func,

  /**
   * 设置esc键特殊钩子函数
   */
  onEscapeKeyUp: _react.PropTypes.func,

  /**
   * 当点击背景时触发的函数
   */
  onBackdropClick: _react.PropTypes.func,

  /**
   * 背景的style
   */
  backdropStyle: _react.PropTypes.object,

  /**
   * 背景的class
   */
  backdropClassName: _react.PropTypes.string,

  /**
   *容器的class
   */
  containerClassName: _react.PropTypes.string,

  /**
   * 按esc键是否关闭模态框
   */
  keyboard: _react.PropTypes.bool,

  /**
   * 动画组件
   */
  transition: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string, _react.PropTypes.func]),

  /**
   * 设置动画超时时间
   */
  dialogTransitionTimeout: _react.PropTypes.number,

  /**
   * 设置背景动画超时时间
   */
  backdropTransitionTimeout: _react.PropTypes.number,

  /**
   * 是否自动设置焦点
   */
  autoFocus: _react.PropTypes.bool,

  /**
   * 防止焦点离开模态框
   */
  enforceFocus: _react.PropTypes.bool,

  /**
   * 模态框进入时的钩子函数
   */
  onEnter: _react.PropTypes.func,

  /**
   * 模态框开始进入时的钩子函数
   */
  onEntering: _react.PropTypes.func,

  /**
   * 模态框进入后的钩子函数
   */
  onEntered: _react.PropTypes.func,

  /**
   * 模态框退出时的钩子函数
   */
  onExit: _react.PropTypes.func,

  /**
   * 模态框开始退出时的钩子函数
   */
  onExiting: _react.PropTypes.func,

  /**
   * 模态框推出后的钩子函数
   */
  onExited: _react.PropTypes.func,

  /**
   *管理model状态的实例
   */
  manager: _react.PropTypes.object.isRequired
});

var defaultProps = {
  show: false,
  backdrop: true,
  keyboard: true,
  autoFocus: true,
  enforceFocus: true,
  onHide: function onHide() {},
  manager: modalManager,
  renderBackdrop: function renderBackdrop(props) {
    return _react2["default"].createElement('div', props);
  }
};

var Modal = function (_Component) {
  _inherits(Modal, _Component);

  function Modal(props, content) {
    _classCallCheck(this, Modal);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      exited: !_this.props.show
    };
    return _this;
  }

  Modal.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({ exited: false });
    } else if (!nextProps.transition) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({ exited: true });
    }
  };

  Modal.prototype.componentWillUpdate = function componentWillUpdate(nextProps) {
    if (!this.props.show && nextProps.show) {
      this.checkForFocus();
    }
  };

  Modal.prototype.componentDidMount = function componentDidMount() {
    if (this.props.show) {
      this.onShow();
    }
  };

  Modal.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var transition = this.props.transition;


    if (prevProps.show && !this.props.show && !transition) {
      // Otherwise handleHidden will call this.
      this.onHide();
    } else if (!prevProps.show && this.props.show) {
      this.onShow();
    }
  };

  Modal.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props = this.props,
        show = _props.show,
        transition = _props.transition;


    if (show || transition && !this.state.exited) {
      this.onHide();
    }
  };

  Modal.prototype.onShow = function onShow() {
    var doc = (0, _ownerDocument2["default"])(this);
    var container = (0, _getContainer2["default"])(this.props.container, doc.body);

    this.props.manager.add(this, container, this.props.containerClassName);

    this._onDocumentKeyupListener = (0, _addEventListener2["default"])(doc, 'keyup', this.handleDocumentKeyUp);

    this._onFocusinListener = (0, _addFocusListener2["default"])(this.enforceFocus);

    this.focus();

    if (this.props.onShow) {
      this.props.onShow();
    }
  };

  Modal.prototype.onHide = function onHide() {
    this.props.manager.remove(this);

    this._onDocumentKeyupListener.remove();

    this._onFocusinListener.remove();

    this.restoreLastFocus();
  };

  Modal.prototype.setMountNode = function setMountNode(ref) {
    this.mountNode = ref ? ref.getMountNode() : ref;
  };

  Modal.prototype.handleHidden = function handleHidden() {
    this.setState({ exited: true });
    this.onHide();

    if (this.props.onExited) {
      var _props2;

      (_props2 = this.props).onExited.apply(_props2, arguments);
    }
  };

  Modal.prototype.handleBackdropClick = function handleBackdropClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (this.props.onBackdropClick) {
      this.props.onBackdropClick(e);
    }

    if (this.props.backdrop === true) {
      this.props.onHide();
    }
  };

  Modal.prototype.handleDocumentKeyUp = function handleDocumentKeyUp(e) {
    if (this.props.keyboard && e.keyCode === 27 && this.isTopModal()) {
      if (this.props.onEscapeKeyUp) {
        this.props.onEscapeKeyUp(e);
      }
      this.props.onHide();
    }
  };

  Modal.prototype.checkForFocus = function checkForFocus() {
    if (_inDOM2["default"]) {
      this.lastFocus = (0, _activeElement2["default"])();
    }
  };

  Modal.prototype.focus = function focus() {
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
  };

  Modal.prototype.restoreLastFocus = function restoreLastFocus() {
    // Support: <=IE11 doesn't support `focus()` on svg elements (RB: #917)
    if (this.lastFocus && this.lastFocus.focus) {
      this.lastFocus.focus();
      this.lastFocus = null;
    }
  };

  Modal.prototype.enforceFocus = function enforceFocus() {
    var enforceFocus = this.props.enforceFocus;


    if (!enforceFocus || !this.isMounted() || !this.isTopModal()) {
      return;
    }

    var active = (0, _activeElement2["default"])((0, _ownerDocument2["default"])(this));
    var modal = this.getDialogElement();

    if (modal && modal !== active && !(0, _contains2["default"])(modal, active)) {
      modal.focus();
    }
  };

  //instead of a ref, which might conflict with one the parent applied.


  Modal.prototype.getDialogElement = function getDialogElement() {
    var node = this.refs.modal;
    return node && node.lastChild;
  };

  Modal.prototype.isTopModal = function isTopModal() {
    return this.props.manager.isTopModal(this);
  };

  Modal.prototype.renderBackdrop = function renderBackdrop() {
    var _this2 = this;

    var _props3 = this.props,
        backdropStyle = _props3.backdropStyle,
        backdropClassName = _props3.backdropClassName,
        renderBackdrop = _props3.renderBackdrop,
        Transition = _props3.transition,
        backdropTransitionTimeout = _props3.backdropTransitionTimeout;


    var backdropRef = function backdropRef(ref) {
      return _this2.backdrop = ref;
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
  };

  Modal.prototype.render = function render() {
    var _props4 = this.props,
        show = _props4.show,
        container = _props4.container,
        children = _props4.children,
        Transition = _props4.transition,
        backdrop = _props4.backdrop,
        dialogTransitionTimeout = _props4.dialogTransitionTimeout,
        className = _props4.className,
        style = _props4.style,
        onExit = _props4.onExit,
        onExiting = _props4.onExiting,
        onEnter = _props4.onEnter,
        onEntering = _props4.onEntering,
        onEntered = _props4.onEntered;


    var dialog = _react2["default"].Children.only(children);

    var mountModal = show || Transition && !this.state.exited;
    if (!mountModal) {
      return null;
    }

    var _dialog$props = dialog.props,
        role = _dialog$props.role,
        tabIndex = _dialog$props.tabIndex;


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
  };

  return Modal;
}(_react.Component);

;

Modal.Manager = _ModalManager2["default"];

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

exports["default"] = Modal;
module.exports = exports['default'];