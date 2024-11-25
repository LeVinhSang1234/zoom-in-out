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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
var DEFAULT_CDN_PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
var DEFAULT_CDN_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
var DEFAULT_INTEGRITY = "sha512-q+4liFwdPC/bNdhUpZx6aXDx/h77yEQtn4I1slHydcbZK34nLaR3cAeYSJshoxIOq3mjEf7xJE8YWIUHMn+oCQ==";
var PDFHighlight = /** @class */ (function (_super) {
    __extends(PDFHighlight, _super);
    function PDFHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isObjectEqual = function (obj1, obj2) {
            if (obj1 === obj2)
                return true;
            if (typeof obj1 !== typeof obj2)
                return false;
            var obj1Keys = Object.keys(obj1);
            var obj2Keys = Object.keys(obj2);
            if (obj1Keys.length !== obj2Keys.length) {
                return false;
            }
            var isEqual = true;
            for (var _i = 0, obj1Keys_1 = obj1Keys; _i < obj1Keys_1.length; _i++) {
                var key = obj1Keys_1[_i];
                if (obj1[key] !== obj2[key]) {
                    isEqual = false;
                    break;
                }
            }
            return isEqual;
        };
        _this.isEqualKeyword = function (keywords, keywords2) {
            if (keywords === keywords2)
                return true;
            if ((keywords === null || keywords === void 0 ? void 0 : keywords.length) !== (keywords2 === null || keywords2 === void 0 ? void 0 : keywords2.length))
                return false;
            if (keywords2 === null || keywords2 === void 0 ? void 0 : keywords2.some(function (e) { return !(keywords === null || keywords === void 0 ? void 0 : keywords.includes(e)); }))
                return false;
            return true;
        };
        _this.appendScript = function (props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var head, cdn, script;
                var _a;
                return __generator(this, function (_b) {
                    head = document.querySelector("head");
                    cdn = DEFAULT_CDN_PDFJS;
                    if (!head) {
                        head = document.createElement("head");
                        (_a = document.querySelector("html")) === null || _a === void 0 ? void 0 : _a.appendChild(head);
                    }
                    if (!head)
                        return [2 /*return*/];
                    if (document.querySelector("script[src=\"".concat(cdn, "\"]"))) {
                        return [2 /*return*/, this.pdfLoaded()];
                    }
                    script = document.createElement("script");
                    script.src = cdn;
                    script.setAttribute("crossorigin", "anonymous");
                    script.setAttribute("integrity", DEFAULT_INTEGRITY);
                    script.setAttribute("referrerpolicy", "no-referrer");
                    head.appendChild(script);
                    script.onload = this.pdfLoaded;
                    this.remove = function () { return head === null || head === void 0 ? void 0 : head.removeChild(script); };
                    return [2 /*return*/];
                });
            });
        };
        _this.pdfLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.initPdf()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadPDf()];
                    case 2:
                        _a.sent();
                        this.renderPage();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1.message || e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.loadResize = function () {
            if (_this.timeoutRender)
                clearTimeout(_this.timeoutRender);
            _this.timeoutRender = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var debug, onStartLoad;
                return __generator(this, function (_a) {
                    debug = this.props.debug;
                    if (debug && __DEV__) {
                        console.info("Resize PDF");
                    }
                    onStartLoad = this.props.onStartLoad;
                    onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
                    this.renderPage();
                    return [2 /*return*/];
                });
            }); }, 100);
        };
        _this.initPdf = function () { return __awaiter(_this, void 0, void 0, function () {
            var interval, loop;
            return __generator(this, function (_a) {
                loop = 0;
                return [2 /*return*/, new Promise(function (res, rej) {
                        var _a;
                        var pdfjsLib = (_a = window === null || window === void 0 ? void 0 : window.globalThis) === null || _a === void 0 ? void 0 : _a.pdfjsLib;
                        if (!pdfjsLib) {
                            interval = setInterval(function () {
                                var _a, _b;
                                loop++;
                                if (((_a = window === null || window === void 0 ? void 0 : window.globalThis) === null || _a === void 0 ? void 0 : _a.pdfjsLib) || loop === 60) {
                                    pdfjsLib = (_b = window === null || window === void 0 ? void 0 : window.globalThis) === null || _b === void 0 ? void 0 : _b.pdfjsLib;
                                    if (pdfjsLib) {
                                        pdfjsLib.GlobalWorkerOptions.workerSrc = DEFAULT_CDN_WORKER;
                                        res(null);
                                    }
                                    else
                                        rej("Browser loaded PDFJs Failed");
                                    clearInterval(interval);
                                }
                            }, 100);
                        }
                        else {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = DEFAULT_CDN_WORKER;
                            res(null);
                        }
                    })];
            });
        }); };
        _this.loadPDf = function (props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var url;
                var _this = this;
                return __generator(this, function (_a) {
                    url = props.url;
                    if (!url)
                        return [2 /*return*/];
                    return [2 /*return*/, new Promise(function (res, rej) {
                            var pdfjsLib = window.globalThis.pdfjsLib;
                            var loadingTask = pdfjsLib.getDocument(url);
                            loadingTask.promise.then(function (pdf) { return _this.setPdf(pdf, res); }).catch(rej);
                        })];
                });
            });
        };
        _this.setPdf = function (pdf, callback) {
            _this.pdf = pdf;
            callback(pdf);
        };
        _this.renderPage = function (props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var onLoaded, page, pagePdf, totalPages, promises, i, pagePdf;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.pdf)
                                return [2 /*return*/];
                            if (this.refCanvasWrap)
                                this.refCanvasWrap.innerHTML = "";
                            onLoaded = props.onLoaded, page = props.page;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 11, , 12]);
                            if (!page) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.pdf.getPage(page)];
                        case 2:
                            pagePdf = _b.sent();
                            return [4 /*yield*/, this.renderPdf(pagePdf, props, page)];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 4:
                            totalPages = this.pdf.numPages;
                            promises = [];
                            i = 1;
                            _b.label = 5;
                        case 5:
                            if (!(i <= totalPages)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.pdf.getPage(i)];
                        case 6:
                            pagePdf = _b.sent();
                            promises.push(this.renderPdf(pagePdf, props, i));
                            _b.label = 7;
                        case 7:
                            i++;
                            return [3 /*break*/, 5];
                        case 8: return [4 /*yield*/, Promise.all(promises)];
                        case 9:
                            _b.sent();
                            _b.label = 10;
                        case 10:
                            onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded();
                            return [3 /*break*/, 12];
                        case 11:
                            _b.sent();
                            onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded();
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        _this.renderPdf = function (pagePdf, props, page) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var width, _a, keywords, _b, scale, pageSearch, allowHtml, _c, maxKeywordLength, div, id, canvas, ctx, viewport, size, newScale, exist, renderTask, promiseAll;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!this.refCanvasWrap)
                                return [2 /*return*/];
                            width = this.refCanvasWrap.getBoundingClientRect().width;
                            _a = props.keywords, keywords = _a === void 0 ? [] : _a, _b = props.scale, scale = _b === void 0 ? 1 : _b, pageSearch = props.pageSearch, allowHtml = props.allowHtml, _c = props.maxKeywordLength, maxKeywordLength = _c === void 0 ? 2000 : _c;
                            div = document.createElement("div");
                            div.id = "wrap-canvas-page-".concat(page);
                            div.style.position = "relative";
                            id = "canvas-page-".concat(page);
                            canvas = document.createElement("canvas");
                            canvas.id = id;
                            div.appendChild(canvas);
                            ctx = canvas.getContext("2d");
                            if (!ctx)
                                return [2 /*return*/];
                            viewport = pagePdf.getViewport({ scale: 1 });
                            size = viewport;
                            newScale = Math.ceil(width / viewport.width);
                            if (newScale < scale) {
                                newScale = scale;
                            }
                            exist = document.querySelector("#".concat(id));
                            if (exist)
                                this.refCanvasWrap.removeChild(exist);
                            this.refCanvasWrap.appendChild(div);
                            viewport = pagePdf.getViewport({ scale: newScale });
                            if (allowHtml) {
                                this.appendTextToCanvas(pagePdf, div, newScale, viewport.width / width);
                            }
                            canvas.style.width = "".concat(width, "px");
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            return [4 /*yield*/, pagePdf.render({ canvasContext: ctx, viewport: viewport })];
                        case 1:
                            renderTask = _d.sent();
                            return [4 /*yield*/, renderTask.promise];
                        case 2:
                            _d.sent();
                            if (pageSearch && pageSearch !== page)
                                return [2 /*return*/];
                            promiseAll = keywords.map(function (keyword) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (maxKeywordLength && keyword.length > maxKeywordLength) {
                                        console.warn("Keywords are too big: " + keyword.length + " characters");
                                    }
                                    return [2 /*return*/, this.hightlightText(pagePdf, keyword, ctx, __assign(__assign({}, size), { scale: newScale }), props)];
                                });
                            }); });
                            return [2 /*return*/, Promise.all(promiseAll)];
                    }
                });
            });
        };
        _this.appendTextToCanvas = function (pagePdf, parent, scale, scaleReal) { return __awaiter(_this, void 0, void 0, function () {
            var _a, items, styles, i, item, style, div;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pagePdf.getTextContent()];
                    case 1:
                        _a = _b.sent(), items = _a.items, styles = _a.styles;
                        for (i = 0; i < items.length; i++) {
                            item = items[i];
                            style = styles[item.fontName];
                            div = document.createElement("div");
                            div.style.position = "absolute";
                            div.style.color = "transparent";
                            div.style.fontFamily = style.fontFamily;
                            div.style.fontSize = "".concat((item.transform[3] * scale) / scaleReal, "px");
                            div.style.letterSpacing = "".concat(0.3, "px");
                            div.style.minWidth = "".concat((item.width * scale) / scaleReal, "px");
                            div.style.left = "".concat((item.transform[4] * scale) / scaleReal, "px");
                            div.style.bottom = "".concat((item.transform[5] * scale) / scaleReal, "px");
                            div.innerHTML = item.str;
                            parent.appendChild(div);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        _this.makeSpacing = function (width, str, scale, ctx, spacing, indexLoop) {
            var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (isSafari || indexLoop > 500)
                return spacing;
            var _a = _this.props.extractLetterSpacing, extractLetterSpacing = _a === void 0 ? 0.1 : _a;
            ctx.save();
            ctx.letterSpacing = "".concat(spacing * scale, "px");
            var w = ctx.measureText(str).width;
            ctx.restore();
            if (Math.floor(w / scale) - 4 * scale <= Math.floor(width) &&
                Math.floor(w / scale) + 4 * scale >= Math.floor(width)) {
                return spacing;
            }
            indexLoop++;
            if (Math.floor(w / scale) > Math.floor(width)) {
                return _this.makeSpacing(width, str, scale, ctx, spacing - extractLetterSpacing, indexLoop);
            }
            return _this.makeSpacing(width, str, scale, ctx, spacing + extractLetterSpacing, indexLoop);
        };
        _this.hightlightText = function (pagePdf, keyword, ctx, viewport, props) {
            if (props === void 0) { props = _this.props; }
            return __awaiter(_this, void 0, void 0, function () {
                var _a, items, styles, findObject, objects, indexBegin, end, _b, colorHighlight, isBorderHighlight, indexSub, index, object, str, style, indexLoop, spacing, w1, w2, textEnd, w, x, y;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!keyword)
                                return [2 /*return*/];
                            return [4 /*yield*/, pagePdf.getTextContent()];
                        case 1:
                            _a = _c.sent(), items = _a.items, styles = _a.styles;
                            findObject = this.findObjects(items, keyword);
                            objects = findObject.objects, indexBegin = findObject.begin, end = findObject.end;
                            if (indexBegin < 0)
                                return [2 /*return*/];
                            if (!objects.length)
                                return [2 /*return*/];
                            _b = props.colorHighlight, colorHighlight = _b === void 0 ? "yellow" : _b, isBorderHighlight = props.isBorderHighlight;
                            indexSub = indexBegin;
                            for (index = 0; index < objects.length; index++) {
                                object = objects[index];
                                str = object.str;
                                style = styles[object.fontName];
                                ctx.save();
                                ctx.beginPath();
                                ctx.font = "".concat(object.transform[3] * viewport.scale, "px ").concat(style.fontFamily);
                                indexLoop = 0;
                                spacing = this.makeSpacing(object.width, str, viewport.scale, ctx, 0.3, indexLoop);
                                ctx.letterSpacing = "".concat(spacing, "px");
                                w1 = 0;
                                w2 = 0;
                                if (!index) {
                                    w1 = ctx.measureText(str.substring(0, indexSub)).width;
                                    w2 = ctx.measureText(str.substring(indexSub + keyword.length, str.length)).width;
                                }
                                else if (index === objects.length - 1) {
                                    textEnd = str.slice(end, str.length);
                                    w2 = ctx.measureText(textEnd).width;
                                }
                                w = (object.width - (w1 + w2) / viewport.scale) * viewport.scale;
                                x = Math.floor(object.transform[4] + w1 / viewport.scale);
                                if (isBorderHighlight) {
                                    ctx.strokeStyle = colorHighlight;
                                    ctx.lineWidth = 1;
                                    ctx.globalAlpha = 1;
                                }
                                else {
                                    ctx.fillStyle = colorHighlight;
                                    ctx.globalAlpha = 0.2;
                                }
                                y = viewport.height -
                                    object.transform[5] -
                                    object.height +
                                    style.ascent -
                                    style.descent;
                                if (!isBorderHighlight) {
                                    ctx.fillRect(x * viewport.scale - viewport.scale / 2, y * viewport.scale, w, object.height * viewport.scale);
                                }
                                else {
                                    ctx.strokeRect(x * viewport.scale - viewport.scale / 2, y * viewport.scale, w, object.height * viewport.scale);
                                }
                                ctx.closePath();
                                ctx.restore();
                                indexSub += str.length;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        _this.parseKeyword = function (word) {
            var specialWordRemoves = _this.props.specialWordRemoves;
            var keyword = word.replace(/\n/g, " ").trim();
            specialWordRemoves === null || specialWordRemoves === void 0 ? void 0 : specialWordRemoves.forEach(function (key) {
                keyword = keyword.replaceAll(key, " ");
            });
            return keyword;
        };
        _this.deleteSpace = function (word) {
            return word.replaceAll(" ", "");
        };
        _this.findObjects = function (contents, keyword) {
            var _a = _this.props, debug = _a.debug, _b = _a.maxKeywordLength, maxKeywordLength = _b === void 0 ? 2000 : _b;
            var stringSearch = _this.parseKeyword(keyword).substring(0, maxKeywordLength || 2000);
            var object = contents.find(function (e) { return e.str.includes(stringSearch); });
            if (debug && __DEV__) {
                console.log("------------------------------ INFO ------------------------------");
                console.info(contents);
            }
            if (object) {
                var strs = _this.parseKeyword(object.str).split(stringSearch);
                var _c = {
                    startIndex: strs[0].length,
                    longestCommon: strs[0],
                }, startIndex = _c.startIndex, longestCommon = _c.longestCommon;
                if (debug && __DEV__) {
                    console.info("start matching => ", startIndex, "keyword => ", keyword);
                }
                return {
                    objects: [object],
                    begin: startIndex,
                    end: longestCommon.length,
                    matching: keyword,
                };
            }
            var values = {
                objects: [],
                begin: -1,
                end: -1,
                matching: "",
            };
            for (var i = 0; i < contents.length; i++) {
                var str = _this.parseKeyword(contents[i].str);
                if (!str.trim())
                    continue;
                if (!values.objects.length) {
                    var _d = _this.get_end_pdf_Is_start_search(str, stringSearch), startIndex_1 = _d.startIndex, longestCommon_1 = _d.longestCommon;
                    if (startIndex_1 > -1) {
                        values.objects.push(contents[i]);
                        values.begin = startIndex_1;
                        values.matching = longestCommon_1;
                        stringSearch = stringSearch.trim().replace(longestCommon_1.trim(), "");
                        if (debug && __DEV__) {
                            console.info("get_end_pdf_Is_start_search", "start matching => ", startIndex_1, "keyword => ", longestCommon_1, "object begin => ", contents[i]);
                        }
                    }
                    continue;
                }
                if (!stringSearch.trim())
                    break;
                var _e = _this.get_start_pdf_Is_start_search(str, stringSearch), startIndex = _e.startIndex, longestCommon = _e.longestCommon;
                if (startIndex > -1) {
                    values.objects.push(contents[i]);
                    values.matching += longestCommon;
                    stringSearch = stringSearch
                        .trim()
                        .substring(startIndex + longestCommon.length, stringSearch.length);
                    values.end = longestCommon.length;
                    if (debug && __DEV__) {
                        console.info(values.matching);
                    }
                }
                else {
                    if (debug && __DEV__) {
                        if (debug && __DEV__) {
                            console.error("------------------------------ NOT MATCH ------------------------------");
                            console.log("string check", str);
                            console.log("string search", stringSearch);
                            console.error("------------------------------ NOT MATCH ------------------------------");
                        }
                    }
                    values.objects = [];
                    values.begin = -1;
                    values.end = -1;
                    values.matching = "";
                    stringSearch = _this.parseKeyword(keyword);
                }
            }
            if (debug && __DEV__) {
                console.log("------------------------------ INFO ------------------------------");
            }
            return values;
        };
        return _this;
    }
    PDFHighlight.prototype.componentDidMount = function () {
        var _this = this;
        var onStartLoad = this.props.onStartLoad;
        onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
        this.appendScript();
        window.addEventListener("resize", this.loadResize);
        this.removeResize = function () {
            window.removeEventListener("resize", _this.loadResize);
        };
    };
    PDFHighlight.prototype.shouldComponentUpdate = function (nProps) {
        var _this = this;
        var _a = this.props, width = _a.width, keywords = _a.keywords, onStartLoad = _a.onStartLoad, styleWrap = _a.styleWrap, debug = _a.debug, url = _a.url;
        var keys = [
            "scale",
            "page",
            "pageSearch",
            "isBorderHighlight",
            "colorHighlight",
        ];
        if (url !== nProps.url) {
            if (debug && __DEV__) {
                console.info("Reload key change => ", keys.find(function (key) { return _this.props[key] !== nProps[key]; }));
            }
            onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
            this.loadPDf(nProps).then(function () { return _this.renderPage(nProps); });
        }
        else if (!this.isEqualKeyword(nProps.keywords, keywords) ||
            !this.isObjectEqual(styleWrap, nProps.styleWrap) ||
            keys.some(function (key) { return _this.props[key] !== nProps[key]; })) {
            if (debug && __DEV__) {
                console.info("Reload keyword or style => ", "keyword ? ", this.isEqualKeyword(nProps.keywords, keywords), ", styleWrap ? ", this.isObjectEqual(styleWrap, nProps.styleWrap));
            }
            onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
            this.renderPage(nProps);
        }
        return width !== nProps.width;
    };
    PDFHighlight.prototype.componentWillUnmount = function () {
        var _a, _b;
        (_a = this.remove) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.removeResize) === null || _b === void 0 ? void 0 : _b.call(this);
    };
    PDFHighlight.prototype.get_end_pdf_Is_start_search = function (pdf, search) {
        var startIndex = -1;
        var length = Math.min(pdf.length, search.length);
        var longestCommon = "";
        var strBTrim = this.deleteSpace(search);
        for (var i = length; i > 0; i--) {
            var partOfString1 = pdf.substring(pdf.length - i);
            if (strBTrim.startsWith(this.deleteSpace(partOfString1))) {
                startIndex = pdf.length - i;
                longestCommon = partOfString1;
                break;
            }
        }
        return { longestCommon: longestCommon, startIndex: startIndex };
    };
    PDFHighlight.prototype.get_start_pdf_Is_start_search = function (pdf, search) {
        var startIndex = -1;
        var length = Math.min(pdf.length, search.length);
        var longestCommon = "";
        var strBTrim = this.deleteSpace(search);
        for (var i = 1; i <= length; i++) {
            var partOfString1 = pdf.substring(0, i);
            if (strBTrim.startsWith(this.deleteSpace(partOfString1))) {
                startIndex = i - partOfString1.length;
                longestCommon = partOfString1;
            }
        }
        return { longestCommon: longestCommon, startIndex: startIndex };
    };
    PDFHighlight.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.width, width = _b === void 0 ? "100%" : _b, styleWrap = _a.styleWrap;
        return (jsxRuntime.jsx("div", { ref: function (ref) { return (_this.refCanvasWrap = ref); }, style: __assign({ width: width, minHeight: "100%", overflow: "auto" }, (styleWrap || {})) }));
    };
    return PDFHighlight;
}(react.Component));

exports.PDFHighlight = PDFHighlight;
//# sourceMappingURL=index.js.map
