import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ownerDocument from './utils/ownerDocument';
import getContainer from './utils/getContainer';

const propTypes = {
    /**
     * 存放子组件的容器
     */
    container: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
        PropTypes.func
    ])
};

const defaultProps = {
    container:''
}

/**
 * Portal组件是将子组件渲染
 */
class Portal extends Component{
    constructor(props){
        super(props);
    }

  componentDidMount() {
    this.renderOverlay();
  }

  componentDidUpdate() {
    this.renderOverlay();
  }
//this._overlayTarget为当前的要添加的子组件， this._portalContainerNode要添加组件的容器元素
  componentWillReceiveProps(nextProps) {
    if (this.overlayTarget && nextProps.container !== this.props.container) {
      this.portalContainerNode.removeChild(this.overlayTarget);
      this.portalContainerNode = getContainer(nextProps.container, ownerDocument(this).body);
      this.portalContainerNode.appendChild(this.overlayTarget);
    }
  }

  componentWillUnmount() {
    this.unrenderOverlay();
    this.unmountOverlayTarget();
  }

  getMountNode(){
    return this.overlayTarget;
  }

  getOverlayDOMNode() {
    if (!this.isMounted()) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
    }

    if (this.overlayInstance) {
      return ReactDOM.findDOMNode(this.overlayInstance);
    }

    return null;
}


/**
 * 如果要添加的子组件不存在，就将div添加到要添加容器的DOM中；
 */

  mountOverlayTarget() {
    if (!this.overlayTarget) {
      this.overlayTarget = document.createElement('div');
      this.portalContainerNode = getContainer(this.props.container, ownerDocument(this).body);
      this.portalContainerNode.appendChild(this.overlayTarget);
    }
  }
/**
 * 将要添加的子元素从容器中移除，并把变量置为null
 */
  unmountOverlayTarget() {
    if (this.overlayTarget) {
      this.portalContainerNode.removeChild(this.overlayTarget);
      this.overlayTarget = null;
    }
    this.portalContainerNode = null;
  }
/**
 * 手动渲染_overlayTarget
 */
  renderOverlay() {

    let overlay = !this.props.children
      ? null
      : React.Children.only(this.props.children);

    // Save reference for future access.
    if (overlay !== null) {
      this.mountOverlayTarget();
      this._overlayInstance = ReactDOM.unstable_renderSubtreeIntoContainer(
        this, overlay, this._overlayTarget
      );
    } else {
      // Unrender if the component is null for transitions to null
      this.unrenderOverlay();
      this.unmountOverlayTarget();
    }
  }
/**
 * 销毁_overlayTarget组件。并把_overlayInstance置为null
 */
  unrenderOverlay() {
    if (this.overlayTarget) {
      ReactDOM.unmountComponentAtNode(this.overlayTarget);
      this.overlayInstance = null;
    }
  }

  render() {
    return null;
  }

};

Portal.propTypes = propTypes;
Portal.defaultProps = defaultProps;

export default Portal;
