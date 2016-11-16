import classNames from 'classnames';
import React, { cloneElement, PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';


import calculatePosition from './utils/calculatePosition';
import getContainer from './utils/getContainer';
import ownerDocument from './utils/ownerDocument';

const propTypes = {
  /**
   * 要设置定位的元素
   */
  target: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.func
  ]),

  /**
   * 存放的容器元素
   */
  container: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.func
  ]),
  /**
   * 容器padding值
   */
  containerPadding: PropTypes.number,
  /**
   * 位置设置
   */
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  /**
   * 是否需要更新位置
   */
  shouldUpdatePosition: PropTypes.bool
};

const defaultProps = {
  containerPadding: 0,
  placement: 'right',
  shouldUpdatePosition: false
};



/**
 * 计算子组件的位置的组件
 */
class Position extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      positionLeft: 0,
      positionTop: 0,
      arrowOffsetLeft: null,
      arrowOffsetTop: null
    };

    this.needsFlush = false;
    this.lastTarget = null;
  }

  componentDidMount() {
    this.updatePosition(this.getTarget());
  }

  componentWillReceiveProps() {
    this.needsFlush = true;
  }

  componentDidUpdate(prevProps) {
    if (this.needsFlush) {
      this.needsFlush = false;
      this.maybeUpdatePosition(this.props.placement !== prevProps.placement);
    }
  }
/**
 * 获取要设置位置的子元素
 */
  getTarget() {
    const { target } = this.props;
    const targetElement = typeof target === 'function' ? target() : target;
    return targetElement && ReactDOM.findDOMNode(targetElement) || null;
  }

/**
 * 验证是否需要更新位置
 */
  maybeUpdatePosition(placementChanged) {
    const target = this.getTarget();

    if (
      !this.props.shouldUpdatePosition &&
      target === this.lastTarget &&
      !placementChanged
    ) {
      return;
    }

    this.updatePosition(target);
  }
/**
 * 更新位置
 */

  updatePosition(target) {
    this.lastTarget = target;

    if (!target) {
      this.setState({
        positionLeft: 0,
        positionTop: 0,
        arrowOffsetLeft: null,
        arrowOffsetTop: null
      });

      return;
    }

    const overlay = ReactDOM.findDOMNode(this);
    const container = getContainer(
      this.props.container, ownerDocument(this).body
    );

    this.setState(calculatePosition(
      this.props.placement,
      overlay,
      target,
      container,
      this.props.containerPadding
    ));
  }

  render() {
    const {children, className, ...props} = this.props;
    const {positionLeft, positionTop, ...arrowPosition} = this.state;

    // These should not be forwarded to the child.
    delete props.target;
    delete props.container;
    delete props.containerPadding;
    delete props.shouldUpdatePosition;

    const child = React.Children.only(children);
    return cloneElement(
      child,
      {
        ...props,
        ...arrowPosition,
        // FIXME:不要使用props来转发下面两个参数
        positionLeft,
        positionTop,
        className: classNames(className, child.props.className),
        style: {
          ...child.props.style,
          left: positionLeft,
          top: positionTop
        }
      }
    );
  }


}

Position.propTypes = propTypes;
Position.defaultProps = defaultProps;

export default Position;
