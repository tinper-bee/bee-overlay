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

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = {
  /**
   * 存放子组件的容器
   */
  container: _react2["default"].PropTypes.oneOfType([_componentOrElement2["default"], _react2["default"].PropTypes.func])
};

var defaultProps = {
  container: ''
};

/**
 * Portal组件是将子组件渲染
 */

var Portal = function (_Component) {
  _inherits(Portal, _Component);

  function Portal(props) {
    _classCallCheck(this, Portal);

    return _possibleConstructorReturn(this, _Component.call(this, props));
  }

  Portal.prototype.componentDidMount = function componentDidMount() {
    this._renderOverlay();
  };

  Portal.prototype.componentDidUpdate = function componentDidUpdate() {
    this._renderOverlay();
  };
  //this._overlayTarget为当前的要添加的子组件， this._portalContainerNode要添加组件的容器元素


  Portal.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this._overlayTarget && nextProps.container !== this.props.container) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._portalContainerNode = (0, _getContainer2["default"])(nextProps.container, (0, _ownerDocument2["default"])(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  };

  Portal.prototype.componentWillUnmount = function componentWillUnmount() {
    this._unrenderOverlay();
    this._unmountOverlayTarget();
  };

  Portal.prototype.getMountNode = function getMountNode() {
    return this._overlayTarget;
  };

  Portal.prototype.getOverlayDOMNode = function getOverlayDOMNode() {
    if (!this.isMounted()) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
    }

    if (this._overlayInstance) {
      return _reactDom2["default"].findDOMNode(this._overlayInstance);
    }

    return null;
  };

  /**
   * 如果要添加的子组件不存在，就将div添加到要添加容器的DOM中；
   */

  Portal.prototype._mountOverlayTarget = function _mountOverlayTarget() {
    if (!this._overlayTarget) {
      this._overlayTarget = document.createElement('div');
      this._portalContainerNode = (0, _getContainer2["default"])(this.props.container, (0, _ownerDocument2["default"])(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  };
  /**
   * 将要添加的子元素从容器中移除，并把变量置为null
   */


  Portal.prototype._unmountOverlayTarget = function _unmountOverlayTarget() {
    if (this._overlayTarget) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._overlayTarget = null;
    }
    this._portalContainerNode = null;
  };
  /**
   * 手动渲染_overlayTarget
   */


  Portal.prototype._renderOverlay = function _renderOverlay() {

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
  };
  /**
   * 销毁_overlayTarget组件。并把_overlayInstance置为null
   */


  Portal.prototype._unrenderOverlay = function _unrenderOverlay() {
    if (this._overlayTarget) {
      _reactDom2["default"].unmountComponentAtNode(this._overlayTarget);
      this._overlayInstance = null;
    }
  };

  Portal.prototype.render = function render() {
    return null;
  };

  return Portal;
}(_react.Component);

;

Portal.propTypes = propTypes;
Portal.defaultProps = defaultProps;

exports["default"] = Portal;
module.exports = exports['default'];