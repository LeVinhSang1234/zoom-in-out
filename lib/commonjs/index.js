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

var DEFAULT_CDN_PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
var DEFAULT_CDN_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
var DEFAULT_INTEGRITY = "sha512-q+4liFwdPC/bNdhUpZx6aXDx/h77yEQtn4I1slHydcbZK34nLaR3cAeYSJshoxIOq3mjEf7xJE8YWIUHMn+oCQ==";
// cdnjs does not serve the cmaps; needed for CJK PDFs using predefined CMaps.
var CMAP_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/";
var MAX_CANVAS_PIXELS = 8e6; // iOS Safari caps a canvas at 16.7M px
var MAX_CONCURRENT_RENDERS = 2;
// Pages within one viewport above/below the visible area get rendered; pages
// that leave this band release their canvases.
var RENDER_MARGIN = "100% 0px";
// Props that only change the highlight overlay (no re-rasterization).
var HIGHLIGHT_KEYS = [
    "keywords",
    "colorHighlight",
    "isBorderHighlight",
    "pageSearch",
    "specialWordRemoves",
    "maxKeywordLength",
    "replaceTexts",
];
// Props that change the page bitmaps.
var RASTER_KEYS = ["scale", "page", "allowHtml"];
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
// One shared <script> for every instance; rejects (and allows a retry) on error.
var pdfjsPromise;
var loadPdfJs = function () {
    return (pdfjsPromise !== null && pdfjsPromise !== void 0 ? pdfjsPromise : (pdfjsPromise = new Promise(function (res, rej) {
        var g = window.globalThis;
        var ready = function () {
            var lib = g.pdfjsLib;
            if (!lib)
                return rej(new Error("pdf.js loaded but pdfjsLib is missing"));
            if (!lib.GlobalWorkerOptions.workerSrc) {
                lib.GlobalWorkerOptions.workerSrc = DEFAULT_CDN_WORKER;
            }
            res(lib);
        };
        if (g.pdfjsLib)
            return ready();
        var script = document.createElement("script");
        script.src = DEFAULT_CDN_PDFJS;
        script.crossOrigin = "anonymous";
        script.integrity = DEFAULT_INTEGRITY;
        script.referrerPolicy = "no-referrer";
        script.onload = ready;
        script.onerror = function () {
            script.remove();
            pdfjsPromise = undefined;
            rej(new Error("Failed to load pdf.js from " + DEFAULT_CDN_PDFJS));
        };
        document.head.appendChild(script);
    })));
};
var PDFHighlight = /** @class */ (function (_super) {
    __extends(PDFHighlight, _super);
    function PDFHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
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
        _this.startLoad = function () {
            var _a = _this.props, url = _a.url, onStartLoad = _a.onStartLoad, onLoaded = _a.onLoaded;
            if (!url) {
                _this.loadPDf().catch(function () { return undefined; }); // only releases the old document
                return;
            }
            onStartLoad === null || onStartLoad === void 0 ? void 0 : onStartLoad();
            _this.loadPDf()
                .then(function (ok) { return (ok ? _this.renderPage() : undefined); })
                .catch(function (e) { return onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded(e); });
        };
        _this.loadPDf = function () { return __awaiter(_this, void 0, void 0, function () {
            var req, url, task, pdfjsLib, pdf, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = ++this.loadReq;
                        url = this.props.url;
                        this.releaseDocument();
                        if (!url)
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loadPdfJs()];
                    case 2:
                        pdfjsLib = _a.sent();
                        if (req !== this.loadReq)
                            return [2 /*return*/, false];
                        task = pdfjsLib.getDocument({
                            url: url,
                            isEvalSupported: false,
                            cMapUrl: CMAP_URL,
                            cMapPacked: true,
                        });
                        this.loadingTask = task;
                        return [4 /*yield*/, task.promise];
                    case 3:
                        pdf = _a.sent();
                        if (req !== this.loadReq)
                            return [2 /*return*/, false];
                        this.pdf = pdf;
                        return [2 /*return*/, true];
                    case 4:
                        e_1 = _a.sent();
                        if (req !== this.loadReq)
                            return [2 /*return*/, false]; // superseded or unmounted
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        _this.releaseDocument = function () {
            var _a;
            _this.resetPages();
            _this.textCache.clear();
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
            [entry.base, entry.hl].forEach(function (c) {
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
                var _a, _b;
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
                if (_this.props.debug)
                    console.info("[PDFHighlight] resize", w);
                (_b = (_a = _this.props).onStartLoad) === null || _b === void 0 ? void 0 : _b.call(_a);
                _this.renderPage();
            }, 150);
        };
        _this.isCancelled = function (e) { return (e === null || e === void 0 ? void 0 : e.name) === "RenderingCancelledException"; };
        // Lays out one placeholder per page, then rasterizes pages lazily as they
        // approach the viewport. onLoaded fires once the first visible batch is drawn.
        _this.renderPage = function () { return __awaiter(_this, void 0, void 0, function () {
            var pdf, wrap, gen, _a, onLoaded, page, nums, first, vp_1, frag_1, keep, error, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pdf = this.pdf;
                        wrap = this.refCanvasWrap;
                        if (!pdf || !wrap || !wrap.clientWidth)
                            return [2 /*return*/];
                        this.resetPages();
                        gen = this.renderGen;
                        _a = this.props, onLoaded = _a.onLoaded, page = _a.page;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        nums = page
                            ? [page]
                            : Array.from({ length: pdf.numPages }, function (_, i) { return i + 1; });
                        return [4 /*yield*/, pdf.getPage(nums[0])];
                    case 2:
                        first = _b.sent();
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
                        return [4 /*yield*/, this.observePages(wrap, gen)];
                    case 3:
                        error = _b.sent();
                        if (gen === this.renderGen)
                            onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded(error);
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _b.sent();
                        if (gen === this.renderGen && !this.isCancelled(e_2))
                            onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded(e_2);
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
                        var n = Number(e.target.dataset.page);
                        if (e.isIntersecting) {
                            _this.visible.add(n);
                        }
                        else {
                            _this.visible.delete(n);
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
        _this.pump = function (gen) {
            var queue = Array.from(_this.visible)
                .filter(function (n) { return !_this.pages.has(n) && !_this.active.has(n); })
                .sort(function (a, b) { return a - b; });
            var _loop_1 = function () {
                var n = queue.shift();
                _this.active.add(n);
                _this.renderPdf(n, gen)
                    .catch(function (e) {
                    if (gen !== _this.renderGen || _this.isCancelled(e))
                        return;
                    _this.pageError = _this.pageError || e;
                    if (_this.props.debug)
                        console.error("[PDFHighlight] page", n, e);
                })
                    .then(function () {
                    if (gen !== _this.renderGen)
                        return;
                    _this.active.delete(n);
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
            var pdf, div, pagePdf, _a, _b, scale, allowHtml, vp1, dpr, rasterScale, viewport, base, hl, ctx, entry, textLayer, text;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pdf = this.pdf;
                        div = this.slots.get(page);
                        if (!pdf || !div)
                            return [2 /*return*/];
                        return [4 /*yield*/, pdf.getPage(page)];
                    case 1:
                        pagePdf = _c.sent();
                        if (gen !== this.renderGen || !this.visible.has(page))
                            return [2 /*return*/];
                        _a = this.props, _b = _a.scale, scale = _b === void 0 ? 1 : _b, allowHtml = _a.allowHtml;
                        vp1 = pagePdf.getViewport({ scale: 1 });
                        dpr = window.devicePixelRatio || 1;
                        rasterScale = Math.min(Math.max(scale, (this.renderedWidth / vp1.width) * dpr), Math.sqrt(MAX_CANVAS_PIXELS / (vp1.width * vp1.height)));
                        viewport = pagePdf.getViewport({ scale: rasterScale });
                        div.style.aspectRatio = "".concat(vp1.width, " / ").concat(vp1.height);
                        base = document.createElement("canvas");
                        hl = document.createElement("canvas");
                        [base, hl].forEach(function (c) {
                            c.width = Math.floor(viewport.width);
                            c.height = Math.floor(viewport.height);
                            c.style.display = "block";
                            c.style.width = "100%";
                        });
                        hl.style.position = "absolute";
                        hl.style.left = "0";
                        hl.style.top = "0";
                        hl.style.height = "100%";
                        hl.style.pointerEvents = "none";
                        div.appendChild(base);
                        div.appendChild(hl);
                        ctx = base.getContext("2d");
                        if (!ctx)
                            return [2 /*return*/];
                        entry = { pagePdf: pagePdf, div: div, base: base, hl: hl, viewport: viewport, vp1: vp1 };
                        this.pages.set(page, entry);
                        textLayer = allowHtml
                            ? this.appendTextToCanvas(entry, page)
                            : undefined;
                        text = this.getText(pagePdf, page);
                        entry.task = pagePdf.render({ canvasContext: ctx, viewport: viewport });
                        return [4 /*yield*/, Promise.all([entry.task.promise, text, textLayer])];
                    case 2:
                        _c.sent();
                        // Paint once rendered: pdf.js has loaded the PDF's own fonts by then.
                        return [4 /*yield*/, this.paintPage(page, this.paintGen)];
                    case 3:
                        // Paint once rendered: pdf.js has loaded the PDF's own fonts by then.
                        _c.sent();
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
                _this.paintPage(page, paint).catch(function () { return undefined; });
            });
        };
        _this.paintPage = function (page, paint) { return __awaiter(_this, void 0, void 0, function () {
            var entry, ctx, _a, _b, keywords, pageSearch, _c, replaceTexts, search, tc, p, removes, original, reps, shown;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        entry = this.pages.get(page);
                        ctx = entry === null || entry === void 0 ? void 0 : entry.hl.getContext("2d");
                        if (!entry || !ctx)
                            return [2 /*return*/];
                        ctx.clearRect(0, 0, entry.hl.width, entry.hl.height);
                        _a = this.props, _b = _a.keywords, keywords = _b === void 0 ? [] : _b, pageSearch = _a.pageSearch, _c = _a.replaceTexts, replaceTexts = _c === void 0 ? [] : _c;
                        search = !!keywords.length && (!pageSearch || pageSearch === page);
                        if (!search && !replaceTexts.length)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.getText(entry.pagePdf, page)];
                    case 1:
                        tc = _d.sent();
                        if (paint !== this.paintGen || this.pages.get(page) !== entry)
                            return [2 /*return*/];
                        p = { ctx: ctx, tc: tc, viewport: entry.viewport, pagePdf: entry.pagePdf };
                        removes = this.props.specialWordRemoves || [];
                        original = this.buildIndex(tc.items, removes);
                        reps = this.planReplacements(original);
                        // Replacements first, so highlights stay visible on top of them.
                        this.drawReplacements(p, reps, page);
                        if (!search)
                            return [2 /*return*/];
                        shown = reps.length ? this.buildIndex(tc.items, removes, reps) : original;
                        this.drawHighlights(p, shown, page);
                        return [2 /*return*/];
                }
            });
        }); };
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
            var weight = font.black ? "900" : font.bold ? "bold" : "normal";
            var italic = font.italic ? "italic" : "normal";
            var family = (font.systemFontInfo && font.systemFontInfo.css) ||
                "\"".concat(font.loadedName, "\", ").concat(font.fallbackName || fallback);
            return "".concat(italic, " ").concat(weight, " ").concat(size, "px ").concat(family);
        };
        // Box of item.str[start, end). Browser widths are scaled onto the exact PDF
        // advance (item.width); `track` is the extra spacing per char the PDF adds.
        _this.sliceBox = function (p, _a) {
            var item = _a.item, start = _a.start, end = _a.end;
            var Util = window.globalThis.pdfjsLib.Util;
            var style = p.tc.styles[item.fontName];
            var tx = Util.transform(p.viewport.transform, item.transform);
            var fontH = Math.hypot(tx[2], tx[3]);
            var asc = style && Number.isFinite(style.ascent) && style.ascent > 0
                ? style.ascent
                : 0.8;
            var desc = style && Number.isFinite(style.descent) && style.descent < 0
                ? style.descent
                : -0.2;
            var font = _this.fontOf(p, item, fontH);
            p.ctx.font = font;
            var target = item.width * p.viewport.scale;
            var full = p.ctx.measureText(item.str).width || 1;
            var k = target / full;
            var x0 = p.ctx.measureText(item.str.slice(0, start)).width * k;
            var x1 = p.ctx.measureText(item.str.slice(0, end)).width * k;
            return {
                tx: tx,
                angle: Math.atan2(tx[1], tx[0]),
                x0: x0,
                w: x1 - x0,
                y: -asc * fontH,
                h: (asc - desc) * fontH,
                font: font,
                track: (target - full) / Math.max(1, item.str.length),
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
        _this.drawReplacements = function (p, parts, page) {
            var ctx = p.ctx;
            if (_this.props.debug && parts.length) {
                console.info("[PDFHighlight] page", page, "replaced slices", parts.length);
            }
            parts.forEach(function (part) {
                if (part !== part.line[0])
                    return; // drawn once per visual line
                ctx.save();
                var b = _this.lineBox(p, part.line);
                var pad = b.h * 0.05; // hide anti-aliased edges of the original glyphs
                ctx.translate(b.tx[4], b.tx[5]);
                ctx.rotate(b.angle);
                ctx.fillStyle = part.rule.background || "#fff";
                ctx.fillRect(b.x0 - pad, b.y - pad, b.w + 2 * pad, b.h + 2 * pad);
                if (part.text && b.w > 0) {
                    var k = _this.useFont(ctx, b, part.text);
                    ctx.fillStyle = part.rule.color || "#000";
                    ctx.textBaseline = "alphabetic";
                    // A longer replacement is scaled down evenly on its baseline to fit,
                    // never squeezed horizontally.
                    ctx.save();
                    ctx.translate(b.x0, 0);
                    ctx.scale(k, k);
                    ctx.fillText(part.text, 0, 0);
                    ctx.restore();
                    // Replaced text is marked like a keyword match.
                    _this.mark(ctx, b.x0, b.y, ctx.measureText(part.text).width * k, b.h);
                }
                ctx.restore();
            });
        };
        // One highlight box in the current transform: a translucent fill, or a
        // border with isBorderHighlight.
        _this.mark = function (ctx, x, y, w, h) {
            var _a = _this.props, _b = _a.colorHighlight, colorHighlight = _b === void 0 ? "yellow" : _b, isBorderHighlight = _a.isBorderHighlight;
            ctx.save();
            if (isBorderHighlight) {
                ctx.strokeStyle = colorHighlight;
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, w, h);
            }
            else {
                ctx.fillStyle = colorHighlight;
                ctx.globalAlpha = 0.2;
                ctx.fillRect(x, y, w, h);
            }
            ctx.restore();
        };
        // Every occurrence of every replaceTexts rule as per-item pieces, with the
        // replacement text spread over the visual lines the match spans. Earlier
        // rules win where matches overlap.
        _this.planReplacements = function (index) {
            var _a = _this.props, _b = _a.replaceTexts, replaceTexts = _b === void 0 ? [] : _b, _c = _a.specialWordRemoves, specialWordRemoves = _c === void 0 ? [] : _c;
            var out = [];
            var taken = new Uint8Array(index.text.length);
            var size = function (line) { return line.reduce(function (n, s) { return n + s.end - s.start; }, 0); };
            replaceTexts.forEach(function (rule) {
                var needle = _this.normalizeNeedle(rule.search, specialWordRemoves, Infinity);
                var text = rule.replace || "";
                _this.findAll(index, needle).forEach(function (_a) {
                    var from = _a[0], to = _a[1];
                    for (var i = from; i < to; i++)
                        if (taken[i])
                            return;
                    taken.fill(1, from, to);
                    var lines = _this.lines(_this.slices(index, from, to));
                    var total = lines.reduce(function (n, l) { return n + size(l); }, 0);
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
                            var piece = { item: s.item, start: s.start, end: s.end, rule: rule, line: line };
                            line.push(__assign(__assign({}, piece), { text: j ? "" : chunk }));
                        });
                        line.forEach(function (piece) { return out.push(piece); });
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
        _this.drawHighlights = function (p, index, page) {
            var ctx = p.ctx;
            var _a = _this.props, _b = _a.keywords, keywords = _b === void 0 ? [] : _b, _c = _a.specialWordRemoves, specialWordRemoves = _c === void 0 ? [] : _c, _d = _a.maxKeywordLength, maxKeywordLength = _d === void 0 ? 2000 : _d, debug = _a.debug;
            var needles = Array.from(new Set(keywords.map(function (k) {
                return _this.normalizeNeedle(k, specialWordRemoves, maxKeywordLength);
            }))).filter(Boolean); // drops whitespace-only keywords
            for (var _i = 0, needles_1 = needles; _i < needles_1.length; _i++) {
                var needle = needles_1[_i];
                var matches = _this.findAll(index, needle);
                if (debug) {
                    console.info("[PDFHighlight] page", page, "matches", matches.length, needle);
                }
                for (var _e = 0, matches_1 = matches; _e < matches_1.length; _e++) {
                    var _f = matches_1[_e], from = _f[0], to = _f[1];
                    for (var _g = 0, _h = _this.lines(_this.slices(index, from, to)); _g < _h.length; _g++) {
                        var line = _h[_g];
                        var b = _this.mergeBoxes(line.map(function (s) {
                            return s.rep < 0
                                ? _this.sliceBox(p, s)
                                : _this.replacedBox(p, index.reps[s.rep], s.start, s.end);
                        }));
                        ctx.save();
                        ctx.translate(b.tx[4], b.tx[5]);
                        ctx.rotate(b.angle);
                        _this.mark(ctx, b.x0, b.y, b.w, b.h);
                        ctx.restore();
                    }
                }
            }
        };
        // Whitespace-free page text plus a map from each char back to its source:
        // (item, offset) in the PDF text, or (replacement, offset) where `reps`
        // changed what is displayed.
        _this.buildIndex = function (items, removes, reps) {
            if (reps === void 0) { reps = []; }
            var chars = [];
            var item = [];
            var off = [];
            var rep = [];
            var clean = function (s) {
                removes.forEach(function (r) {
                    if (r)
                        s = s.split(r).join(" ".repeat(r.length)); // keep offsets
                });
                return s;
            };
            var add = function (s, i, r, from, to) {
                for (var j = from; j < to; j++) {
                    if (/\s/.test(s[j]))
                        continue;
                    chars.push(s[j]);
                    item.push(i);
                    off.push(j);
                    rep.push(r);
                }
            };
            var repsOf = new Map();
            reps.forEach(function (r, n) { return repsOf.set(r.item, (repsOf.get(r.item) || []).concat(n)); });
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
            return { text: chars.join(""), item: item, off: off, rep: rep, items: items, reps: reps };
        };
        _this.normalizeNeedle = function (keyword, removes, max) {
            var k = keyword || "";
            removes.forEach(function (r) {
                if (r)
                    k = k.split(r).join(" ");
            });
            return k.replace(/\s+/g, "").slice(0, max || 2000);
        };
        _this.findAll = function (idx, needle) {
            var out = [];
            if (!needle)
                return out;
            var p = idx.text.indexOf(needle);
            while (p !== -1) {
                out.push([p, p + needle.length]);
                p = idx.text.indexOf(needle, p + needle.length);
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
                while (last + 1 < to && idx.item[last + 1] === i && idx.rep[last + 1] === r) {
                    last++;
                }
                out.push({ item: idx.items[i], start: idx.off[k], end: idx.off[last] + 1, rep: r });
                k = last + 1;
            }
            return out;
        };
        // Transparent, selectable text positioned in % of the page, so it follows
        // CSS resizes without re-layout. Rebuilding replaces the previous layer.
        _this.appendTextToCanvas = function (entry, page) { return __awaiter(_this, void 0, void 0, function () {
            var _a, items, styles, Util, _b, _c, replaceTexts, _d, specialWordRemoves, vp1, edits, index, layer, frag, _i, items_1, item, style, tx, fontH, asc, span, angle;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.getText(entry.pagePdf, page)];
                    case 1:
                        _a = _f.sent(), items = _a.items, styles = _a.styles;
                        if (this.pages.get(page) !== entry)
                            return [2 /*return*/]; // evicted or superseded
                        Util = window.globalThis.pdfjsLib.Util;
                        _b = this.props, _c = _b.replaceTexts, replaceTexts = _c === void 0 ? [] : _c, _d = _b.specialWordRemoves, specialWordRemoves = _d === void 0 ? [] : _d;
                        vp1 = entry.vp1;
                        edits = new Map();
                        if (replaceTexts.length) {
                            index = this.buildIndex(items, specialWordRemoves);
                            this.planReplacements(index).forEach(function (r) {
                                edits.set(r.item, (edits.get(r.item) || []).concat(r));
                            });
                        }
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
                        (_e = entry.textLayer) === null || _e === void 0 ? void 0 : _e.remove();
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
    };
    PDFHighlight.prototype.componentDidUpdate = function (prev) {
        var _this = this;
        var _a;
        var p = this.props;
        var changed = function (keys) {
            return keys.some(function (k) { return !sameValue(prev[k], p[k]); });
        };
        if (prev.url !== p.url) {
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
                this.pages.forEach(function (entry, page) {
                    _this.appendTextToCanvas(entry, page).catch(function () { return undefined; });
                });
            }
        }
        // width / styleWrap are CSS only; the ResizeObserver re-rasterizes if needed.
    };
    PDFHighlight.prototype.componentWillUnmount = function () {
        var _a;
        this.unmounted = true;
        ++this.loadReq;
        if (this.timeoutRender)
            clearTimeout(this.timeoutRender);
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.resizeObserver = undefined;
        window.removeEventListener("resize", this.loadResize);
        this.releaseDocument();
        // The pdf.js <script> stays: other and future instances reuse it.
    };
    PDFHighlight.prototype.render = function () {
        var _a = this.props, _b = _a.width, width = _b === void 0 ? "100%" : _b, styleWrap = _a.styleWrap;
        return (jsxRuntime.jsx("div", { ref: this.setWrap, style: __assign({ width: width, minHeight: "100%", overflow: "auto" }, (styleWrap || {})) }));
    };
    return PDFHighlight;
}(react.Component));

exports.PDFHighlight = PDFHighlight;
//# sourceMappingURL=index.js.map
