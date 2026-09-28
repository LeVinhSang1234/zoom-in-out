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

var DEFAULT_CDN_PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
var DEFAULT_CDN_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
var DEFAULT_INTEGRITY = "sha512-q+4liFwdPC/bNdhUpZx6aXDx/h77yEQtn4I1slHydcbZK34nLaR3cAeYSJshoxIOq3mjEf7xJE8YWIUHMn+oCQ==";
var PDFJS_DIST = "https://cdn.jsdelivr.net/npm/pdfjs-dist@";
// cdnjs does not serve the cmaps; needed for CJK PDFs using predefined CMaps.
var cMapUrlFor = function (lib) {
    return "".concat(PDFJS_DIST).concat(lib.version || "3.11.174", "/cmaps/");
};
// pdf.js refuses a worker from another version, so match the library's.
var workerFor = function (lib) {
    if (!lib.version)
        return DEFAULT_CDN_WORKER;
    var ext = parseInt(lib.version, 10) >= 4 ? "mjs" : "js";
    return "".concat(PDFJS_DIST).concat(lib.version, "/build/pdf.worker.min.").concat(ext);
};
// Keeps a worker the app configured; otherwise points at a matching one.
// Lowercase keeping the length (a char whose lowercase is longer stays as is).
var lowerEach = function (s) {
    return s
        .split("")
        .map(function (c) {
        var l = c.toLowerCase();
        return l.length === 1 ? l : c;
    })
        .join("");
};
// Whole-string toLowerCase gives the same text unless a char lowercases to two
// units (length changes), a Sigma (final-form rule) or a surrogate is present.
var lowerChars = function (s) {
    var l = s.toLowerCase();
    return l.length === s.length && !/[\u03a3\ud800-\udfff]/.test(s)
        ? l
        : lowerEach(s);
};
// Exactly the chars /\s/ matches.
var isSpace = function (c) {
    return c <= 32
        ? c === 32 || (c >= 9 && c <= 13)
        : c >= 0xa0 &&
            (c === 0xa0 ||
                c === 0x1680 ||
                (c >= 0x2000 && c <= 0x200a) ||
                c === 0x2028 ||
                c === 0x2029 ||
                c === 0x202f ||
                c === 0x205f ||
                c === 0x3000 ||
                c === 0xfeff);
};
var colorCtx;
// A CSS color as the canvas normalizes it ("#rrggbb" or "rgba(...)").
var normColor = function (color) {
    colorCtx = colorCtx || document.createElement("canvas").getContext("2d");
    if (!colorCtx)
        return color;
    colorCtx.fillStyle = "#000";
    colorCtx.fillStyle = color;
    return String(colorCtx.fillStyle);
};
// The same color at 70% brightness.
var darker = function (color) {
    var c = normColor(color);
    var hex = /^#([0-9a-f]{6})$/i.exec(c);
    var rgb = hex
        ? [16, 8, 0].map(function (s) { return (parseInt(hex[1], 16) >> s) & 255; })
        : (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    if (rgb.length < 3)
        return color;
    var _a = rgb.map(function (v) { return Math.round(v * 0.7); }), r = _a[0], g = _a[1], b = _a[2];
    return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
};
var withWorker = function (lib) {
    var options = lib.GlobalWorkerOptions;
    if (!options.workerSrc && !options.workerPort) {
        options.workerSrc = workerFor(lib);
    }
    return lib;
};
var SERIF_FAMILY = /times|roman|serif|georgia|cambria|garamond|book|palatino/i;
var systemFamilyOf = function (name) {
    var base = name
        .replace(/^[A-Z]{6}\+/, "")
        .split(/[-,]/)[0]
        .replace(/(?:PSMT|PS|MT)$/, "");
    return base.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
};
var MAX_CANVAS_PIXELS = 8e6; // iOS Safari caps a canvas at 16.7M px
var MAX_CONCURRENT_RENDERS = 2;
// Pages within one viewport above/below the visible area get rendered; pages
// that leave this band release their canvases.
var RENDER_MARGIN = "100% 0px";
// Props that only change the highlight overlay (no re-rasterization).
var HIGHLIGHT_KEYS = [
    "keywords",
    "colorHighlight",
    "colorKeyword",
    "isBorderHighlight",
    "pageSearch",
    "specialWordRemoves",
    "maxKeywordLength",
    "replaceTexts",
];
// Props that change the page bitmaps.
var RASTER_KEYS = ["scale", "page", "allowHtml"];
var USER_SCROLL_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"];
// A change scrolls to the first match (replaceTexts edits do not).
var SEARCH_KEYS = [
    "keywords",
    "pageSearch",
    "page",
    "specialWordRemoves",
    "maxKeywordLength",
];
var sameShallow = function (a, b) {
    return a === b ||
        (!!a &&
            !!b &&
            typeof a === "object" &&
            typeof b === "object" &&
            Object.keys(a).length === Object.keys(b).length &&
            Object.keys(a).every(function (k) { return a[k] === b[k]; }));
};
// Arrays compare by content (inline literals like replaceTexts={[{...}]} are
// new objects on every parent render).
var sameValue = function (a, b) {
    return a === b ||
        (Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every(function (x, i) { return sameShallow(x, b[i]); }));
};
// pdf.js already on the page: a <script> build or a UMD bundle.
var globalPdfJs = function () {
    var g = window.globalThis;
    return g.pdfjsLib || g["pdfjs-dist/build/pdf"];
};
// The page's pdf.js if it has one, else one shared cdnjs <script> for every
// instance; rejects (and allows a retry) on error.
var pdfjsPromise;
var pdfjsFrom = ""; // "global" or "cdnjs", for debug output
var instances = 0;
var loadPdfJs = function () {
    return (pdfjsPromise !== null && pdfjsPromise !== void 0 ? pdfjsPromise : (pdfjsPromise = new Promise(function (res, rej) {
        var ready = function () {
            var lib = globalPdfJs();
            if (!lib)
                return rej(new Error("pdf.js loaded but pdfjsLib is missing"));
            pdfjsFrom = pdfjsFrom || "cdnjs";
            res(withWorker(lib));
        };
        if (globalPdfJs()) {
            pdfjsFrom = "global";
            return ready();
        }
        var script = document.createElement("script");
        script.src = DEFAULT_CDN_PDFJS;
        script.crossOrigin = "anonymous";
        script.integrity = DEFAULT_INTEGRITY;
        script.referrerPolicy = "no-referrer";
        script.onload = ready;
        script.onerror = function () {
            script.remove();
            pdfjsPromise = undefined;
            rej(new Error("Failed to load pdf.js from ".concat(DEFAULT_CDN_PDFJS)));
        };
        document.head.appendChild(script);
        // Warm the HTTP cache with the worker (1 MB) meanwhile, instead of pdf.js
        // starting that download only once this script has run.
        if (typeof fetch === "function") {
            fetch(workerFor({ version: "3.11.174" }), { mode: "no-cors" }).catch(function () { return undefined; });
        }
    })));
};
var PDFHighlight = /** @class */ (function (_super) {
    __extends(PDFHighlight, _super);
    function PDFHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = "[PDFHighlight#".concat(++instances, "]");
        _this.warned = new Set();
        _this.failed = new Set(); // pages not retried until scrolled in again
        _this.loadReq = 0;
        _this.renderGen = 0;
        _this.paintGen = 0;
        _this.unmounted = false;
        _this.renderedWidth = 0;
        _this.slots = new Map(); // placeholder per page
        _this.visible = new Set(); // pages inside RENDER_MARGIN
        _this.active = new Set(); // pages with a render in flight
        _this.pages = new Map(); // pages that have canvases
        _this.textCache = new Map();
        _this.textGen = 0; // bumped when replaceTexts / specialWordRemoves change
        _this.searchText = new Map(); // page -> lowercased shown text
        _this.scrollReq = 0;
        _this.scrollOnLayout = false;
        _this.warnOnce = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (_this.warned.has(key))
                return;
            _this.warned.add(key);
            console.warn.apply(console, __spreadArray([_this.tag], args, false));
        };
        // A real failure outside the load path: not a cancellation, and not a page
        // that went away meanwhile.
        _this.fail = function (key, e, page) {
            if (_this.isCancelled(e))
                return;
            if (page !== undefined && !_this.pages.has(page))
                return;
            _this.warnOnce(key, e);
        };
        // Reads onLoaded when called; an error nobody handles is still printed.
        _this.loaded = function (error) {
            var _a = _this.props, onLoaded = _a.onLoaded, debug = _a.debug;
            if (error && (!onLoaded || debug))
                console.error(_this.tag, error);
            onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded(error);
        };
        _this.startLoad = function () {
            var _a = _this.props, url = _a.url, onStartLoad = _a.onStartLoad;
            if (!url) {
                _this.loadPDf().catch(function () { return undefined; }); // only releases the old document
                return;
            }
            onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
            _this.scrollOnLayout = true;
            _this.loadPDf()
                .then(function (ok) { return (ok ? _this.renderPage() : undefined); })
                .catch(_this.loaded);
        };
        _this.loadPDf = function () { return __awaiter(_this, void 0, void 0, function () {
            var req, _a, url, pdfjs, start, task, own, lib, _b, pdf, worker, e_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        req = ++this.loadReq;
                        _a = this.props, url = _a.url, pdfjs = _a.pdfjs;
                        this.releaseDocument();
                        if (!url)
                            return [2 /*return*/, false];
                        start = Date.now();
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, , 7]);
                        own = pdfjs && (pdfjs.getDocument ? pdfjs : pdfjs.default);
                        if (pdfjs && !own) {
                            this.warnOnce("pdfjs", "the pdfjs prop has no getDocument; using cdnjs");
                        }
                        if (!own) return [3 /*break*/, 2];
                        _b = withWorker(own);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, loadPdfJs()];
                    case 3:
                        _b = _d.sent();
                        _d.label = 4;
                    case 4:
                        lib = _b;
                        if (req !== this.loadReq)
                            return [2 /*return*/, false];
                        this.lib = lib;
                        task = lib.getDocument({
                            url: url,
                            isEvalSupported: false,
                            cMapUrl: cMapUrlFor(lib),
                            cMapPacked: true,
                        });
                        this.loadingTask = task;
                        return [4 /*yield*/, task.promise];
                    case 5:
                        pdf = _d.sent();
                        if (req !== this.loadReq)
                            return [2 /*return*/, false];
                        this.pdf = pdf;
                        worker = lib.GlobalWorkerOptions;
                        (_c = this.log) === null || _c === void 0 ? void 0 : _c.info(this.tag, "loaded", {
                            pdfjs: lib.version,
                            from: own ? "prop" : pdfjsFrom,
                            worker: worker.workerPort ? "workerPort" : worker.workerSrc,
                            pages: pdf.numPages,
                            ms: Date.now() - start,
                        });
                        return [2 /*return*/, true];
                    case 6:
                        e_1 = _d.sent();
                        if (req !== this.loadReq)
                            return [2 /*return*/, false]; // superseded or unmounted
                        throw e_1;
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        _this.releaseDocument = function () {
            var _a;
            _this.resetPages();
            ++_this.scrollReq;
            _this.pendingScroll = undefined;
            _this.warned.clear();
            _this.renderedWidth = 0;
            _this.textCache.clear();
            _this.searchText.clear();
            _this.pdf = undefined;
            // Terminates this document's Web Worker and unregisters its fonts.
            (_a = _this.loadingTask) === null || _a === void 0 ? void 0 : _a.destroy().catch(function () { return undefined; });
            _this.loadingTask = undefined;
            if (_this.refCanvasWrap)
                _this.refCanvasWrap.innerHTML = "";
        };
        // Ends the current pass: in-flight work is cancelled and canvases freed.
        _this.resetPages = function () {
            var _a, _b;
            ++_this.renderGen;
            ++_this.paintGen;
            (_a = _this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
            _this.observer = undefined;
            Array.from(_this.pages.keys()).forEach(_this.evict);
            _this.slots.clear();
            _this.visible.clear();
            _this.active.clear();
            _this.failed.clear();
            _this.pageError = undefined;
            // Let a pending renderPage settle; its generation check skips onLoaded.
            (_b = _this.onIdle) === null || _b === void 0 ? void 0 : _b.call(_this);
            _this.onIdle = undefined;
        };
        _this.evict = function (page) {
            var _a;
            var entry = _this.pages.get(page);
            if (!entry)
                return;
            _this.pages.delete(page);
            (_a = entry.task) === null || _a === void 0 ? void 0 : _a.cancel();
            [entry.base, entry.hl, entry.found].forEach(function (c) {
                c.width = 0; // release the bitmap now (iOS keeps it until GC otherwise)
                c.height = 0;
            });
            entry.div.innerHTML = "";
            entry.pagePdf.cleanup();
        };
        _this.loadResize = function () {
            if (_this.timeoutRender)
                clearTimeout(_this.timeoutRender);
            _this.timeoutRender = setTimeout(function () {
                var _a, _b, _c;
                var wrap = _this.refCanvasWrap;
                if (!wrap || !_this.pdf || _this.unmounted)
                    return;
                var w = wrap.clientWidth;
                if (!w)
                    return; // hidden (display:none, closed tab/modal)
                var ratio = _this.renderedWidth ? w / _this.renderedWidth : 0;
                // Canvases are width:100%, so CSS absorbs small and height-only changes
                // (scrollbars, the iOS toolbar). Re-rasterize only when the bitmap would
                // be visibly soft (>10% upscale) or badly oversized.
                if (ratio && ratio <= 1.1 && ratio >= 0.75)
                    return;
                (_a = _this.log) === null || _a === void 0 ? void 0 : _a.info(_this.tag, "resize", w);
                // A render still owed (e.g. loaded while hidden) already signalled start.
                if (_this.renderedWidth)
                    (_c = (_b = _this.props).onStartLoad) === null || _c === void 0 ? void 0 : _c.call(_b);
                _this.renderPage();
            }, 150);
        };
        _this.isCancelled = function (e) { return (e === null || e === void 0 ? void 0 : e.name) === "RenderingCancelledException"; };
        // Lays out one placeholder per page, then rasterizes pages lazily as they
        // approach the viewport. onLoaded fires once the first visible batch is drawn.
        _this.renderPage = function () { return __awaiter(_this, void 0, void 0, function () {
            var pdf, wrap, gen, _a, page, pageSearch, nums, first, vp_1, frag_1, keep, error, e_2;
            var _this = this;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        pdf = this.pdf;
                        wrap = this.refCanvasWrap;
                        if (!pdf || !wrap)
                            return [2 /*return*/];
                        if (!wrap.clientWidth) {
                            // Hidden (display:none tab or modal): render once it gets a width.
                            this.renderedWidth = 0;
                            (_b = this.log) === null || _b === void 0 ? void 0 : _b.info(this.tag, "hidden, rendering when shown");
                            return [2 /*return*/];
                        }
                        this.resetPages();
                        gen = this.renderGen;
                        _a = this.props, page = _a.page, pageSearch = _a.pageSearch;
                        if (pageSearch && (pageSearch < 1 || pageSearch > pdf.numPages)) {
                            (_c = this.log) === null || _c === void 0 ? void 0 : _c.warn(this.tag, "pageSearch", pageSearch, "is not a page of 1 to", pdf.numPages);
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        nums = page
                            ? [page]
                            : Array.from({ length: pdf.numPages }, function (_, i) { return i + 1; });
                        return [4 /*yield*/, pdf.getPage(nums[0])];
                    case 2:
                        first = _d.sent();
                        if (gen !== this.renderGen)
                            return [2 /*return*/];
                        vp_1 = first.getViewport({ scale: 1 });
                        frag_1 = document.createDocumentFragment();
                        nums.forEach(function (n) {
                            var div = document.createElement("div");
                            div.dataset.page = String(n); // per instance, no global ids
                            div.style.position = "relative";
                            div.style.aspectRatio = "".concat(vp_1.width, " / ").concat(vp_1.height);
                            frag_1.appendChild(div);
                            _this.slots.set(n, div);
                        });
                        keep = wrap.scrollHeight > wrap.clientHeight
                            ? wrap.scrollTop / wrap.scrollHeight
                            : 0;
                        wrap.innerHTML = "";
                        wrap.appendChild(frag_1);
                        if (keep)
                            wrap.scrollTop = keep * wrap.scrollHeight;
                        this.renderedWidth = wrap.clientWidth;
                        if (this.scrollOnLayout) {
                            this.scrollOnLayout = false;
                            this.scrollToMatch();
                        }
                        return [4 /*yield*/, this.observePages(wrap, gen)];
                    case 3:
                        error = _d.sent();
                        if (gen === this.renderGen)
                            this.loaded(error);
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _d.sent();
                        if (gen === this.renderGen && !this.isCancelled(e_2))
                            this.loaded(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        _this.observePages = function (wrap, gen) {
            return new Promise(function (resolve) {
                _this.onIdle = resolve;
                if (typeof IntersectionObserver === "undefined") {
                    _this.slots.forEach(function (_, n) { return _this.visible.add(n); });
                    _this.pump(gen);
                    return;
                }
                // The wrapper is the root when it scrolls itself; otherwise the viewport.
                var root = wrap.scrollHeight > wrap.clientHeight ? wrap : null;
                var observer = new IntersectionObserver(function (entries) {
                    if (gen !== _this.renderGen)
                        return;
                    entries.forEach(function (e) {
                        var _a;
                        var n = Number(e.target.dataset.page);
                        if (e.isIntersecting) {
                            _this.visible.add(n);
                        }
                        else {
                            if (_this.visible.delete(n) && ((_a = _this.pendingScroll) === null || _a === void 0 ? void 0 : _a.page) === n) {
                                _this.pendingScroll = undefined;
                            }
                            _this.failed.delete(n); // retried when it comes back
                            _this.evict(n);
                        }
                    });
                    _this.pump(gen);
                }, { root: root, rootMargin: RENDER_MARGIN });
                _this.observer = observer;
                _this.slots.forEach(function (div) { return observer.observe(div); });
            });
        };
        // Starts renders for visible pages, at most MAX_CONCURRENT_RENDERS at once.
        // In page order: a page above grows (reflow) before the ones below it are
        // painted, so a scroll to a match lands where it should.
        _this.pump = function (gen) {
            var queue = Array.from(_this.visible)
                .filter(function (n) { return !_this.pages.has(n) && !_this.active.has(n) && !_this.failed.has(n); })
                .sort(function (a, b) { return a - b; });
            var _loop_1 = function () {
                var n = queue.shift();
                _this.active.add(n);
                _this.renderPdf(n, gen)
                    .catch(function (e) {
                    if (gen !== _this.renderGen || _this.isCancelled(e))
                        return;
                    if (_this.onIdle)
                        _this.pageError = _this.pageError || e; // -> onLoaded
                    else
                        _this.warnOnce("page ".concat(n), "page", n, "failed to render:", e);
                })
                    .then(function () {
                    if (gen !== _this.renderGen)
                        return;
                    _this.active.delete(n);
                    // A page that did not render is not retried in a loop.
                    if (!_this.pages.has(n) && _this.visible.has(n))
                        _this.failed.add(n);
                    _this.pump(gen);
                });
            };
            while (_this.active.size < MAX_CONCURRENT_RENDERS && queue.length) {
                _loop_1();
            }
            if (!_this.active.size && _this.onIdle) {
                _this.onIdle(_this.pageError);
                _this.onIdle = undefined;
            }
        };
        _this.renderPdf = function (page, gen) { return __awaiter(_this, void 0, void 0, function () {
            var pdf, div, pagePdf, _a, _b, keywords, pageSearch, _c, replaceTexts, needText, text, readsBack, _d, start, _e, _f, scale, allowHtml, vp1, dpr, wanted, rasterScale, viewport, base, hl, found, ctx, entry;
            var _this = this;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        pdf = this.pdf;
                        div = this.slots.get(page);
                        if (!pdf || !div)
                            return [2 /*return*/];
                        return [4 /*yield*/, pdf.getPage(page)];
                    case 1:
                        pagePdf = _h.sent();
                        if (gen !== this.renderGen || !this.visible.has(page))
                            return [2 /*return*/];
                        _a = this.props, _b = _a.keywords, keywords = _b === void 0 ? [] : _b, pageSearch = _a.pageSearch, _c = _a.replaceTexts, replaceTexts = _c === void 0 ? [] : _c;
                        needText = this.props.allowHtml ||
                            replaceTexts.length > 0 ||
                            (keywords.length > 0 && (!pageSearch || pageSearch === page));
                        text = needText ? this.getText(pagePdf, page) : undefined;
                        if (!(text && replaceTexts.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, text.then(function (tc) {
                                return _this.planReplacements(_this.buildIndex(tc.items, _this.props.specialWordRemoves || [])).length > 0;
                            }, function () { return false; })];
                    case 2:
                        _d = _h.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _d = false;
                        _h.label = 4;
                    case 4:
                        readsBack = _d;
                        if (gen !== this.renderGen || !this.visible.has(page))
                            return [2 /*return*/];
                        start = Date.now();
                        _e = this.props, _f = _e.scale, scale = _f === void 0 ? 1 : _f, allowHtml = _e.allowHtml;
                        vp1 = pagePdf.getViewport({ scale: 1 });
                        dpr = window.devicePixelRatio || 1;
                        wanted = Math.max(scale, (this.renderedWidth / vp1.width) * dpr);
                        rasterScale = Math.min(wanted, Math.sqrt(MAX_CANVAS_PIXELS / (vp1.width * vp1.height)));
                        viewport = pagePdf.getViewport({ scale: rasterScale });
                        div.style.aspectRatio = "".concat(vp1.width, " / ").concat(vp1.height);
                        base = document.createElement("canvas");
                        hl = document.createElement("canvas");
                        found = document.createElement("canvas");
                        [base, hl, found].forEach(function (c) {
                            // Overlays get their width (and memory) only once they draw something.
                            c.width = c === base ? Math.floor(viewport.width) : 0;
                            c.height = Math.floor(viewport.height);
                            c.style.display = "block";
                            c.style.width = "100%";
                        });
                        [hl, found].forEach(function (c) {
                            c.style.position = "absolute";
                            c.style.left = "0";
                            c.style.top = "0";
                            c.style.height = "100%";
                            c.style.pointerEvents = "none";
                        });
                        found.style.mixBlendMode = "multiply";
                        div.appendChild(base);
                        div.appendChild(hl);
                        div.appendChild(found);
                        ctx = base.getContext("2d", { willReadFrequently: readsBack });
                        if (!ctx) {
                            [base, hl, found].forEach(function (c) {
                                c.width = 0;
                                c.height = 0;
                                c.remove();
                            });
                            throw new Error("no 2D canvas context (canvas memory limit?)");
                        }
                        entry = {
                            pagePdf: pagePdf,
                            div: div,
                            base: base,
                            hl: hl,
                            found: found,
                            viewport: viewport,
                            vp1: vp1,
                            colors: new Map(),
                        };
                        this.pages.set(page, entry);
                        entry.task = pagePdf.render({ canvasContext: ctx, viewport: viewport });
                        return [4 /*yield*/, Promise.all([entry.task.promise, text])];
                    case 5:
                        _h.sent();
                        // Once rendered, pdf.js has loaded the PDF's own fonts, so measured text
                        // (reflowed paragraphs, highlight offsets) matches the page.
                        entry.ready = true;
                        (_g = this.log) === null || _g === void 0 ? void 0 : _g.info(this.tag, "page", page, "rendered", {
                            ms: Date.now() - start,
                            canvas: "".concat(base.width, "x").concat(base.height),
                            capped: rasterScale < wanted,
                        });
                        return [4 /*yield*/, Promise.all([
                                allowHtml ? this.appendTextToCanvas(entry, page) : undefined,
                                this.paintPage(page, this.paintGen),
                            ])];
                    case 6:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.getText = function (pagePdf, page) {
            var p = _this.textCache.get(page);
            if (!p) {
                var created_1 = pagePdf.getTextContent();
                _this.textCache.set(page, created_1);
                created_1.catch(function () {
                    if (_this.textCache.get(page) === created_1)
                        _this.textCache.delete(page);
                });
                p = created_1;
            }
            return p;
        };
        _this.repaintHighlights = function () {
            var paint = ++_this.paintGen;
            _this.pages.forEach(function (_, page) {
                _this.paintPage(page, paint).catch(function (e) { return _this.fail("paint ".concat(page), e, page); });
            });
        };
        _this.paintPage = function (page, paint) { return __awaiter(_this, void 0, void 0, function () {
            var entry, ctx, foundCtx, _a, _b, keywords, pageSearch, _c, replaceTexts, colorHighlight, isBorderHighlight, px, hlKey, keepHl, search, tc, p, removes, laid, items, reps, flows, grow, height, resized, replaced, matches, shown;
            var _this = this;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        entry = this.pages.get(page);
                        ctx = entry === null || entry === void 0 ? void 0 : entry.hl.getContext("2d");
                        foundCtx = entry === null || entry === void 0 ? void 0 : entry.found.getContext("2d");
                        if (!entry || !ctx || !foundCtx)
                            return [2 /*return*/];
                        _a = this.props, _b = _a.keywords, keywords = _b === void 0 ? [] : _b, pageSearch = _a.pageSearch, _c = _a.replaceTexts, replaceTexts = _c === void 0 ? [] : _c, colorHighlight = _a.colorHighlight, isBorderHighlight = _a.isBorderHighlight;
                        px = !isBorderHighlight
                            ? 0
                            : entry.hl.clientWidth
                                ? entry.base.width / entry.hl.clientWidth
                                : window.devicePixelRatio || 1;
                        hlKey = "".concat(this.textGen, "|").concat(colorHighlight, "|").concat(px);
                        keepHl = !!replaceTexts.length && entry.hlKey === hlKey;
                        if (!keepHl) {
                            entry.hlKey = undefined;
                            ctx.clearRect(0, 0, entry.hl.width, entry.hl.height);
                        }
                        foundCtx.clearRect(0, 0, entry.found.width, entry.found.height);
                        search = !!keywords.length && (!pageSearch || pageSearch === page);
                        if (!search && !replaceTexts.length) {
                            this.fitHeight(entry, 0);
                            this.own(entry, entry.hl, false);
                            this.own(entry, entry.found, false);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getText(entry.pagePdf, page)];
                    case 1:
                        tc = _e.sent();
                        if (paint !== this.paintGen || this.pages.get(page) !== entry)
                            return [2 /*return*/];
                        p = this.paintOf(entry, ctx, tc);
                        removes = this.props.specialWordRemoves || [];
                        laid = this.layoutOf(entry, p);
                        items = laid.items, reps = laid.reps, flows = laid.flows;
                        grow = flows.reduce(function (n, f) { return n + f.grow; }, 0);
                        height = entry.hl.height;
                        this.fitHeight(entry, Math.max(0, grow));
                        resized = this.own(entry, entry.hl, !!reps.length || !!flows.length);
                        this.own(entry, entry.found, search);
                        p.dyAt = function (x, y) { return _this.shiftOf(flows, x, y); };
                        if (keepHl && !resized && entry.hl.height === height) {
                            replaced = reps.filter(function (part) { return part === part.whole[0]; }).length;
                        }
                        else {
                            if (flows.some(function (f) { return f.grow; }))
                                this.shiftBelow(p, flows);
                            // Replacements first, so highlights stay visible on top of them.
                            replaced = this.drawReplacements(p, reps);
                            flows.forEach(function (flow) { return _this.drawFlow(p, flow); });
                            if (entry.ready)
                                entry.hlKey = hlKey;
                        }
                        matches = {};
                        if (search) {
                            shown = laid.shown ||
                                (laid.shown =
                                    !reps.length && !flows.length
                                        ? laid.original
                                        : this.buildIndex(items, removes, reps));
                            matches = this.drawHighlights(p, shown, foundCtx);
                            entry.lastPaint = { gen: paint, p: p, shown: shown };
                            this.finishScroll(entry, page, p, shown);
                        }
                        if (Object.keys(matches).length || replaced || flows.length) {
                            (_d = this.log) === null || _d === void 0 ? void 0 : _d.info(this.tag, "page", page, {
                                matches: matches,
                                replaced: replaced,
                                reflowed: flows.length,
                                grownPx: Math.round(grow),
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        // An overlay canvas gets the page's width only while it has something to
        // show, so an empty one holds no memory. Resizing clears it.
        _this.own = function (entry, c, on) {
            var w = on ? entry.base.width : 0;
            if (c.width === w)
                return false;
            c.width = w;
            return true;
        };
        _this.fitHeight = function (entry, grow) {
            var height = entry.base.height + Math.ceil(grow);
            if (entry.hl.height !== height)
                entry.hl.height = height;
            if (entry.found.height !== height)
                entry.found.height = height;
            entry.div.style.aspectRatio = "".concat(entry.vp1.width, " / ").concat((entry.vp1.height * height) / entry.base.height);
        };
        _this.shiftOf = function (flows, x, y) {
            return flows.reduce(function (n, f) {
                return f.grow && (y >= f.end || (y >= f.bottom && x >= f.x0 && x <= f.x1))
                    ? n + f.grow
                    : n;
            }, 0);
        };
        _this.shiftBelow = function (p, flows) {
            var ctx = p.ctx, base = p.base;
            var move = function (x0, y0, x1, y1, before, after) {
                var left = Math.max(0, Math.floor(x0));
                var right = Math.min(base.width, Math.ceil(x1));
                var top = Math.max(0, Math.floor(y0));
                var bottom = Math.min(base.height, Math.ceil(y1));
                if (right <= left || bottom <= top)
                    return;
                var paper = _this.colorsAt(p, [
                    { x: left, y: top, w: right - left, h: 4 },
                ]).paper;
                var from = top + Math.min(before, after);
                ctx.fillStyle = paper;
                ctx.fillRect(left, from, right - left, ctx.canvas.height - from);
                ctx.drawImage(base, left, top, right - left, bottom - top, left, top + after, right - left, bottom - top);
            };
            ctx.save();
            flows
                .filter(function (f) { return f.grow; })
                .sort(function (a, b) { return a.bottom - b.bottom; })
                .forEach(function (f) {
                var mid = (Math.max(0, f.x0) + Math.min(base.width, f.x1)) / 2;
                if (f.end > f.bottom) {
                    var after = _this.shiftOf(flows, mid, f.bottom);
                    move(f.x0, f.bottom, f.x1, f.end, after - f.grow, after);
                }
                if (f.end < base.height) {
                    var after = _this.shiftOf(flows, -1, f.end);
                    move(0, f.end, base.width, base.height, after - f.grow, after);
                }
            });
            ctx.restore();
        };
        _this.paintOf = function (entry, ctx, tc) { return ({
            ctx: ctx,
            tc: tc,
            viewport: entry.viewport,
            pagePdf: entry.pagePdf,
            base: entry.base,
            colors: entry.colors,
            dyAt: function () { return 0; },
            metrics: new Map(),
        }); };
        // What the page shows: the PDF's items plus replaceTexts. A replacement too
        // long for its place is flowed into its paragraph like typed text (those
        // paragraphs become new items); otherwise it is drawn in place.
        _this.layout = function (p) {
            var items = p.tc.items;
            var original = _this.buildIndex(items, _this.props.specialWordRemoves || []);
            var reps = _this.planReplacements(original);
            var flows = [];
            var long = reps.filter(function (r) { return r === r.line[0] && _this.overflows(p, r); });
            if (!long.length)
                return { items: items, reps: reps, flows: flows, original: original };
            var at = new Map();
            items.forEach(function (item, i) { return at.set(item, i); });
            var segs = _this.segments(p);
            var flowed = new Set();
            _this.paragraphs(segs).forEach(function (para) {
                var lo = para[0].first;
                var hi = para[para.length - 1].last;
                var inside = function (r) {
                    var i = at.get(r.item);
                    return i >= lo && i <= hi;
                };
                if (!long.some(inside))
                    return;
                var mine = reps.filter(inside);
                if (mine.some(function (r) { return !r.whole.every(inside); }))
                    return; // match leaves it
                var flow = _this.flow(p, para, mine, segs, at);
                if (!flow)
                    return;
                flows.push(flow);
                mine.forEach(function (r) { return flowed.add(r); });
            });
            if (!flows.length)
                return { items: items, reps: reps, flows: flows, original: original };
            flows.forEach(function (f) {
                f.offset = _this.shiftOf(flows, f.cover[0].x + 1, f.top);
                f.items.forEach(function (item) { return (item.dy = f.offset); });
            });
            var shown = [];
            var i = 0;
            flows
                .sort(function (a, b) { return a.first - b.first; })
                .forEach(function (flow) {
                while (i < flow.first)
                    shown.push(items[i++]);
                flow.items.forEach(function (item) { return shown.push(item); });
                i = flow.last + 1;
            });
            while (i < items.length)
                shown.push(items[i++]);
            return {
                items: shown,
                reps: reps.filter(function (r) { return !flowed.has(r); }),
                flows: flows,
                original: original,
            };
        };
        // layout() depends on the text, replaceTexts and specialWordRemoves only,
        // not on keywords: kept per page once the PDF's fonts are loaded.
        _this.layoutOf = function (entry, p) {
            var c = entry.laid;
            if (c && c.gen === _this.textGen && c.tc === p.tc)
                return c;
            var laid = __assign(__assign({}, _this.layout(p)), { gen: _this.textGen, tc: p.tc });
            if (entry.ready)
                entry.laid = laid;
            return laid;
        };
        _this.overflows = function (p, lead) {
            // A replacement equal to the text it covers stays in place.
            var bare = function (t) { return t.replace(/\s+/g, ""); };
            var covered = lead.line.map(function (s) { return s.item.str.slice(s.start, s.end); });
            if (bare(lead.text) === bare(covered.join("")))
                return false;
            var b = _this.lineBox(p, lead.line);
            if (!lead.text)
                return b.w > b.h * 0.5;
            p.ctx.save();
            var k = _this.useFont(p.ctx, b, lead.text);
            var w = p.ctx.measureText(lead.text).width;
            p.ctx.restore();
            return k < 0.99 || b.w - w > b.h * 0.5;
        };
        _this.segments = function (p) {
            var Util = _this.lib.Util;
            var out = [];
            p.tc.items.forEach(function (item, i) {
                var cur = out[out.length - 1];
                if (!item.str || !item.str.trim()) {
                    if (cur)
                        cur.last = i;
                    else
                        out.push({
                            first: i,
                            last: i,
                            text: false,
                            flat: false,
                            x: 0,
                            right: 0,
                            y: 0,
                            size: 0,
                        });
                    return;
                }
                var tx = Util.transform(p.viewport.transform, item.transform);
                var flat = Math.abs(tx[1]) < 1e-6 &&
                    Math.abs(tx[2]) < 1e-6 &&
                    tx[0] > 0 &&
                    tx[3] < 0;
                var x = tx[4];
                var right = x + item.width * p.viewport.scale;
                var size = Math.abs(tx[3]);
                if (cur && !cur.text) {
                    Object.assign(cur, {
                        last: i,
                        text: true,
                        flat: flat,
                        x: x,
                        right: right,
                        y: tx[5],
                        size: size,
                    });
                }
                else if (cur &&
                    cur.flat &&
                    flat &&
                    Math.abs(tx[5] - cur.y) < cur.size / 2 &&
                    x - cur.right < cur.size * 2) {
                    cur.last = i;
                    cur.right = Math.max(cur.right, right);
                }
                else {
                    out.push({
                        first: i,
                        last: i,
                        text: true,
                        flat: flat,
                        x: x,
                        right: right,
                        y: tx[5],
                        size: size,
                    });
                }
            });
            return out;
        };
        // Consecutive segments that read as one paragraph: same size, steady line
        // spacing, aligned left edges and no short line before the last one.
        _this.paragraphs = function (segs) {
            var out = [];
            var para = [];
            var step = 0;
            segs.forEach(function (s) {
                var prev = para[para.length - 1];
                var d = prev ? s.y - prev.y : 0;
                var widest = para.reduce(function (m, o) { return Math.max(m, o.right); }, s.right);
                var joins = !!prev &&
                    prev.flat &&
                    s.flat &&
                    prev.text &&
                    s.text &&
                    Math.abs(s.size - prev.size) <= prev.size * 0.1 &&
                    d > prev.size * 0.9 &&
                    d < prev.size * 2.5 &&
                    (!step || Math.abs(d - step) <= step * 0.25) &&
                    Math.abs(s.x - para[0].x) <= prev.size * 3 &&
                    prev.right >= widest - prev.size * 3;
                if (joins) {
                    step = step || d;
                    para.push(s);
                }
                else {
                    if (para.length)
                        out.push(para);
                    para = [s];
                    step = 0;
                }
            });
            if (para.length)
                out.push(para);
            return out;
        };
        // Lays a paragraph out again from its first replaced line, like typed text:
        // words wrap at the column edge and justified text stays justified. Lines
        // beyond the paragraph's own are added below it and push the page down.
        _this.flow = function (p, para, mine, segs, at) {
            var ctx = p.ctx, tc = p.tc;
            var items = tc.items;
            var size = para[0].size;
            var left = para.reduce(function (m, s) { return Math.min(m, s.x); }, Infinity);
            // The column's right edge, also judged from other lines of the column.
            var columnRight = segs
                .filter(function (s) {
                return s.flat &&
                    s.text &&
                    Math.abs(s.x - left) <= size * 3 &&
                    Math.abs(s.size - size) <= size * 0.1;
            })
                .reduce(function (m, s) { return Math.max(m, s.right); }, 0);
            var beside = segs.filter(function (s) {
                return !para.includes(s) &&
                    s.text &&
                    s.y > para[0].y - size &&
                    s.y < para[para.length - 1].y + size;
            });
            var right = beside
                .filter(function (s) { return s.x > left + size; })
                .reduce(function (m, s) { return Math.min(m, s.x - size * 0.5); }, columnRight);
            var justified = para.length > 1 &&
                para.slice(0, -1).every(function (s) { return s.right >= right - s.size; });
            var holds = function (s) {
                return mine.some(function (r) {
                    var i = at.get(r.item);
                    return i >= s.first && i <= s.last;
                });
            };
            var lines = para.slice(para.findIndex(holds));
            var pieces = new Map();
            mine.forEach(function (r) {
                return pieces.set(r.item, (pieces.get(r.item) || []).concat(r));
            });
            var parts = [];
            var add = function (text, item, rule) {
                return parts.push({ text: text, item: item, rule: rule, w: 0 });
            };
            lines.forEach(function (s) {
                var _loop_2 = function (i) {
                    var item = items[i];
                    var pos = 0;
                    (pieces.get(item) || [])
                        .sort(function (a, b) { return a.start - b.start; })
                        .forEach(function (r) {
                        add(item.str.slice(pos, r.start), item);
                        if (r === r.whole[0])
                            add(r.rule.replace || "", item, r.rule);
                        pos = r.end;
                    });
                    add(item.str.slice(pos), item);
                };
                for (var i = s.first; i <= s.last; i++) {
                    _loop_2(i);
                }
                add(" ", items[s.last]); // a line break reads as a space
            });
            // Words, each part measured in its source item's font and spacing.
            var boxes = new Map();
            var boxOf = function (item) {
                var b = boxes.get(item);
                if (!b)
                    boxes.set(item, (b = _this.sliceBox(p, { item: item, start: 0, end: 0 })));
                return b;
            };
            var words = [];
            var word;
            parts.forEach(function (part) {
                part.text.split(/(\s+)/).forEach(function (t) {
                    if (!t)
                        return;
                    if (/^\s/.test(t)) {
                        word = undefined;
                        return;
                    }
                    if (!word)
                        words.push((word = []));
                    var b = boxOf(part.item);
                    ctx.font = b.font;
                    word.push(__assign(__assign({}, part), { text: t, w: ctx.measureText(t).width + b.track * t.length }));
                });
            });
            var widthOf = function (w) { return w.reduce(function (n, part) { return n + part.w; }, 0); };
            var space = 0;
            if (words.length) {
                ctx.font = boxOf(words[0][0].item).font;
                space = ctx.measureText(" ").width;
            }
            var column = segs.filter(function (s) {
                return s.flat &&
                    s.text &&
                    Math.abs(s.size - size) <= size * 0.1 &&
                    s.right >= right - size * 3;
            });
            var margin = column.reduce(function (m, s) { return Math.min(m, s.x); }, lines[lines.length - 1].x);
            var nextX = lines.length > 1
                ? lines[lines.length - 1].x
                : Math.min(margin, lines[0].x);
            var step = _this.lineStep(segs, size, para);
            var last = lines[lines.length - 1];
            var lineAt = function (n) {
                return n < lines.length
                    ? lines[n]
                    : { x: nextX, y: last.y + (n - lines.length + 1) * step };
            };
            var fits = words.flatMap(function (w) {
                return _this.splitWord(p, w, right - nextX, boxOf);
            });
            var rows = [[]];
            var x = lines[0].x;
            for (var _i = 0, fits_1 = fits; _i < fits_1.length; _i++) {
                var w = fits_1[_i];
                var wide = widthOf(w);
                var row = rows[rows.length - 1];
                if (row.length && x + space + wide > right) {
                    rows.push((row = []));
                    x = lineAt(rows.length - 1).x;
                }
                else if (row.length) {
                    x += space;
                }
                row.push(w);
                x += wide;
            }
            var out = [];
            var make = function (part, x, y) {
                var _a = p.viewport.convertToPdfPoint(x, y), px = _a[0], py = _a[1];
                var t = part.item.transform;
                return {
                    str: part.text,
                    dir: "ltr",
                    width: part.w / p.viewport.scale,
                    height: part.item.height,
                    transform: [t[0], t[1], t[2], t[3], px, py],
                    fontName: part.item.fontName,
                    hasEOL: false,
                    rule: part.rule,
                };
            };
            var centerOf = function (s) { return (s.x + s.right) / 2; };
            var above = segs
                .filter(function (s) {
                return s.flat &&
                    s.text &&
                    !para.includes(s) &&
                    s.y < lines[0].y - size * 0.5 &&
                    s.right > lines[0].x &&
                    s.x < lines[0].right;
            })
                .reduce(function (m, s) { return (!m || s.y > m.y ? s : m); }, undefined);
            var centered = lines.length > 1
                ? lines.every(function (l) { return Math.abs(centerOf(l) - centerOf(lines[0])) < size * 0.5; }) && lines.some(function (l) { return Math.abs(l.x - lines[0].x) > size * 0.5; })
                : !!above &&
                    Math.abs(centerOf(above) - centerOf(lines[0])) < size * 0.75 &&
                    Math.abs(above.x - lines[0].x) > size * 0.75;
            var middle = centerOf(lines[0]);
            rows.forEach(function (row, n) {
                var line = lineAt(n);
                var used = row.reduce(function (m, w) { return m + widthOf(w); }, 0) + space * (row.length - 1);
                var gap = !centered && justified && n < rows.length - 1 && row.length > 1
                    ? space + (right - line.x - used) / (row.length - 1)
                    : space;
                var cx = centered ? middle - used / 2 : line.x;
                row.forEach(function (w, j) {
                    w.forEach(function (part) {
                        out.push(make(part, cx, line.y));
                        cx += part.w;
                    });
                    if (j === row.length - 1)
                        return;
                    // Spaces are not drawn; they keep copied text readable.
                    out.push(make({ text: " ", item: w[w.length - 1].item, w: gap }, cx, line.y));
                    cx += gap;
                });
            });
            var metricsOf = function (s) {
                var first = items
                    .slice(s.first, s.last + 1)
                    .find(function (it) { return !!it.str && !!it.str.trim(); });
                var style = tc.styles[first.fontName];
                return {
                    asc: style && style.ascent > 0 ? style.ascent : 0.8,
                    desc: style && style.descent < 0 ? style.descent : -0.2,
                };
            };
            var cover = lines.map(function (s) {
                var _a = metricsOf(s), asc = _a.asc, desc = _a.desc;
                var pad = s.size * 0.05;
                return {
                    x: s.x - pad,
                    y: s.y - asc * s.size - pad,
                    w: right - s.x + 2 * pad,
                    h: (asc - desc) * s.size + 2 * pad,
                };
            });
            var top = cover[0].y;
            var bottom = cover[cover.length - 1].y + cover[cover.length - 1].h;
            var extra = rows.length - lines.length;
            var grow = extra > 0 || !beside.length ? extra * step : 0;
            var x0 = beside.length ? Math.min(left, nextX) - size * 0.3 : -Infinity;
            var x1 = beside.length ? right + size * 0.3 : Infinity;
            var end = beside.length
                ? segs
                    .filter(function (s) {
                    return s.text &&
                        s.y > last.y + size * 0.5 &&
                        ((s.x < x0 && s.right > x0 + size) ||
                            (s.x < x1 - size && s.right > x1));
                })
                    .reduce(function (m, s) { return Math.min(m, s.y - metricsOf(s).asc * s.size - size * 0.2); }, Infinity)
                : bottom;
            return {
                first: lines[0].first,
                last: last.last,
                items: out,
                cover: grow < 0 ? cover.slice(0, rows.length) : cover,
                background: mine[0].rule.background,
                top: top,
                bottom: bottom,
                end: end,
                x0: x0,
                x1: x1,
                grow: grow,
                offset: 0,
            };
        };
        _this.lineStep = function (segs, size, para) {
            var own = para.length > 1
                ? (para[para.length - 1].y - para[0].y) / (para.length - 1)
                : 0;
            if (own)
                return own;
            var gaps = [];
            for (var i = 1; i < segs.length; i++) {
                var a = segs[i - 1];
                var b = segs[i];
                if (!a.text || !b.text || Math.abs(a.size - size) > size * 0.1)
                    continue;
                if (Math.abs(b.size - size) > size * 0.1)
                    continue;
                var d = b.y - a.y;
                if (d > size * 0.9 && d < size * 1.6)
                    gaps.push(d);
            }
            if (!gaps.length)
                return size * 1.2;
            gaps.sort(function (a, b) { return a - b; });
            return gaps[Math.floor(gaps.length / 2)];
        };
        _this.splitWord = function (p, word, max, boxOf) {
            if (word.reduce(function (n, part) { return n + part.w; }, 0) <= max)
                return [word];
            var out = [];
            var cur = [];
            var used = 0;
            word.forEach(function (part) {
                var b = boxOf(part.item);
                p.ctx.font = b.font;
                var chunk = "";
                var chunkW = 0;
                Array.from(part.text).forEach(function (ch) {
                    var w = p.ctx.measureText(ch).width + b.track;
                    if (used + chunkW + w > max && (cur.length || chunk)) {
                        if (chunk)
                            cur.push(__assign(__assign({}, part), { text: chunk, w: chunkW }));
                        out.push(cur);
                        cur = [];
                        used = 0;
                        chunk = "";
                        chunkW = 0;
                    }
                    chunk += ch;
                    chunkW += w;
                });
                if (chunk) {
                    cur.push(__assign(__assign({}, part), { text: chunk, w: chunkW }));
                    used += chunkW;
                }
            });
            if (cur.length)
                out.push(cur);
            return out;
        };
        _this.drawFlow = function (p, flow) {
            var ctx = p.ctx;
            var _a = _this.colorsAt(p, flow.cover), paper = _a.paper, ink = _a.ink;
            ctx.save();
            ctx.translate(0, flow.offset);
            ctx.fillStyle = flow.background || paper;
            flow.cover.forEach(function (r) { return ctx.fillRect(r.x, r.y, r.w, r.h); });
            ctx.textBaseline = "alphabetic";
            var marks = [];
            var run;
            flow.items.forEach(function (item) {
                if (!item.str.trim())
                    return;
                var slice = { item: item, start: 0, end: item.str.length };
                var b = _this.sliceBox(p, slice); // also sets ctx.font
                ctx.save();
                if ("letterSpacing" in ctx)
                    ctx.letterSpacing = "".concat(b.track, "px");
                ctx.fillStyle = (item.rule && item.rule.color) || ink;
                ctx.fillText(item.str, b.tx[4], b.tx[5]);
                ctx.restore();
                if (!item.rule || item.rule.highlight === false) {
                    run = undefined;
                }
                else {
                    if (!run)
                        marks.push((run = []));
                    run.push(slice);
                }
            });
            // Replacement text is marked like a keyword match, one band per line.
            marks.forEach(function (m) {
                return _this.lines(m).forEach(function (line) {
                    var b = _this.mergeBoxes(line.map(function (s) { return _this.sliceBox(p, s); }));
                    ctx.save();
                    ctx.translate(b.tx[4], b.tx[5]);
                    _this.markReplaced(ctx, b.x0, b.y, b.w, b.h);
                    ctx.restore();
                });
            });
            ctx.restore();
        };
        // Paper and ink of a region of the rendered page, so drawn text blends in:
        // the most common color is the paper, the one farthest from it the ink.
        _this.colorsAt = function (p, rects) {
            var x0 = Math.max(0, Math.floor(Math.min.apply(Math, rects.map(function (r) { return r.x; }))));
            var y0 = Math.max(0, Math.floor(Math.min.apply(Math, rects.map(function (r) { return r.y; }))));
            var x1 = Math.min(p.base.width, Math.ceil(Math.max.apply(Math, rects.map(function (r) { return r.x + r.w; }))));
            var y1 = Math.min(p.base.height, Math.ceil(Math.max.apply(Math, rects.map(function (r) { return r.y + r.h; }))));
            var key = [x0, y0, x1, y1].join();
            var colors = p.colors.get(key);
            if (colors)
                return colors;
            colors = { paper: "#fff", ink: "#000" };
            try {
                var ctx = p.base.getContext("2d");
                if (ctx && x1 > x0 && y1 > y0) {
                    var data = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
                    var counts_1 = new Map();
                    var paper_1 = Math.pow(2, 24) - 1;
                    var most_1 = 0;
                    // Runs of one color (mostly paper) are counted with one Map update.
                    var run_1 = -1;
                    var len_1 = 0;
                    var flush = function () {
                        if (!len_1)
                            return;
                        var n = (counts_1.get(run_1) || 0) + len_1;
                        counts_1.set(run_1, n);
                        if (n > most_1) {
                            most_1 = n;
                            paper_1 = run_1;
                        }
                    };
                    for (var i = 0; i < data.length; i += 8) {
                        var c = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
                        if (c === run_1) {
                            len_1++;
                            continue;
                        }
                        flush();
                        run_1 = c;
                        len_1 = 1;
                    }
                    flush();
                    var diff_1 = function (c) {
                        return [16, 8, 0].reduce(function (d, s) { return d + Math.abs(((c >> s) & 255) - ((paper_1 >> s) & 255)); }, 0);
                    };
                    var ink_1 = paper_1;
                    counts_1.forEach(function (_, c) {
                        if (diff_1(c) > diff_1(ink_1))
                            ink_1 = c;
                    });
                    var css = function (c) { return "#".concat((c | 0x1000000).toString(16).slice(1)); };
                    colors = { paper: css(paper_1), ink: css(ink_1) };
                }
            }
            catch (_a) {
                // keep the defaults
            }
            p.colors.set(key, colors);
            return colors;
        };
        // Axis-aligned canvas rect around a (possibly rotated) box.
        _this.rectOf = function (b) {
            var cos = Math.cos(b.angle);
            var sin = Math.sin(b.angle);
            var xs = [];
            var ys = [];
            [b.x0, b.x0 + b.w].forEach(function (u) {
                return [b.y, b.y + b.h].forEach(function (v) {
                    xs.push(b.tx[4] + u * cos - v * sin);
                    ys.push(b.tx[5] + u * sin + v * cos);
                });
            });
            var x = Math.min.apply(Math, xs);
            var y = Math.min.apply(Math, ys);
            return { x: x, y: y, w: Math.max.apply(Math, xs) - x, h: Math.max.apply(Math, ys) - y };
        };
        // The font pdf.js drew the item with: the PDF's embedded font (a FontFace
        // pdf.js registers while rendering) in its weight and style, then the
        // generic fallback.
        _this.fontOf = function (p, item, size) {
            var style = p.tc.styles[item.fontName];
            var fallback = (style && style.fontFamily) || "sans-serif";
            var objs = p.pagePdf.commonObjs;
            var font = objs && objs.has(item.fontName) ? objs.get(item.fontName) : undefined;
            if (!font)
                return "".concat(size, "px \"").concat(item.fontName, "\", ").concat(fallback);
            var name = String(font.name || "");
            var weight = font.black
                ? "900"
                : font.bold || /bold/i.test(name)
                    ? "bold"
                    : "normal";
            var italic = font.italic || /italic|oblique/i.test(name) ? "italic" : "normal";
            var system = systemFamilyOf(name);
            var generic = system && SERIF_FAMILY.test(system)
                ? "serif"
                : font.fallbackName || fallback;
            var family = (font.systemFontInfo && font.systemFontInfo.css) ||
                (system ? "\"".concat(system, "\", ").concat(generic) : "\"".concat(font.loadedName, "\", ").concat(generic));
            return "".concat(italic, " ").concat(weight, " ").concat(size, "px ").concat(family);
        };
        // Box of item.str[start, end). Browser widths are scaled onto the exact PDF
        // advance (item.width); `track` is the extra spacing per char the PDF adds.
        // Per item, once per paint: its canvas transform, font and PDF advance.
        _this.metricsOf = function (p, item) {
            var m = p.metrics.get(item);
            if (m)
                return m;
            var Util = _this.lib.Util;
            var style = p.tc.styles[item.fontName];
            var tx = Util.transform(p.viewport.transform, item.transform);
            var fontH = Math.hypot(tx[2], tx[3]);
            var font = _this.fontOf(p, item, fontH);
            p.ctx.font = font;
            var target = item.width * p.viewport.scale;
            var raw = p.ctx.measureText(item.str).width;
            var full = raw || 1;
            m = {
                tx: tx,
                angle: Math.atan2(tx[1], tx[0]),
                fontH: fontH,
                asc: style && Number.isFinite(style.ascent) && style.ascent > 0
                    ? style.ascent
                    : 0.8,
                desc: style && Number.isFinite(style.descent) && style.descent < 0
                    ? style.descent
                    : -0.2,
                font: font,
                raw: raw,
                k: target / full,
                track: (target - full) / Math.max(1, item.str.length),
            };
            p.metrics.set(item, m);
            return m;
        };
        // Box of item.str[start, end). Browser widths are scaled onto the exact PDF
        // advance (item.width); `track` is the extra spacing per char the PDF adds.
        _this.sliceBox = function (p, _a) {
            var item = _a.item, start = _a.start, end = _a.end;
            var m = _this.metricsOf(p, item);
            p.ctx.font = m.font;
            var x0 = start > 0 ? p.ctx.measureText(item.str.slice(0, start)).width * m.k : 0;
            var x1 = end >= item.str.length
                ? m.raw * m.k
                : p.ctx.measureText(item.str.slice(0, end)).width * m.k;
            return {
                tx: m.tx,
                angle: m.angle,
                x0: x0,
                w: x1 - x0,
                y: -m.asc * m.fontH,
                h: (m.asc - m.desc) * m.fontH,
                font: m.font,
                track: m.track,
            };
        };
        // One box spanning boxes of the same line, in the first box's frame, so a
        // phrase gets one continuous band across the gaps between words.
        _this.mergeBoxes = function (boxes) {
            var f = boxes[0];
            var cos = Math.cos(f.angle);
            var sin = Math.sin(f.angle);
            var x0 = Infinity;
            var x1 = -Infinity;
            var y0 = Infinity;
            var y1 = -Infinity;
            boxes.forEach(function (b) {
                var dx = b.tx[4] - f.tx[4];
                var dy = b.tx[5] - f.tx[5];
                var u = dx * cos + dy * sin;
                var v = dy * cos - dx * sin;
                x0 = Math.min(x0, u + b.x0);
                x1 = Math.max(x1, u + b.x0 + b.w);
                y0 = Math.min(y0, v + b.y);
                y1 = Math.max(y1, v + b.y + b.h);
            });
            return __assign(__assign({}, f), { x0: x0, w: x1 - x0, y: y0, h: y1 - y0 });
        };
        _this.lineBox = function (p, line) {
            return _this.mergeBoxes(line.map(function (s) { return _this.sliceBox(p, s); }));
        };
        // Consecutive slices whose items share a baseline form one visual line.
        _this.lines = function (slices) {
            var out = [];
            slices.forEach(function (s) {
                var line = out[out.length - 1];
                if (line && _this.sameLine(line[line.length - 1].item, s.item)) {
                    line.push(s);
                }
                else {
                    out.push([s]);
                }
            });
            return out;
        };
        _this.sameLine = function (a, b) {
            if (a === b)
                return true;
            var ta = a.transform;
            var tb = b.transform;
            var angle = Math.atan2(ta[1], ta[0]);
            if (Math.abs(angle - Math.atan2(tb[1], tb[0])) > 0.01)
                return false;
            var size = Math.hypot(ta[2], ta[3]) || 1;
            var off = (tb[5] - ta[5]) * Math.cos(angle) - (tb[4] - ta[4]) * Math.sin(angle);
            return Math.abs(off) < size / 2;
        };
        // Sets the box's font and the PDF's spacing for drawing `text`; returns the
        // scale (<= 1) that fits it into the box.
        _this.useFont = function (ctx, b, text) {
            ctx.font = b.font;
            if ("letterSpacing" in ctx)
                ctx.letterSpacing = "".concat(b.track, "px");
            return Math.min(1, b.w / (ctx.measureText(text).width || 1));
        };
        // Box of part.text[start, end) as drawReplacements draws it.
        _this.replacedBox = function (p, part, start, end) {
            var ctx = p.ctx;
            var b = _this.lineBox(p, part.line);
            ctx.save();
            var k = _this.useFont(ctx, b, part.text);
            var x0 = b.x0 + ctx.measureText(part.text.slice(0, start)).width * k;
            var x1 = b.x0 + ctx.measureText(part.text.slice(0, end)).width * k;
            ctx.restore();
            return __assign(__assign({}, b), { x0: x0, w: x1 - x0 });
        };
        // Returns how many matches were replaced in place.
        _this.drawReplacements = function (p, parts) {
            var ctx = p.ctx;
            parts.forEach(function (part) {
                if (part !== part.line[0])
                    return; // drawn once per visual line
                ctx.save();
                var b = _this.lineBox(p, part.line);
                var pad = b.h * 0.05; // hide anti-aliased edges of the original glyphs
                var _a = _this.colorsAt(p, [_this.rectOf(b)]), paper = _a.paper, ink = _a.ink;
                ctx.translate(b.tx[4], b.tx[5] + p.dyAt(b.tx[4], b.tx[5]));
                ctx.rotate(b.angle);
                ctx.fillStyle = part.rule.background || paper;
                ctx.fillRect(b.x0 - pad, b.y - pad, b.w + 2 * pad, b.h + 2 * pad);
                if (part.text && b.w > 0) {
                    var k = _this.useFont(ctx, b, part.text);
                    ctx.fillStyle = part.rule.color || ink;
                    ctx.textBaseline = "alphabetic";
                    // A longer replacement is scaled down evenly on its baseline to fit,
                    // never squeezed horizontally.
                    ctx.save();
                    ctx.translate(b.x0, 0);
                    ctx.scale(k, k);
                    ctx.fillText(part.text, 0, 0);
                    ctx.restore();
                    // Replaced text is marked like a keyword match.
                    if (part.rule.highlight !== false) {
                        _this.markReplaced(ctx, b.x0, b.y, ctx.measureText(part.text).width * k, b.h);
                    }
                }
                ctx.restore();
            });
            return parts.filter(function (part) { return part === part.whole[0]; }).length;
        };
        // A solid fill (drawn multiplied), or a border with isBorderHighlight.
        _this.mark = function (ctx, x, y, w, h, color) {
            ctx.save();
            if (_this.props.isBorderHighlight) {
                // 2 screen px, whatever the canvas resolution.
                var canvas = ctx.canvas;
                var px = canvas.clientWidth
                    ? canvas.width / canvas.clientWidth
                    : window.devicePixelRatio || 1;
                ctx.strokeStyle = color;
                ctx.lineWidth = 2 * px;
                ctx.strokeRect(x, y, w, h);
            }
            else {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, w, h);
            }
            ctx.restore();
        };
        _this.keywordColor = function () {
            return _this.props.colorKeyword || _this.props.colorHighlight || "yellow";
        };
        _this.replaceColor = function () { return _this.props.colorHighlight || "yellow"; };
        // Solid and multiplied onto the replaced text, so its ink stays dark.
        _this.markReplaced = function (ctx, x, y, w, h) {
            ctx.save();
            if (!_this.props.isBorderHighlight)
                ctx.globalCompositeOperation = "multiply";
            _this.mark(ctx, x, y, w, h, _this.replaceColor());
            ctx.restore();
        };
        // Every occurrence of every replaceTexts rule as per-item pieces, with the
        // replacement text spread over the visual lines the match spans. Earlier
        // rules win where matches overlap.
        _this.planReplacements = function (index) {
            var _a = _this.props, _b = _a.replaceTexts, replaceTexts = _b === void 0 ? [] : _b, _c = _a.specialWordRemoves, specialWordRemoves = _c === void 0 ? [] : _c;
            var out = [];
            var taken = new Uint8Array(index.text.length);
            var size = function (line) {
                return line.reduce(function (n, s) { return n + s.end - s.start; }, 0);
            };
            replaceTexts.forEach(function (rule) {
                var needle = _this.normalizeNeedle(rule.search, specialWordRemoves, Infinity);
                var text = rule.replace || "";
                _this.findAll(index, needle).forEach(function (_a) {
                    var from = _a[0], to = _a[1];
                    for (var i = from; i < to; i++) {
                        if (taken[i])
                            return;
                    }
                    taken.fill(1, from, to);
                    var lines = _this.lines(_this.slices(index, from, to));
                    var total = lines.reduce(function (n, l) { return n + size(l); }, 0);
                    var whole = [];
                    var acc = 0;
                    var pos = 0;
                    lines.forEach(function (l, i) {
                        acc += size(l);
                        var cut = i === lines.length - 1
                            ? text.length
                            : _this.cutAt(text, pos, Math.round((text.length * acc) / total));
                        var chunk = text.slice(pos, cut).trim();
                        pos = cut;
                        var line = [];
                        l.forEach(function (s, j) {
                            var piece = {
                                item: s.item,
                                start: s.start,
                                end: s.end,
                                text: j ? "" : chunk,
                                rule: rule,
                                line: line,
                                whole: whole,
                            };
                            line.push(piece);
                            whole.push(piece);
                            out.push(piece);
                        });
                    });
                });
            });
            return out;
        };
        // A cut near `target`, on whitespace when one is close, so words are not
        // split across lines.
        _this.cutAt = function (text, from, target) {
            for (var d = 0; d <= 10; d++) {
                var back = target - d;
                var fwd = target + d;
                if (back > from && back <= text.length && /\s/.test(text[back - 1])) {
                    return back;
                }
                if (fwd > from && fwd < text.length && /\s/.test(text[fwd]))
                    return fwd;
            }
            return Math.max(from, Math.min(text.length, target));
        };
        _this.needles = function () {
            var _a = _this.props, _b = _a.keywords, keywords = _b === void 0 ? [] : _b, _c = _a.specialWordRemoves, specialWordRemoves = _c === void 0 ? [] : _c, _d = _a.maxKeywordLength, maxKeywordLength = _d === void 0 ? 2000 : _d;
            return Array.from(new Set(keywords.map(function (k) {
                return _this.normalizeNeedle(k, specialWordRemoves, maxKeywordLength);
            }))).filter(Boolean);
        };
        _this.firstMatch = function (index) {
            var first;
            _this.needles().forEach(function (needle) {
                var m = _this.findAll(index, needle)[0];
                if (m && (!first || m[0] < first[0]))
                    first = m;
            });
            return first;
        };
        // What firstMatch reads (the lowercased shown text), kept per page so a
        // keystroke does not rebuild every page's index.
        _this.shownText = function (page, tc) {
            var lower = _this.searchText.get(page);
            if (lower === undefined) {
                lower = _this.shownIndex(tc).lower;
                _this.searchText.set(page, lower);
            }
            return { lower: lower };
        };
        _this.shownIndex = function (tc) {
            var removes = _this.props.specialWordRemoves || [];
            var original = _this.buildIndex(tc.items, removes);
            var reps = _this.planReplacements(original);
            return reps.length ? _this.buildIndex(tc.items, removes, reps) : original;
        };
        _this.hitBox = function (p, index, s) {
            var _a;
            var b = s.rep < 0
                ? _this.sliceBox(p, s)
                : _this.replacedBox(p, index.reps[s.rep], s.start, s.end);
            var dy = (_a = s.item.dy) !== null && _a !== void 0 ? _a : p.dyAt(b.tx[4], b.tx[5]);
            var tx = b.tx.slice();
            tx[5] += dy;
            return __assign(__assign({}, b), { tx: tx });
        };
        _this.matchBox = function (p, index, line) { return _this.mergeBoxes(line.map(function (s) { return _this.hitBox(p, index, s); })); };
        // Replaced text that carries its own highlight mark.
        _this.onMarkedReplacement = function (index, s) {
            var rule = s.rep >= 0 ? index.reps[s.rep].rule : s.item.rule;
            return !!rule && rule.highlight !== false;
        };
        // Jumps near the first match, then refines onto its highlight once the page
        // is painted. Resolves false when nothing matches or the pages are still
        // being laid out (the search then runs after layout).
        _this.scrollToMatch = function () { return __awaiter(_this, void 0, void 0, function () {
            var req, pdf, pageSearch, nums, slice, _loop_3, this_1, _i, nums_1, n, state_1, e_3;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        req = ++this.scrollReq;
                        this.pendingScroll = undefined;
                        return [4 /*yield*/, undefined];
                    case 1:
                        _c.sent(); // let a state update made just before render first
                        if (req !== this.scrollReq || !this.needles().length)
                            return [2 /*return*/, false];
                        pdf = this.pdf;
                        if (!pdf || !this.slots.size) {
                            this.scrollOnLayout = true;
                            return [2 /*return*/, false];
                        }
                        pageSearch = this.props.pageSearch;
                        nums = Array.from(this.slots.keys()).filter(function (n) { return !pageSearch || n === pageSearch; });
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 7, , 8]);
                        slice = Date.now();
                        _loop_3 = function (n) {
                            var pagePdf, tc, match, index, entry, last;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!(Date.now() - slice > 8)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r); })];
                                    case 1:
                                        _d.sent();
                                        slice = Date.now();
                                        _d.label = 2;
                                    case 2: return [4 /*yield*/, pdf.getPage(n)];
                                    case 3:
                                        pagePdf = _d.sent();
                                        return [4 /*yield*/, this_1.getText(pagePdf, n)];
                                    case 4:
                                        tc = _d.sent();
                                        if (req !== this_1.scrollReq)
                                            return [2 /*return*/, { value: false }];
                                        match = this_1.firstMatch(this_1.shownText(n, tc));
                                        if (!match)
                                            return [2 /*return*/, "continue"];
                                        index = this_1.shownIndex(tc);
                                        this_1.pendingScroll = { page: n, req: req };
                                        entry = this_1.pages.get(n);
                                        last = entry && entry.lastPaint;
                                        if (entry && entry.ready && last && last.gen === this_1.paintGen) {
                                            this_1.finishScroll(entry, n, last.p, last.shown);
                                        }
                                        else if (entry && entry.ready) {
                                            this_1.paintPage(n, this_1.paintGen).catch(function (e) {
                                                return _this.fail("paint ".concat(n), e, n);
                                            });
                                        }
                                        else {
                                            this_1.scrollMarker(n, this_1.roughRect(pagePdf, index, match));
                                        }
                                        (_a = this_1.log) === null || _a === void 0 ? void 0 : _a.info(this_1.tag, "scroll to page", n, entry ? "" : "(rendering)");
                                        return [2 /*return*/, { value: true }];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, nums_1 = nums;
                        _c.label = 3;
                    case 3:
                        if (!(_i < nums_1.length)) return [3 /*break*/, 6];
                        n = nums_1[_i];
                        return [5 /*yield**/, _loop_3(n)];
                    case 4:
                        state_1 = _c.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        (_b = this.log) === null || _b === void 0 ? void 0 : _b.info(this.tag, "no match");
                        return [3 /*break*/, 8];
                    case 7:
                        e_3 = _c.sent();
                        if (this.pdf === pdf)
                            this.fail("search", e_3); // not a released document
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, false];
                }
            });
        }); };
        _this.roughRect = function (pagePdf, index, _a) {
            var from = _a[0], to = _a[1];
            var s = _this.slices(index, from, to)[0];
            var vp1 = pagePdf.getViewport({ scale: 1 });
            var tx = _this.lib.Util.transform(vp1.transform, s.item.transform);
            var size = Math.hypot(tx[2], tx[3]);
            var len = Math.max(1, s.item.str.length);
            var width = s.item.width || size;
            var r = _this.rectOf({
                tx: tx,
                angle: Math.atan2(tx[1], tx[0]),
                x0: (width * Math.min(s.start, len)) / len,
                w: (width * Math.max(1, Math.min(s.end, len) - s.start)) / len,
                y: -size,
                h: size,
                font: "",
                track: 0,
            });
            return {
                x: r.x / vp1.width,
                y: r.y / vp1.height,
                w: r.w / vp1.width,
                h: r.h / vp1.height,
            };
        };
        _this.cancelScroll = function () {
            ++_this.scrollReq;
            _this.pendingScroll = undefined;
        };
        _this.finishScroll = function (entry, page, p, index) {
            var pending = _this.pendingScroll;
            if (!pending || pending.page !== page || !entry.ready)
                return;
            _this.pendingScroll = undefined;
            if (pending.req !== _this.scrollReq)
                return;
            var match = _this.firstMatch(index);
            if (!match)
                return;
            var line = _this.lines(_this.slices(index, match[0], match[1]))[0];
            var r = _this.rectOf(_this.matchBox(p, index, line));
            var width = entry.base.width; // hl may hold no pixels (width 0)
            var height = entry.hl.height;
            _this.scrollMarker(page, {
                x: r.x / width,
                y: r.y / height,
                w: r.w / width,
                h: r.h / height,
            });
        };
        // Jumps straight there, like a browser's find.
        _this.scrollMarker = function (page, target) {
            var slot = _this.slots.get(page);
            if (!slot)
                return;
            var x = Math.min(1, Math.max(0, target.x));
            var y = Math.min(1, Math.max(0, target.y));
            var marker = _this.marker || (_this.marker = document.createElement("div"));
            marker.style.cssText =
                "position:absolute;visibility:hidden;pointer-events:none";
            marker.style.left = "".concat(x * 100, "%");
            marker.style.top = "".concat(y * 100, "%");
            marker.style.width = "".concat(Math.max(0, Math.min(target.w, 1 - x)) * 100, "%");
            marker.style.height = "".concat(Math.max(0, Math.min(target.h, 1 - y)) * 100, "%");
            if (marker.parentNode !== slot)
                slot.appendChild(marker);
            var wrap = _this.refCanvasWrap;
            if (wrap && wrap.scrollHeight > wrap.clientHeight) {
                // Scroll only the wrapper, not the page around it.
                var m = marker.getBoundingClientRect();
                var c = wrap.getBoundingClientRect();
                var top_1 = wrap.scrollTop +
                    m.top -
                    c.top -
                    wrap.clientTop -
                    (wrap.clientHeight - m.height) / 2;
                wrap.scrollTop = top_1;
            }
            else if (marker.scrollIntoView) {
                marker.scrollIntoView({ block: "center", inline: "nearest" });
            }
        };
        // Returns the match count per keyword that matched (for debug output).
        _this.drawHighlights = function (p, index, ctx) {
            var counts = {};
            var color = _this.keywordColor();
            // Over replaced text marked in the same color the match would not show:
            // that part is drawn darker.
            var strong = !_this.props.isBorderHighlight &&
                normColor(color) === normColor(_this.replaceColor())
                ? darker(color)
                : undefined;
            var draw = function (b, c) {
                ctx.save();
                ctx.translate(b.tx[4], b.tx[5]);
                ctx.rotate(b.angle);
                _this.mark(ctx, b.x0, b.y, b.w, b.h, c);
                ctx.restore();
            };
            for (var _i = 0, _a = _this.needles(); _i < _a.length; _i++) {
                var needle = _a[_i];
                var matches = _this.findAll(index, needle);
                if (matches.length)
                    counts[needle.slice(0, 40)] = matches.length;
                for (var _b = 0, matches_1 = matches; _b < matches_1.length; _b++) {
                    var _c = matches_1[_b], from = _c[0], to = _c[1];
                    var _loop_4 = function (line) {
                        draw(_this.matchBox(p, index, line), color);
                        if (!strong)
                            return "continue";
                        // Consecutive pieces on marked replaced text, one band each.
                        var runs = [];
                        line.forEach(function (s, i) {
                            if (!_this.onMarkedReplacement(index, s))
                                return;
                            var prev = runs[runs.length - 1];
                            if (prev && _this.onMarkedReplacement(index, line[i - 1]))
                                prev.push(s);
                            else
                                runs.push([s]);
                        });
                        runs.forEach(function (run) { return draw(_this.matchBox(p, index, run), strong); });
                    };
                    for (var _d = 0, _e = _this.lines(_this.slices(index, from, to)); _d < _e.length; _d++) {
                        var line = _e[_d];
                        _loop_4(line);
                    }
                }
            }
            return counts;
        };
        // Whitespace-free page text plus a map from each char back to its source:
        // (item, offset) in the PDF text, or (replacement, offset) where `reps`
        // changed what is displayed.
        _this.buildIndex = function (items, removes, reps) {
            if (reps === void 0) { reps = []; }
            var text = "";
            var item = [];
            var off = [];
            var rep = [];
            var clean = function (s) {
                removes.forEach(function (r) {
                    if (r && s.includes(r))
                        s = s.split(r).join(" ".repeat(r.length)); // keep offsets
                });
                return s;
            };
            var add = function (s, i, r, from, to) {
                for (var j = from; j < to; j++) {
                    if (isSpace(s.charCodeAt(j)))
                        continue;
                    text += s[j];
                    item.push(i);
                    off.push(j);
                    rep.push(r);
                }
            };
            var repsOf = new Map();
            reps.forEach(function (r, n) {
                var mine = repsOf.get(r.item);
                if (mine)
                    mine.push(n);
                else
                    repsOf.set(r.item, [n]);
            });
            items.forEach(function (it, i) {
                var s = clean(it.str || "");
                var pos = 0;
                (repsOf.get(it) || [])
                    .sort(function (a, b) { return reps[a].start - reps[b].start; })
                    .forEach(function (n) {
                    var t = clean(reps[n].text);
                    add(s, i, -1, pos, reps[n].start);
                    add(t, i, n, 0, t.length);
                    pos = reps[n].end;
                });
                add(s, i, -1, pos, s.length);
            });
            return { text: text, lower: lowerChars(text), item: item, off: off, rep: rep, items: items, reps: reps };
        };
        _this.normalizeNeedle = function (keyword, removes, max) {
            var k = keyword || "";
            removes.forEach(function (r) {
                if (r)
                    k = k.split(r).join(" ");
            });
            return k.replace(/\s+/g, "").slice(0, max || 2000);
        };
        // Case-insensitive, like a browser's find.
        _this.findAll = function (idx, needle) {
            var out = [];
            if (!needle)
                return out;
            var find = lowerChars(needle);
            var p = idx.lower.indexOf(find);
            while (p !== -1) {
                out.push([p, p + find.length]);
                p = idx.lower.indexOf(find, p + find.length);
            }
            return out;
        };
        // Splits an index range into [start, end) slices of one source string each:
        // an item's raw text (rep = -1) or a replacement's text (rep = its index).
        _this.slices = function (idx, from, to) {
            var out = [];
            var k = from;
            while (k < to) {
                var i = idx.item[k];
                var r = idx.rep[k];
                var last = k;
                while (last + 1 < to &&
                    idx.item[last + 1] === i &&
                    idx.rep[last + 1] === r) {
                    last++;
                }
                out.push({
                    item: idx.items[i],
                    start: idx.off[k],
                    end: idx.off[last] + 1,
                    rep: r,
                });
                k = last + 1;
            }
            return out;
        };
        // Transparent, selectable text positioned in % of the page, so it follows
        // CSS resizes without re-layout. Rebuilding replaces the previous layer.
        _this.appendTextToCanvas = function (entry, page) { return __awaiter(_this, void 0, void 0, function () {
            var tc, ctx, Util, styles, vp1, _a, items, reps, edits, layer, frag, _i, items_1, item, style, tx, fontH, asc, span, angle;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getText(entry.pagePdf, page)];
                    case 1:
                        tc = _c.sent();
                        ctx = entry.hl.getContext("2d");
                        if (this.pages.get(page) !== entry || !ctx)
                            return [2 /*return*/]; // evicted or superseded
                        Util = this.lib.Util;
                        styles = tc.styles;
                        vp1 = entry.vp1;
                        _a = this.layoutOf(entry, this.paintOf(entry, ctx, tc)), items = _a.items, reps = _a.reps;
                        edits = new Map();
                        reps.forEach(function (r) { return edits.set(r.item, (edits.get(r.item) || []).concat(r)); });
                        layer = document.createElement("div");
                        layer.style.cssText =
                            "position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;line-height:1;container-type:inline-size";
                        frag = document.createDocumentFragment();
                        for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                            item = items_1[_i];
                            if (!item.str)
                                continue;
                            style = styles[item.fontName];
                            tx = Util.transform(vp1.transform, item.transform);
                            fontH = Math.hypot(tx[2], tx[3]);
                            asc = style && Number.isFinite(style.ascent) && style.ascent > 0
                                ? style.ascent
                                : 0.8;
                            span = document.createElement("span");
                            // PDF text is untrusted: never innerHTML
                            span.textContent = this.applyEdits(item.str, edits.get(item));
                            span.style.cssText =
                                "position:absolute;white-space:pre;color:transparent;transform-origin:0 0";
                            span.style.left = "".concat((tx[4] / vp1.width) * 100, "%");
                            span.style.top = "".concat(((tx[5] - asc * fontH) / vp1.height) * 100, "%");
                            span.style.fontSize = "".concat((fontH / vp1.width) * 100, "cqw");
                            // The PDF's embedded font (registered by pdf.js), else the fallback.
                            span.style.fontFamily = "\"".concat(item.fontName, "\", ").concat((style && style.fontFamily) || "sans-serif");
                            angle = Math.atan2(tx[1], tx[0]);
                            if (angle)
                                span.style.transform = "rotate(".concat(angle, "rad)");
                            frag.appendChild(span);
                        }
                        layer.appendChild(frag);
                        (_b = entry.textLayer) === null || _b === void 0 ? void 0 : _b.remove();
                        entry.textLayer = layer;
                        entry.div.appendChild(layer);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.applyEdits = function (str, edits) {
            if (!edits)
                return str;
            var out = "";
            var pos = 0;
            edits
                .slice()
                .sort(function (a, b) { return a.start - b.start; })
                .forEach(function (e) {
                out += str.slice(pos, e.start) + e.text;
                pos = e.end;
            });
            return out + str.slice(pos);
        };
        _this.setWrap = function (ref) {
            _this.refCanvasWrap = ref;
        };
        return _this;
    }
    PDFHighlight.prototype.componentDidMount = function () {
        var _this = this;
        this.unmounted = false; // StrictMode re-mounts the same instance
        this.startLoad();
        var wrap = this.refCanvasWrap;
        if (wrap && typeof ResizeObserver !== "undefined") {
            this.resizeObserver = new ResizeObserver(this.loadResize);
            this.resizeObserver.observe(wrap);
        }
        else {
            window.addEventListener("resize", this.loadResize);
        }
        USER_SCROLL_EVENTS.forEach(function (type) {
            return wrap === null || wrap === void 0 ? void 0 : wrap.addEventListener(type, _this.cancelScroll, { passive: true });
        });
    };
    PDFHighlight.prototype.componentDidUpdate = function (prev) {
        var _this = this;
        var _a;
        var p = this.props;
        var changed = function (keys) {
            return keys.some(function (k) { return !sameValue(prev[k], p[k]); });
        };
        if (changed(["replaceTexts", "specialWordRemoves"])) {
            ++this.textGen;
            this.searchText.clear();
        }
        if (prev.url !== p.url || prev.pdfjs !== p.pdfjs) {
            this.startLoad();
        }
        else if (changed(RASTER_KEYS)) {
            if (this.pdf) {
                (_a = p.onStartLoad) === null || _a === void 0 ? void 0 : _a.call(p);
                this.renderPage();
            }
        }
        else if (changed(HIGHLIGHT_KEYS)) {
            this.repaintHighlights();
            if (p.allowHtml && changed(["replaceTexts", "specialWordRemoves"])) {
                // Rebuilt once typing in the replace inputs pauses.
                if (this.textTimer)
                    clearTimeout(this.textTimer);
                this.textTimer = setTimeout(function () {
                    _this.textTimer = undefined;
                    if (_this.unmounted || !_this.props.allowHtml)
                        return;
                    _this.pages.forEach(function (entry, page) {
                        _this.appendTextToCanvas(entry, page).catch(function (e) {
                            return _this.fail("text layer ".concat(page), e, page);
                        });
                    });
                }, 150);
            }
        }
        // width / styleWrap are CSS only; the ResizeObserver re-rasterizes if needed.
        if (changed(SEARCH_KEYS))
            this.scrollToMatch();
    };
    PDFHighlight.prototype.componentWillUnmount = function () {
        var _this = this;
        var _a;
        this.unmounted = true;
        ++this.loadReq;
        if (this.timeoutRender)
            clearTimeout(this.timeoutRender);
        if (this.textTimer)
            clearTimeout(this.textTimer);
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.resizeObserver = undefined;
        window.removeEventListener("resize", this.loadResize);
        USER_SCROLL_EVENTS.forEach(function (type) { var _a; return (_a = _this.refCanvasWrap) === null || _a === void 0 ? void 0 : _a.removeEventListener(type, _this.cancelScroll); });
        this.releaseDocument();
        // The pdf.js <script> stays: other and future instances reuse it.
    };
    Object.defineProperty(PDFHighlight.prototype, "log", {
        // Debug output: with debug off the call and its arguments are skipped.
        get: function () {
            return this.props.debug ? console : undefined;
        },
        enumerable: false,
        configurable: true
    });
    PDFHighlight.prototype.render = function () {
        var _a = this.props, _b = _a.width, width = _b === void 0 ? "100%" : _b, styleWrap = _a.styleWrap;
        return (jsxRuntime.jsx("div", { ref: this.setWrap, style: __assign({ width: width, minHeight: "100%", overflow: "auto" }, (styleWrap || {})) }));
    };
    return PDFHighlight;
}(react.Component));

exports.PDFHighlight = PDFHighlight;
//# sourceMappingURL=index.js.map
