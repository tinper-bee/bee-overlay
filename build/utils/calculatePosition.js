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
        width = document.body.scrollWidth;
        height = document.body.scrollHeight;

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

    var _getOffset2 = (0, _offset2["default"])(overlayNode),
        overlayHeight = _getOffset2.height,
        overlayWidth = _getOffset2.width;

    var positionLeft = void 0,
        positionTop = void 0,
        arrowOffsetLeft = void 0,
        arrowOffsetTop = void 0,
        inverseArrow = void 0;

    if (/^left|^right/.test(placement)) {
        positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;

        if (/left/.test(placement)) {
            positionLeft = childOffset.left - overlayWidth;
        } else {
            positionLeft = childOffset.left + childOffset.width;
        }

        if (/Top/.test(placement)) {
            positionTop = childOffset.top;
        } else if (/Bottom/.test(placement)) {
            positionTop = childOffset.top + childOffset.height - overlayHeight;
        }

        var topDelta = getTopDelta(positionTop, overlayHeight, container, padding);
        var leftDelta = getLeftDelta(positionLeft, overlayWidth, container, padding);
        //内容超出
        if (leftDelta > 0) {
            inverseArrow = true;
            positionLeft = childOffset.left + childOffset.width + 6;
        } else if (leftDelta < 0) {
            inverseArrow = true;
            positionLeft = childOffset.left - overlayWidth - 6;
        } else {
            positionLeft += leftDelta;
        }
        positionTop += topDelta;
        arrowOffsetTop = 50 * (1 - 2 * topDelta / overlayHeight) + '%';
        arrowOffsetLeft = void 0;
    } else if (/^top|^bottom/.test(placement)) {
        positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;

        if (/top/.test(placement)) {
            positionTop = childOffset.top - overlayHeight;
        } else {
            positionTop = childOffset.top + childOffset.height;
        }

        if (/Left/.test(placement)) {
            positionLeft = childOffset.left;
        } else if (/Right/.test(placement)) {
            positionLeft = childOffset.left + (childOffset.width - overlayWidth);
        }

        var _leftDelta = getLeftDelta(positionLeft, overlayWidth, container, padding);
        var _topDelta = getTopDelta(positionTop, overlayHeight, container, padding);
        positionLeft += _leftDelta;
        arrowOffsetLeft = 50 * (1 - 2 * _leftDelta / overlayWidth) + '%';
        arrowOffsetTop = void 0;
        if (_topDelta > 0) {
            inverseArrow = true;
            positionTop = childOffset.top + childOffset.height + 6;
        } else if (_topDelta < 0) {
            inverseArrow = true;
            positionTop = childOffset.top - overlayHeight - 6;
        } else {
            positionTop += _topDelta;
        }

        // if((positionLeft + panelWidth) > docWidth)
        //         left = docWidth - panelWidth - 10;
        //     if(left < 0)
        //         left = 0;

        //      if((top + panelHeight) > docHeight) {
        //  top = docHeight - panelHeight - 10;
        //  }

        //      if(top < 0)
        //          top = 0;
    } else {
        throw new Error('calcOverlayPosition(): No such placement of "' + placement + '" found.');
    }

    return { positionLeft: positionLeft, positionTop: positionTop, arrowOffsetLeft: arrowOffsetLeft, arrowOffsetTop: arrowOffsetTop, inverseArrow: inverseArrow, width: overlayWidth };
}
module.exports = exports['default'];