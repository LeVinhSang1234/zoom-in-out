Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Zoom = /** @class */ (function (_super) {
    __extends(Zoom, _super);
    function Zoom(props) {
        var _this = _super.call(this, props) || this;
        _this.listener = function () {
            window.addEventListener("wheel", _this.stopEvent, { passive: false });
            window.addEventListener("touchmove", _this.stopTouch, { passive: false });
            window.addEventListener("keydown", _this.onKeyDown, { passive: false });
            window.addEventListener("keyup", _this.onKeyUp, { passive: false });
        };
        _this.unlistener = function () {
            window.removeEventListener("wheel", _this.stopEvent);
            window.removeEventListener("touchmove", _this.stopTouch);
            window.removeEventListener("keydown", _this.onKeyDown);
            window.removeEventListener("keyup", _this.onKeyUp);
        };
        _this.stopEvent = function (event) {
            var _a = _this.props.allowCtrWheel, allowCtrWheel = _a === void 0 ? true : _a;
            if ((event.ctrlKey || !allowCtrWheel) && _this.isHover) {
                event.preventDefault();
            }
        };
        _this.stopTouch = function (event) {
            if (_this.isHover)
                event.preventDefault();
        };
        _this.doubleClick = function (event, scale) {
            if (!_this.refZoom)
                return;
            var _a = _this.props, _b = _a.minZoom, minZoom = _b === void 0 ? 0.5 : _b, _c = _a.maxZoom, maxZoom = _c === void 0 ? 10 : _c, _d = _a.tabScale, tabScale = _d === void 0 ? 1 : _d;
            if (!scale)
                scale = tabScale;
            var nScale = _this.zoom.scale + scale;
            if ((_this.zoom.scale === minZoom && scale < 0) ||
                (_this.zoom.scale === maxZoom && scale > 0)) {
                return;
            }
            if (nScale < minZoom || nScale > maxZoom) {
                scale = nScale - _this.zoom.scale;
                nScale = nScale < minZoom ? minZoom : maxZoom;
            }
            var pageX = event.pageX, pageY = event.pageY;
            _this.pointZoom = { pageX: pageX, pageY: pageY };
            var _e = _this.refZoom, clientHeight = _e.clientHeight, clientWidth = _e.clientWidth;
            var _f = _this.refZoom.getBoundingClientRect(), left = _f.left, top = _f.top, width = _f.width, height = _f.height;
            var halfW = clientWidth / 2;
            var haflH = clientHeight / 2;
            var wUp = halfW * (nScale - _this.zoom.scale);
            var hUp = haflH * (nScale - _this.zoom.scale);
            var ratioW = (pageX - left) / (width / 2);
            var ratioH = (pageY - top) / (height / 2);
            var nTransX = _this.zoom.transX + (1 - ratioW) * wUp;
            var nTransY = _this.zoom.transY + (1 - ratioH) * hUp;
            _this.zoom = { transX: nTransX, scale: nScale, transY: nTransY };
            _this.refZoom.style.transform = "translate(".concat(nTransX, "px, ").concat(nTransY, "px) scale(").concat(nScale, ")");
        };
        _this.onClick = function (event) {
            if (_this.timeoutClick) {
                _this.timeoutClick = undefined;
                clearTimeout(_this.timeoutClick);
                return _this.doubleClick(event);
            }
            _this.timeoutClick = setTimeout(function () {
                _this.timeoutClick = undefined;
            }, 300);
        };
        _this.onWhell = function (event) {
            var _a = _this.props.allowCtrWheel, allowCtrWheel = _a === void 0 ? true : _a;
            var ctrlKey = event.ctrlKey, nativeEvent = event.nativeEvent, metaKey = event.metaKey;
            if (!ctrlKey && !metaKey && allowCtrWheel)
                return;
            var _b = _this.props.percentWheel, percentWheel = _b === void 0 ? 0.01 : _b;
            _this.doubleClick(event, -nativeEvent.deltaY * percentWheel);
        };
        _this.onMouseOver = function () {
            _this.isHover = true;
        };
        _this.onMouseLeave = function () {
            _this.isHover = false;
            _this.onMouseUp();
        };
        _this.onMouseDown = function (event) {
            var _a = _this.props.allowSpaceDrag, allowSpaceDrag = _a === void 0 ? true : _a;
            if (!_this.refWrapper || (!_this.accessDrag && allowSpaceDrag))
                return;
            _this.pageMove = { x: event.pageX, y: event.pageY };
            _this.refWrapper.style.cursor = "grabbing";
        };
        _this.onMouseUp = function () {
            var _a = _this.props.allowSpaceDrag, allowSpaceDrag = _a === void 0 ? true : _a;
            _this.pageMove = undefined;
            _this.touchMove = undefined;
            if (!_this.refZoom || !_this.refWrapper)
                return;
            var _b = _this.props.animationDuration, animationDuration = _b === void 0 ? 300 : _b;
            var cursor = _this.accessDrag && allowSpaceDrag ? "grab" : "default";
            _this.refWrapper.style.cursor = cursor;
            _this.refZoom.style.transition = "transform ".concat(animationDuration, "ms");
        };
        _this.onMouseMove = function (event) {
            var _a = _this.props.allowSpaceDrag, allowSpaceDrag = _a === void 0 ? true : _a;
            if (!_this.pageMove ||
                !_this.refZoom ||
                (!_this.accessDrag && allowSpaceDrag)) {
                return;
            }
            _this.zoom.transX += event.pageX - _this.pageMove.x;
            _this.zoom.transY += event.pageY - _this.pageMove.y;
            var _b = _this.zoom, transX = _b.transX, transY = _b.transY, scale = _b.scale;
            _this.refZoom.style.transition = "none";
            _this.refZoom.style.transform = "translate(".concat(transX, "px, ").concat(transY, "px) scale(").concat(scale, ")");
            _this.pageMove = { x: event.pageX, y: event.pageY };
        };
        _this.onTouchStart = function (event) {
            var nE = event.nativeEvent;
            var touches = nE.touches;
            _this.isHover = true;
            try {
                _this.pageMove = { x: touches[0].pageX, y: touches[0].pageY };
            }
            catch (_a) { }
        };
        _this.onTouchMove = function (event) {
            var nE = event.nativeEvent;
            if (!_this.refZoom)
                return;
            if (nE.touches.length < 2) {
                _this.onMouseMove(event.touches[0]);
                return;
            }
            var t1 = nE.touches[0];
            var t2 = nE.touches[1];
            var spaceX = Math.abs(t1.pageX - t2.pageX);
            var spaceY = Math.abs(t1.pageY - t2.pageY);
            if (!_this.touchMove)
                _this.touchMove = { x: spaceX, y: spaceY };
            var _a = _this.props.percentWheel, percentWheel = _a === void 0 ? 0.01 : _a;
            var destanceX = spaceX - _this.touchMove.x;
            var destanceY = spaceY - _this.touchMove.y;
            _this.refZoom.style.transition = "none";
            var scale = destanceY * percentWheel;
            if (Math.abs(destanceX) > Math.abs(destanceY)) {
                scale = destanceX * percentWheel;
            }
            _this.doubleClick({
                pageX: t2.pageX + Math.abs(destanceX) / 2,
                pageY: t1.pageY + Math.abs(destanceY) / 2,
            }, scale);
            _this.touchMove = { x: spaceX, y: spaceY };
        };
        _this.onKeyDown = function (event) {
            var _a = _this.props.allowSpaceDrag, allowSpaceDrag = _a === void 0 ? true : _a;
            if (!_this.refWrapper || _this.accessDrag || !allowSpaceDrag)
                return;
            if (event.code === "Space") {
                _this.refWrapper.style.cursor = "grab";
                _this.accessDrag = true;
            }
        };
        _this.onKeyUp = function (event) {
            var _a = _this.props.allowSpaceDrag, allowSpaceDrag = _a === void 0 ? true : _a;
            if (!_this.refWrapper || !_this.accessDrag || !allowSpaceDrag)
                return;
            if (event.code === "Space") {
                _this.refWrapper.style.cursor = "default";
                _this.accessDrag = false;
            }
        };
        _this.getPoint = function (isCenter) {
            if (!_this.refWrapper)
                return;
            var point = _this.pointZoom;
            if (!point || isCenter) {
                var _a = _this.refWrapper.getBoundingClientRect(), left = _a.left, top_1 = _a.top, width = _a.width, height = _a.height;
                point = { pageX: width / 2 + left, pageY: height / 2 + top_1 };
            }
            return point;
        };
        _this.onZoomIn = function (isCenter) {
            if (isCenter === void 0) { isCenter = true; }
            var point = _this.getPoint(isCenter);
            if (!point)
                return;
            var _a = _this.props.tabScale, tabScale = _a === void 0 ? 1 : _a;
            _this.doubleClick(point, tabScale);
        };
        _this.onZoomOut = function (isCenter) {
            if (isCenter === void 0) { isCenter = true; }
            var point = _this.getPoint(isCenter);
            if (!point)
                return;
            var _a = _this.props.tabScale, tabScale = _a === void 0 ? 1 : _a;
            _this.doubleClick(point, -tabScale);
        };
        _this.reset = function () {
            if (!_this.refZoom)
                return;
            _this.zoom = { transX: 0, transY: 0, scale: 1 };
            _this.pageMove = undefined;
            _this.touchMove = undefined;
            _this.pointZoom = undefined;
            _this.refZoom.style.transform = "translate(0px, 0px) scale(1)";
        };
        _this.zoom = { transX: 0, transY: 0, scale: 1 };
        _this.isHover = false;
        return _this;
    }
    Zoom.prototype.componentDidMount = function () {
        this.listener();
    };
    Zoom.prototype.shouldComponentUpdate = function (nextProps) {
        var children = this.props.children;
        return children !== nextProps.children;
    };
    Zoom.prototype.componentWillUnmount = function () {
        this.unlistener();
    };
    Zoom.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, _b = _a.animationDuration, animationDuration = _b === void 0 ? 300 : _b;
        return (jsxRuntime.jsx("div", __assign({ ref: function (ref) { return (_this.refWrapper = ref); }, style: {
                userSelect: "none",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                touchAction: "manipulation",
            }, onTouchStart: this.onTouchStart, onTouchEnd: this.onMouseLeave, onTouchMove: this.onTouchMove, onMouseMove: this.onMouseMove, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onMouseOver: this.onMouseOver, onMouseLeave: this.onMouseLeave, onWheel: this.onWhell, onClick: this.onClick }, { children: jsxRuntime.jsx("div", __assign({ ref: function (ref) { return (_this.refZoom = ref); }, style: {
                    transition: "transform ".concat(animationDuration, "ms"),
                    width: "100%",
                    height: "100%",
                    transformOrigin: 'center'
                } }, { children: children })) })));
    };
    return Zoom;
}(react.Component));

exports.Zoom = Zoom;
//# sourceMappingURL=index.js.map
