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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var clsx = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.filter(Boolean).join(" ").trim();
};
var ScrollInverted = /** @class */ (function (_super) {
    __extends(ScrollInverted, _super);
    function ScrollInverted(props) {
        var _this = _super.call(this, props) || this;
        _this.appendCss = function () { return __awaiter(_this, void 0, void 0, function () {
            var head;
            return __generator(this, function (_a) {
                head = document.querySelector("head");
                if (!head)
                    return [2 /*return*/];
                this.styleDom = document.createElement("style");
                this.styleDom.innerHTML = "\n    .scroll-inverted-wrap {\n      flex: 1;\n      direction: ltr !important;\n      display: flex;\n      height: 100%;\n      width: 100%;\n    }\n    .scroll-inverted-container {\n      flex: 1;\n      transform: rotate(180deg);\n      overflow: auto;\n      position: relative;\n      display: flex;\n    }\n    .scroll-inverted-wrap > .scroll-inverted-container > .scroll-inverted-content {\n      height: max-content;\n      min-height: 100%;\n      position: relative !important;\n      flex: 1;\n      align-content: flex-end;\n    }\n    .scroll-inverted-wrap > .scroll-inverted-indicator-scroll {\n      position: absolute;\n      right: 2px;\n      bottom: 0;\n      width: 8px;\n      display: flex;\n    }\n    \n    .scroll-inverted-indicator-scroll--relative {\n      position: relative;\n      flex: 1;\n    }\n    \n    .scroll-inverted-wrap .scroll-inverted-indicator-scroll-thumb {\n      background-color: #a0a0a5;\n      border-radius: 16px;\n      bottom: 0;\n      position: absolute;\n      right: 0px;\n      width: 100%;\n      transition: opacity 0.2s, transform 0.1s;\n    }\n    ";
                head.append(this.styleDom);
                return [2 /*return*/];
            });
        }); };
        _this.removeCss = function () {
            var head = document.querySelector("head");
            if (head && _this.styleDom)
                head.removeChild(_this.styleDom);
        };
        _this.getDirection = function () { return __awaiter(_this, void 0, void 0, function () {
            var elem, _a, directionProps, direction;
            return __generator(this, function (_b) {
                elem = document.querySelector("body");
                if (!elem || !this.divContentWrap || !this.divScroll || !this.divContent) {
                    return [2 /*return*/];
                }
                _a = this.props.direction, directionProps = _a === void 0 ? "" : _a;
                direction = directionProps;
                if (!direction && window.getComputedStyle) {
                    direction = window
                        .getComputedStyle(elem, null)
                        .getPropertyValue("direction");
                }
                this.divContent.style.direction = direction;
                this.divContentWrap.style.direction = direction === "rtl" ? "ltr" : "rtl";
                this.divScroll.style.direction = direction === "rtl" ? "ltr" : "rtl";
                return [2 /*return*/];
            });
        }); };
        _this.scrollToInit = function () { return __awaiter(_this, void 0, void 0, function () {
            var initialScrollIndex;
            return __generator(this, function (_a) {
                initialScrollIndex = this.props.initialScrollIndex;
                if (!this.divScroll || !initialScrollIndex)
                    return [2 /*return*/];
                this.isCallScrollTo = true;
                this.scrollToIndex(initialScrollIndex);
                return [2 /*return*/];
            });
        }); };
        _this.getLayout = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, clientHeight, scrollHeight, onLayout;
            return __generator(this, function (_b) {
                if (!this.divScroll)
                    return [2 /*return*/];
                _a = this.divScroll, clientHeight = _a.clientHeight, scrollHeight = _a.scrollHeight;
                onLayout = this.props.onLayout;
                if (this.height !== clientHeight || this.scrollHeight !== scrollHeight) {
                    onLayout === null || onLayout === void 0 ? void 0 : onLayout({ height: clientHeight, scrollHeight: scrollHeight });
                    this.height = clientHeight;
                    this.scrollHeight = scrollHeight;
                }
                this.frameGetLayout = window.requestAnimationFrame(this.getLayout);
                return [2 /*return*/];
            });
        }); };
        _this.onWheel = function (event) {
            _this.isWheel = true;
            if (!_this.divScroll)
                return;
            event.preventDefault();
            var _a = _this.divScroll, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight;
            if (_this.frameRequest)
                window.cancelAnimationFrame(_this.frameRequest);
            var newScroll = scrollTop - event.deltaY;
            if (newScroll > scrollHeight) {
                newScroll = scrollHeight;
            }
            _this.divScroll.scrollTo({ top: newScroll });
            _this.beginFrameAnimated();
        };
        _this.onScrollEndHandle = function () {
            var onScrollEnd = _this.props.onScrollEnd;
            onScrollEnd === null || onScrollEnd === void 0 ? void 0 : onScrollEnd();
            _this.onReached();
            _this.isCallScrollTo = false;
        };
        _this.onScrollEnd = function () {
            if (_this.frameRequest)
                window.cancelAnimationFrame(_this.frameRequest);
            if (_this.timeoutEnd)
                clearTimeout(_this.timeoutEnd);
            _this.timeoutEnd = setTimeout(_this.onScrollEndHandle, 100);
        };
        _this.beginFrameAnimated = function () {
            if (!_this.divScroll)
                return;
            var scrollTop = _this.divScroll.scrollTop;
            if (scrollTop !== _this.preScrollTop) {
                _this.isEnd = false;
                _this.modeScroll = scrollTop < _this.preScrollTop ? "down" : "up";
                var onScroll = _this.props.onScroll;
                onScroll === null || onScroll === void 0 ? void 0 : onScroll(scrollTop, !_this.isCallScrollTo);
                _this.preScrollTop = scrollTop;
                _this.frameRequest = window.requestAnimationFrame(_this.beginFrameAnimated);
            }
            else if (!_this.isEnd) {
                _this.isEnd = true;
                _this.onScrollEnd();
            }
        };
        _this.onReached = function () {
            var _a = _this.props, onEndReached = _a.onEndReached, _b = _a.onEndReachedThreshold, onEndReachedThreshold = _b === void 0 ? 0.01 : _b, onStartReached = _a.onStartReached, _c = _a.onStartReachedThreshold, onStartReachedThreshold = _c === void 0 ? 0.01 : _c;
            if (!_this.divScroll)
                return;
            var scrollTop = _this.divScroll.scrollTop;
            if (_this.modeScroll === "down") {
                var topCheck_1 = onEndReachedThreshold * _this.scrollHeight;
                if (scrollTop <= topCheck_1) {
                    onEndReached === null || onEndReached === void 0 ? void 0 : onEndReached();
                }
                return;
            }
            var topCheck = _this.scrollHeight - _this.height - onStartReachedThreshold * _this.height;
            if (scrollTop >= topCheck) {
                onStartReached === null || onStartReached === void 0 ? void 0 : onStartReached();
            }
            return;
        };
        _this.onScrollMobile = function () {
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (_this.isWheel && !isMobile)
                return (_this.isWheel = false);
            _this.beginFrameAnimated();
        };
        _this.scrollTo = function (options) {
            if (!_this.divScroll)
                return;
            _this.isCallScrollTo = true;
            _this.divScroll.scrollTo(options);
            _this.beginFrameAnimated();
        };
        _this.scrollToEnd = function (behavior) {
            if (!_this.divScroll)
                return;
            _this.isCallScrollTo = true;
            _this.divScroll.scrollTo({ top: 0, behavior: behavior });
            _this.beginFrameAnimated();
        };
        _this.scrollToTop = function (behavior) {
            if (!_this.divScroll)
                return;
            var scrollHeight = _this.divScroll.scrollHeight;
            _this.isCallScrollTo = true;
            _this.divScroll.scrollTo({ top: scrollHeight, behavior: behavior });
            _this.beginFrameAnimated();
        };
        _this.scrollToIndex = function (index, behavior) {
            var element = document.getElementById("item-render-".concat(index));
            if (!element || !_this.divScroll)
                return;
            var topElement = element.getBoundingClientRect().top;
            var parent = _this.divScroll.getBoundingClientRect();
            _this.divScroll.scrollTo({
                top: parent.top - topElement + _this.divScroll.scrollTop,
                behavior: behavior,
            });
        };
        _this.scrollIntoView = function (index, behavior) {
            var element = document.getElementById("item-render-".concat(index));
            if (!element || !_this.divScroll)
                return;
            var topElement = element.getBoundingClientRect().top;
            var parent = _this.divScroll.getBoundingClientRect();
            if (topElement < 0 || topElement > parent.height) {
                _this.divScroll.scrollTo({
                    top: parent.top - topElement + _this.divScroll.scrollTop,
                    behavior: behavior,
                });
            }
        };
        _this.getReverse = function () {
            var _a = _this.props.data, data = _a === void 0 ? [] : _a;
            return __spreadArray([], data, true).reverse();
        };
        _this.height = 0;
        _this.scrollHeight = 0;
        _this.preScrollTop = 0;
        return _this;
    }
    ScrollInverted.prototype.componentDidMount = function () {
        var _a;
        try {
            Promise.all([
                this.appendCss(),
                this.getLayout(),
                this.scrollToInit(),
                this.getDirection(),
            ]);
        }
        catch (_b) { }
        (_a = this.divScroll) === null || _a === void 0 ? void 0 : _a.addEventListener("wheel", this.onWheel, { passive: false });
        window.div = this.divScroll;
    };
    ScrollInverted.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.divScroll) === null || _a === void 0 ? void 0 : _a.removeEventListener("wheel", this.onWheel);
        if (this.frameGetLayout)
            window.cancelAnimationFrame(this.frameGetLayout);
        this.removeCss();
    };
    ScrollInverted.prototype.componentDidUpdate = function () {
        if (!this.divScroll)
            return;
        if (!this.preScrollTop) {
            var scrollHeight = this.divScroll.scrollHeight;
            if (scrollHeight !== this.scrollHeight) {
                this.isCallScrollTo = true;
                this.divScroll.scrollTo({ top: scrollHeight - this.scrollHeight });
            }
        }
    };
    ScrollInverted.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, style = _a.style, classNameContentContainer = _a.classNameContentContainer, _b = _a.styleContentContainer, styleContentContainer = _b === void 0 ? {} : _b, styleWrap = _a.styleWrap, classNameWrap = _a.classNameWrap, renderItem = _a.renderItem, keyExtractor = _a.keyExtractor;
        var dataRender = this.getReverse();
        return (jsxRuntime.jsx("div", __assign({ className: clsx("scroll-inverted-wrap", classNameWrap), style: styleWrap }, { children: jsxRuntime.jsx("div", __assign({ className: clsx("scroll-inverted-container", className), ref: function (ref) { return (_this.divScroll = ref); }, style: style, onScroll: this.onScrollMobile }, { children: jsxRuntime.jsx("div", __assign({ style: __assign(__assign({}, styleContentContainer), { position: "relative" }), className: clsx("scroll-inverted-content", classNameContentContainer), ref: function (ref) { return (_this.divContentWrap = ref); } }, { children: jsxRuntime.jsx("div", __assign({ ref: function (ref) { return (_this.divContent = ref); } }, { children: dataRender.map(function (item, index) { return (jsxRuntime.jsx(ItemRenderring, __assign({ id: "item-render-".concat(dataRender.length - index - 1) }, { children: renderItem === null || renderItem === void 0 ? void 0 : renderItem({ item: item, index: index }) }), (keyExtractor === null || keyExtractor === void 0 ? void 0 : keyExtractor(item, index)) || index)); }) })) })) })) })));
    };
    return ScrollInverted;
}(react.PureComponent));
var ItemRenderring = /** @class */ (function (_super) {
    __extends(ItemRenderring, _super);
    function ItemRenderring() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemRenderring.prototype.render = function () {
        var _a = this.props, children = _a.children, id = _a.id;
        return (jsxRuntime.jsx("div", __assign({ id: id, style: { width: "100%", transform: "rotate(180deg)" } }, { children: children })));
    };
    return ItemRenderring;
}(react.PureComponent));

exports.ScrollInverted = ScrollInverted;
//# sourceMappingURL=index.js.map
