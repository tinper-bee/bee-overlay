'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _getContainer = require('./utils/getContainer');

var _getContainer2 = _interopRequireDefault(_getContainer);

var _tinperBeeCore = require('tinper-bee-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var isReact16 = _reactDom2["default"].createPortal !== undefined;
var createPortal = isReact16 ? _reactDom2["default"].createPortal : _reactDom2["default"].unstable_renderSubtreeIntoContainer;

var propTypes = {
  /**
   * 存放子组件的容器
   */
  container: _propTypes2["default"].oneOfType([_tinperBeeCore.componentOrElement, _propTypes2["default"].func])
};

var defaultProps = {};

/**
 * Portal组件是将子组件渲染
 */

var Portal = function (_Component) {
  _inherits(Portal, _Component);

  function Portal(props) {
    _classCallCheck(this, Portal);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.getMountNode = _this.getMountNode.bind(_this);
    _this.getOverlayDOMNode = _this.getOverlayDOMNode.bind(_this);
    _this.mountOverlayTarget = _this.mountOverlayTarget.bind(_this);
    _this.unmountOverlayTarget = _this.unmountOverlayTarget.bind(_this);
    _this.renderOverlay = _this.renderOverlay.bind(_this);
    _this.unrenderOverlay = _this.unrenderOverlay.bind(_this);

    _this.overlayTarget = isReact16 ? document.createElement('div') : null;
    return _this;
  }

  Portal.prototype.componentDidMount = function componentDidMount() {
    if (isReact16) {
      this.portalContainerNode = (0, _getContainer2["default"])(this.props.container, (0, _ownerDocument2["default"])(this).body);
      this.portalContainerNode.appendChild(this.overlayTarget);
    } else {
      this.renderOverlay();
    }

    this.mounted = true;
  };

  Portal.prototype.componentDidUpdate = function componentDidUpdate() {
    if (isReact16) {
      var overlay = !this.props.children ? null : _react2["default"].Children.only(this.props.children);
      if (overlay === null) {
        this.unrenderOverlay();
        this.unmountOverlayTarget();
      } else {}
    } else {
      this.renderOverlay();
    }
  };
  //this._overlayTarget为当前的要添加的子组件， this._portalContainerNode要添加组件的容器元素


  Portal.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.overlayTarget && nextProps.container !== this.props.container) {
      this.portalContainerNode.removeChild(this.overlayTarget);
      this.portalContainerNode = (0, _getContainer2["default"])(nextProps.container, (0, _ownerDocument2["default"])(this).body);
      this.portalContainerNode.appendChild(this.overlayTarget);
    }
  };

  Portal.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unrenderOverlay();
    this.unmountOverlayTarget();

    this.mounted = false;
  };

  Portal.prototype.getMountNode = function getMountNode() {
    return this.overlayTarget;
  };

  Portal.prototype.getOverlayDOMNode = function getOverlayDOMNode() {
    if (!this.mounted) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
    }

    if (this.overlayInstance) {
      return _reactDom2["default"].findDOMNode(this.overlayInstance);
    }

    return null;
  };

  /**
   * 如果要添加的子组件不存在，就将div添加到要添加容器的DOM中；
   */

  Portal.prototype.mountOverlayTarget = function mountOverlayTarget() {
    if (!this.overlayTarget) {
      this.overlayTarget = document.createElement('div');
      this.portalContainerNode = (0, _getContainer2["default"])(this.props.container, (0, _ownerDocument2["default"])(this).body);
      this.portalContainerNode.appendChild(this.overlayTarget);
    }
  };
  /**
   * 将要添加的子元素从容器中移除，并把变量置为null
   */


  Portal.prototype.unmountOverlayTarget = function unmountOverlayTarget() {
    if (this.overlayTarget) {
      this.portalContainerNode.removeChild(this.overlayTarget);
      this.overlayTarget = null;
    }
    this.portalContainerNode = null;
  };
  /**
   * 手动渲染_overlayTarget
   */


  Portal.prototype.renderOverlay = function renderOverlay() {

    var overlay = !this.props.children ? null : _react2["default"].Children.only(this.props.children);

    // Save reference for future access.
    if (overlay !== null) {
      this.mountOverlayTarget();
      this.overlayInstance = _reactDom2["default"].unstable_renderSubtreeIntoContainer(this, overlay, this.overlayTarget);
    } else {
      // Unrender if the component is null for transitions to null
      this.unrenderOverlay();
      this.unmountOverlayTarget();
    }
  };
  /**
   * 销毁_overlayTarget组件。并把_overlayInstance置为null
   */


  Portal.prototype.unrenderOverlay = function unrenderOverlay() {
    if (this.overlayTarget) {
      !isReact16 && _reactDom2["default"].unmountComponentAtNode(this.overlayTarget);
      this.overlayInstance = null;
    }
  };

  Portal.prototype.render = function render() {
    if (!isReact16) {
      return null;
    }

    var overlay = !this.props.children ? null : _react2["default"].Children.only(this.props.children);

    return _reactDom2["default"].createPortal(overlay, this.overlayTarget);
  };

  return Portal;
}(_react.Component);

;

Portal.propTypes = propTypes;
Portal.defaultProps = defaultProps;

exports["default"] = Portal;
module.exports = exports['default'];