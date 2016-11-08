import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import componentOrElement from 'react-prop-types/lib/componentOrElement';
import ownerDocument from './utils/ownerDocument';
import getContainer from './utils/getContainer';

const propTypes = {
    /**
     * 存放子组件的容器
     */
    container: React.PropTypes.oneOfType([
        componentOrElement,
        React.PropTypes.func
    ])
};

const defaultProps = {
    container:''
}

/**
 * Portal组件是将子组件渲染
 */
class Portal extends Component({
    constructor(props){
        super(props);
    }

  componentDidMount() {
    this._renderOverlay();
  },

  componentDidUpdate() {
    this._renderOverlay();
  },
//this._overlayTarget为当前的要添加的子组件， this._portalContainerNode要添加组件的容器元素
  componentWillReceiveProps(nextProps) {
    if (this._overlayTarget && nextProps.container !== this.props.container) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._portalContainerNode = getContainer(nextProps.container, ownerDocument(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },

  componentWillUnmount() {
    this._unrenderOverlay();
    this._unmountOverlayTarget();
  },

  getMountNode(){
    return this._overlayTarget;
  },

  getOverlayDOMNode() {
    if (!this.isMounted()) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
    }

    if (this._overlayInstance) {
      return ReactDOM.findDOMNode(this._overlayInstance);
    }

    return null;
},


/**
 * 如果要添加的子组件不存在，就将div添加到要添加容器的DOM中；
 */

  _mountOverlayTarget() {
    if (!this._overlayTarget) {
      this._overlayTarget = document.createElement('div');
      this._portalContainerNode = getContainer(this.props.container, ownerDocument(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },
/**
 * 将要添加的子元素从容器中移除，并把变量置为null
 */
  _unmountOverlayTarget() {
    if (this._overlayTarget) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._overlayTarget = null;
    }
    this._portalContainerNode = null;
  },
/**
 * 手动渲染_overlayTarget
 */
  _renderOverlay() {

    let overlay = !this.props.children
      ? null
      : React.Children.only(this.props.children);

    // Save reference for future access.
    if (overlay !== null) {
      this._mountOverlayTarget();
      this._overlayInstance = ReactDOM.unstable_renderSubtreeIntoContainer(
        this, overlay, this._overlayTarget
      );
    } else {
      // Unrender if the component is null for transitions to null
      this._unrenderOverlay();
      this._unmountOverlayTarget();
    }
  },
/**
 * 销毁_overlayTarget组件。并把_overlayInstance置为null
 */
  _unrenderOverlay() {
    if (this._overlayTarget) {
      ReactDOM.unmountComponentAtNode(this._overlayTarget);
      this._overlayInstance = null;
    }
  },

  render() {
    return null;
  }

});

Portal.propTypes = propTypes;
Portal.defaultProps = defaultProps;

export default Portal;
