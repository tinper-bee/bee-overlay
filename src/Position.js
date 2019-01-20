import classNames from 'classnames';
import React, {cloneElement, Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {componentOrElement} from 'tinper-bee-core';
import requestAnimationFrame from 'dom-helpers/util/requestAnimationFrame';

import calculatePosition from './utils/calculatePosition';
import getContainer from './utils/getContainer';
import ownerDocument from './utils/ownerDocument';
import ownerWindow from './utils/ownerWindow';
import addEventListener from './utils/addEventListener';

const propTypes = {
    /**
     * 要设置定位的元素
     */
    target: PropTypes.oneOfType([
        componentOrElement,
        PropTypes.func
    ]),

    /**
     * 存放的容器元素
     */
    container: PropTypes.oneOfType([
        componentOrElement,
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
     * 第二优先级位置设置
     */
    secondPlacement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),

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

        this.getTarget = this.getTarget.bind(this);
        this.maybeUpdatePosition = this.maybeUpdatePosition.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        this._windowResizeListener = addEventListener(
            ownerWindow(this), 'resize', () => this.onWindowResize()
        );

        this.updatePosition(this.getTarget());
    }

    componentWillReceiveProps() {
        this.needsFlush = true;
    }

    componentDidUpdate(prevProps) {
        if (this.needsFlush) {
            this.needsFlush = false;

            this.maybeUpdatePosition();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this._windowResizeListener) {
            this._windowResizeListener.remove();
        }
    }

    /**
     * 获取要设置位置的子元素
     */
    getTarget() {
        const {target} = this.props;
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

    onWindowResize() {
        requestAnimationFrame(() => this.updatePosition(this.getTarget()));
    }

    /**
     * 更新位置
     */

    updatePosition(target) {
        let {
            placement,
            secondPlacement
        } = this.props;

        if (!this._isMounted) {
            return;
        }
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

        // 若设置了第二渲染位置，placement的优先级是： placement > secondPlacement > placement的反方向
        if ("secondPlacement" in this.props && secondPlacement) {
            let initPosition = calculatePosition(
                placement,
                overlay,
                target,
                container,
                this.props.containerPadding
            )
            if (initPosition.inverseArrow) {
                let secondPosition = calculatePosition(
                    secondPlacement,
                    overlay,
                    target,
                    container,
                    this.props.containerPadding
                )

                if (secondPosition.inverseArrow) {
                    this.setState({
                        ...initPosition,
                        renderPlacement: placement
                    });
                } else {
                    this.setState({
                        ...secondPosition,
                        renderPlacement: secondPlacement
                    });
                }
            } else {
                this.setState({
                    ...initPosition,
                    renderPlacement: placement
                });
            }
        } else {
            this.setState(calculatePosition(
                placement,
                overlay,
                target,
                container,
                this.props.containerPadding
            ));
        }
    }

    render() {
        const {children, className, ...props} = this.props;
        const {positionLeft, positionTop, inverseArrow, width, ...arrowPosition} = this.state;

        // These should not be forwarded to the child.
        delete props.target;
        delete props.container;
        delete props.containerPadding;
        delete props.shouldUpdatePosition;

        const child = React.Children.only(children);
        return cloneElement(
            child,
            {
                className: classNames(className, child.props.className,{'inverse-arrow':inverseArrow}),
                ...arrowPosition,
                style: {
                    ...child.props.style,
                    width,
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
