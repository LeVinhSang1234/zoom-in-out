import { Component, CSSProperties } from "react";

interface Contents {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
}

export interface ReplaceText {
  search: string;
  replace: string;
  color?: string; // text color, default: the page's ink
  background?: string; // covers the original glyphs, default: the page's paper
  highlight?: boolean;
}

interface Props {
  url?: string;
  width?: number | string;
  scale?: number;
  page?: number;
  pageSearch?: number;
  onLoaded?: (error?: any) => void;
  onStartLoad?: (error?: any) => void;
  keywords?: string[];
  colorHighlight?: string;
  colorKeyword?: string;
  isBorderHighlight?: boolean;
  styleWrap?: CSSProperties;
  debug?: boolean;
  allowHtml?: boolean;
  specialWordRemoves?: string[];
  maxKeywordLength?: number;
  replaceTexts?: ReplaceText[];
  pdfjs?: any;
}

interface TextStyle {
  fontFamily: string;
  ascent: number;
  descent: number;
}
interface TextContent {
  items: Contents[];
  styles: Record<string, TextStyle>;
}
interface PageEntry {
  pagePdf: any;
  div: HTMLDivElement;
  base: HTMLCanvasElement;
  hl: HTMLCanvasElement;
  found: HTMLCanvasElement;
  viewport: any;
  vp1: any;
  task?: any;
  textLayer?: HTMLDivElement;
  colors: Map<string, Colors>; // sampled from the rendered page, by region
  ready?: boolean; // rendered, so the PDF's fonts are loaded for measuring
  lastPaint?: { gen: number; p: Paint; shown: PageIndex };
  laid?: Laid; // layout for the current textGen (only once fonts are loaded)
  hlKey?: string; // what the hl overlay was drawn for
}
interface Laid {
  gen: number;
  tc: TextContent;
  items: Item[];
  reps: ReplaceSlice[];
  flows: Flow[];
  original: PageIndex;
  shown?: PageIndex;
}
interface ItemMetrics {
  tx: number[];
  angle: number;
  fontH: number;
  asc: number;
  desc: number;
  font: string;
  raw: number;
  k: number;
  track: number;
}
interface PageIndex {
  text: string;
  lower: string; // text lowercased char by char, so offsets still line up
  item: number[];
  off: number[];
  rep: number[]; // -1 for PDF text, else the index into reps
  items: Contents[];
  reps: ReplaceSlice[];
}
interface Slice {
  item: Contents;
  start: number;
  end: number;
}
// A replaced piece of one item. The replacement text for a whole visual line
// sits on the line's first piece; `line` lists every piece of that line and
// `whole` every piece of the match.
type ReplaceSlice = Slice & {
  text: string;
  rule: ReplaceText;
  line: ReplaceSlice[];
  whole: ReplaceSlice[];
};
// A text item as displayed; items made by a reflow carry their rule when they
// hold replacement text.
type Item = Contents & { rule?: ReplaceText; dy?: number };
// Items [first, last] on one baseline (canvas px); a wide gap ends a segment
// so table cells and columns stay apart.
interface Segment {
  first: number;
  last: number;
  text: boolean;
  flat: boolean; // upright, unrotated text: the only kind that is reflowed
  x: number;
  right: number;
  y: number;
  size: number;
}
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Colors {
  paper: string;
  ink: string;
}
// A paragraph laid out again: new items replace items [first, last], drawn
// over the `cover` rects that hide the original lines.
interface Flow {
  first: number;
  last: number;
  items: Item[];
  cover: Rect[];
  background?: string;
  top: number;
  bottom: number;
  end: number;
  x0: number;
  x1: number;
  grow: number;
  offset: number;
}
// A text box in canvas px, relative to the baseline origin tx[4], tx[5] and
// rotated by `angle`; `font`/`track` reproduce how the PDF sets that text.
interface Box {
  tx: number[];
  angle: number;
  x0: number;
  w: number;
  y: number;
  h: number;
  font: string;
  track: number;
}
interface Paint {
  ctx: CanvasRenderingContext2D;
  tc: TextContent;
  viewport: any;
  pagePdf: any;
  base: HTMLCanvasElement;
  colors: Map<string, Colors>;
  dyAt: (x: number, y: number) => number;
  metrics: Map<Contents, ItemMetrics>;
}

const DEFAULT_CDN_PDFJS =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

const DEFAULT_CDN_WORKER =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const DEFAULT_INTEGRITY =
  "sha512-q+4liFwdPC/bNdhUpZx6aXDx/h77yEQtn4I1slHydcbZK34nLaR3cAeYSJshoxIOq3mjEf7xJE8YWIUHMn+oCQ==";

const PDFJS_DIST = "https://cdn.jsdelivr.net/npm/pdfjs-dist@";

// cdnjs does not serve the cmaps; needed for CJK PDFs using predefined CMaps.
const cMapUrlFor = (lib: any) =>
  `${PDFJS_DIST}${lib.version || "3.11.174"}/cmaps/`;

// pdf.js refuses a worker from another version, so match the library's.
const workerFor = (lib: any) => {
  if (!lib.version) return DEFAULT_CDN_WORKER;
  const ext = parseInt(lib.version, 10) >= 4 ? "mjs" : "js";
  return `${PDFJS_DIST}${lib.version}/build/pdf.worker.min.${ext}`;
};

// Keeps a worker the app configured; otherwise points at a matching one.
// Lowercase keeping the length (a char whose lowercase is longer stays as is).
const lowerEach = (s: string) =>
  s
    .split("")
    .map((c) => {
      const l = c.toLowerCase();
      return l.length === 1 ? l : c;
    })
    .join("");
// Whole-string toLowerCase gives the same text unless a char lowercases to two
// units (length changes), a Sigma (final-form rule) or a surrogate is present.
const lowerChars = (s: string) => {
  const l = s.toLowerCase();
  return l.length === s.length && !/[\u03a3\ud800-\udfff]/.test(s)
    ? l
    : lowerEach(s);
};
// Exactly the chars /\s/ matches.
const isSpace = (c: number) =>
  c <= 32
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

let colorCtx: CanvasRenderingContext2D | null | undefined;
// A CSS color as the canvas normalizes it ("#rrggbb" or "rgba(...)").
const normColor = (color: string) => {
  colorCtx = colorCtx || document.createElement("canvas").getContext("2d");
  if (!colorCtx) return color;
  colorCtx.fillStyle = "#000";
  colorCtx.fillStyle = color;
  return String(colorCtx.fillStyle);
};
// The same color at 70% brightness.
const darker = (color: string) => {
  const c = normColor(color);
  const hex = /^#([0-9a-f]{6})$/i.exec(c);
  const rgb = hex
    ? [16, 8, 0].map((s) => (parseInt(hex[1], 16) >> s) & 255)
    : (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  if (rgb.length < 3) return color;
  const [r, g, b] = rgb.map((v) => Math.round(v * 0.7));
  return `rgb(${r}, ${g}, ${b})`;
};

const withWorker = (lib: any) => {
  const options = lib.GlobalWorkerOptions;
  if (!options.workerSrc && !options.workerPort) {
    options.workerSrc = workerFor(lib);
  }
  return lib;
};

const SERIF_FAMILY =
  /times|roman|serif|georgia|cambria|garamond|book|palatino/i;

const systemFamilyOf = (name: string) => {
  const base = name
    .replace(/^[A-Z]{6}\+/, "")
    .split(/[-,]/)[0]
    .replace(/(?:PSMT|PS|MT)$/, "");
  return base.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
};

const MAX_CANVAS_PIXELS = 8e6; // iOS Safari caps a canvas at 16.7M px
const MAX_CONCURRENT_RENDERS = 2;
// Pages within one viewport above/below the visible area get rendered; pages
// that leave this band release their canvases.
const RENDER_MARGIN = "100% 0px";

// Props that only change the highlight overlay (no re-rasterization).
const HIGHLIGHT_KEYS: (keyof Props)[] = [
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
const RASTER_KEYS: (keyof Props)[] = ["scale", "page", "allowHtml"];
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"];
// A change scrolls to the first match (replaceTexts edits do not).
const SEARCH_KEYS: (keyof Props)[] = [
  "keywords",
  "pageSearch",
  "page",
  "specialWordRemoves",
  "maxKeywordLength",
];

const sameShallow = (a: any, b: any): boolean =>
  a === b ||
  (!!a &&
    !!b &&
    typeof a === "object" &&
    typeof b === "object" &&
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every((k) => a[k] === b[k]));

// Arrays compare by content (inline literals like replaceTexts={[{...}]} are
// new objects on every parent render).
const sameValue = (a: any, b: any): boolean =>
  a === b ||
  (Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((x, i) => sameShallow(x, b[i])));

// pdf.js already on the page: a <script> build or a UMD bundle.
const globalPdfJs = () => {
  const g = window.globalThis as any;
  return g.pdfjsLib || g["pdfjs-dist/build/pdf"];
};

// The page's pdf.js if it has one, else one shared cdnjs <script> for every
// instance; rejects (and allows a retry) on error.
let pdfjsPromise: Promise<any> | undefined;
let pdfjsFrom = ""; // "global" or "cdnjs", for debug output
let instances = 0;
const loadPdfJs = (): Promise<any> =>
  (pdfjsPromise ??= new Promise((res, rej) => {
    const ready = () => {
      const lib = globalPdfJs();
      if (!lib) return rej(new Error("pdf.js loaded but pdfjsLib is missing"));
      pdfjsFrom = pdfjsFrom || "cdnjs";
      res(withWorker(lib));
    };
    if (globalPdfJs()) {
      pdfjsFrom = "global";
      return ready();
    }
    const script = document.createElement("script");
    script.src = DEFAULT_CDN_PDFJS;
    script.crossOrigin = "anonymous";
    script.integrity = DEFAULT_INTEGRITY;
    script.referrerPolicy = "no-referrer";
    script.onload = ready;
    script.onerror = () => {
      script.remove();
      pdfjsPromise = undefined;
      rej(new Error(`Failed to load pdf.js from ${DEFAULT_CDN_PDFJS}`));
    };
    document.head.appendChild(script);
    // Warm the HTTP cache with the worker (1 MB) meanwhile, instead of pdf.js
    // starting that download only once this script has run.
    if (typeof fetch === "function") {
      fetch(workerFor({ version: "3.11.174" }), { mode: "no-cors" }).catch(
        () => undefined,
      );
    }
  }));

class PDFHighlight extends Component<Props> {
  private tag = `[PDFHighlight#${++instances}]`;
  private warned = new Set<string>();
  private failed = new Set<number>(); // pages not retried until scrolled in again
  private lib?: any; // the pdf.js in use
  private pdf?: any;
  private loadingTask?: any;
  private refCanvasWrap?: HTMLDivElement | null;
  private resizeObserver?: ResizeObserver;
  private observer?: IntersectionObserver;
  private timeoutRender?: ReturnType<typeof setTimeout>;
  private textTimer?: ReturnType<typeof setTimeout>;
  private loadReq = 0;
  private renderGen = 0;
  private paintGen = 0;
  private unmounted = false;
  private renderedWidth = 0;
  private slots = new Map<number, HTMLDivElement>(); // placeholder per page
  private visible = new Set<number>(); // pages inside RENDER_MARGIN
  private active = new Set<number>(); // pages with a render in flight
  private pages = new Map<number, PageEntry>(); // pages that have canvases
  private textCache = new Map<number, Promise<TextContent>>();
  private textGen = 0; // bumped when replaceTexts / specialWordRemoves change
  private searchText = new Map<number, string>(); // page -> lowercased shown text
  private onIdle?: (error?: any) => void;
  private pageError?: any;
  private scrollReq = 0;
  private pendingScroll?: { page: number; req: number };
  private scrollOnLayout = false;
  private marker?: HTMLDivElement;

  componentDidMount(): void {
    this.unmounted = false; // StrictMode re-mounts the same instance
    this.startLoad();
    const wrap = this.refCanvasWrap;
    if (wrap && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.loadResize);
      this.resizeObserver.observe(wrap);
    } else {
      window.addEventListener("resize", this.loadResize);
    }
    USER_SCROLL_EVENTS.forEach((type) =>
      wrap?.addEventListener(type, this.cancelScroll, { passive: true }),
    );
  }

  componentDidUpdate(prev: Props): void {
    const p = this.props;
    const changed = (keys: (keyof Props)[]) =>
      keys.some((k) => !sameValue(prev[k], p[k]));
    if (changed(["replaceTexts", "specialWordRemoves"])) {
      ++this.textGen;
      this.searchText.clear();
    }
    if (prev.url !== p.url || prev.pdfjs !== p.pdfjs) {
      this.startLoad();
    } else if (changed(RASTER_KEYS)) {
      if (this.pdf) {
        p.onStartLoad?.();
        this.renderPage();
      }
    } else if (changed(HIGHLIGHT_KEYS)) {
      this.repaintHighlights();
      if (p.allowHtml && changed(["replaceTexts", "specialWordRemoves"])) {
        // Rebuilt once typing in the replace inputs pauses.
        if (this.textTimer) clearTimeout(this.textTimer);
        this.textTimer = setTimeout(() => {
          this.textTimer = undefined;
          if (this.unmounted || !this.props.allowHtml) return;
          this.pages.forEach((entry, page) => {
            this.appendTextToCanvas(entry, page).catch((e) =>
              this.fail(`text layer ${page}`, e, page),
            );
          });
        }, 150);
      }
    }
    // width / styleWrap are CSS only; the ResizeObserver re-rasterizes if needed.
    if (changed(SEARCH_KEYS)) this.scrollToMatch();
  }

  componentWillUnmount(): void {
    this.unmounted = true;
    ++this.loadReq;
    if (this.timeoutRender) clearTimeout(this.timeoutRender);
    if (this.textTimer) clearTimeout(this.textTimer);
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    window.removeEventListener("resize", this.loadResize);
    USER_SCROLL_EVENTS.forEach((type) =>
      this.refCanvasWrap?.removeEventListener(type, this.cancelScroll),
    );
    this.releaseDocument();
    // The pdf.js <script> stays: other and future instances reuse it.
  }

  // Debug output: with debug off the call and its arguments are skipped.
  private get log(): Console | undefined {
    return this.props.debug ? console : undefined;
  }

  private warnOnce = (key: string, ...args: any[]) => {
    if (this.warned.has(key)) return;
    this.warned.add(key);
    console.warn(this.tag, ...args);
  };

  // A real failure outside the load path: not a cancellation, and not a page
  // that went away meanwhile.
  private fail = (key: string, e: any, page?: number) => {
    if (this.isCancelled(e)) return;
    if (page !== undefined && !this.pages.has(page)) return;
    this.warnOnce(key, e);
  };

  // Reads onLoaded when called; an error nobody handles is still printed.
  private loaded = (error?: any) => {
    const { onLoaded, debug } = this.props;
    if (error && (!onLoaded || debug)) console.error(this.tag, error);
    onLoaded?.(error);
  };

  private startLoad = () => {
    const { url, onStartLoad } = this.props;
    if (!url) {
      this.loadPDf().catch(() => undefined); // only releases the old document
      return;
    }
    onStartLoad?.();
    this.scrollOnLayout = true;
    this.loadPDf()
      .then((ok) => (ok ? this.renderPage() : undefined))
      .catch(this.loaded);
  };

  private loadPDf = async (): Promise<boolean> => {
    const req = ++this.loadReq;
    const { url, pdfjs } = this.props;
    this.releaseDocument();
    if (!url) return false;
    const start = Date.now();
    let task: any;
    try {
      // `import pdfjs from "pdfjs-dist"` may hand over the CommonJS wrapper.
      const own = pdfjs && (pdfjs.getDocument ? pdfjs : pdfjs.default);
      if (pdfjs && !own) {
        this.warnOnce("pdfjs", "the pdfjs prop has no getDocument; using cdnjs");
      }
      const lib = own ? withWorker(own) : await loadPdfJs();
      if (req !== this.loadReq) return false;
      this.lib = lib;
      task = lib.getDocument({
        url,
        isEvalSupported: false, // CVE-2024-4367, fixed upstream only in 4.2.67
        cMapUrl: cMapUrlFor(lib),
        cMapPacked: true,
      });
      this.loadingTask = task;
      const pdf = await task.promise;
      if (req !== this.loadReq) return false;
      this.pdf = pdf;
      const worker = lib.GlobalWorkerOptions;
      this.log?.info(this.tag, "loaded", {
        pdfjs: lib.version,
        from: own ? "prop" : pdfjsFrom,
        worker: worker.workerPort ? "workerPort" : worker.workerSrc,
        pages: pdf.numPages,
        ms: Date.now() - start,
      });
      return true;
    } catch (e) {
      if (req !== this.loadReq) return false; // superseded or unmounted
      throw e;
    }
  };

  private releaseDocument = () => {
    this.resetPages();
    ++this.scrollReq;
    this.pendingScroll = undefined;
    this.warned.clear();
    this.renderedWidth = 0;
    this.textCache.clear();
    this.searchText.clear();
    this.pdf = undefined;
    // Terminates this document's Web Worker and unregisters its fonts.
    this.loadingTask?.destroy().catch(() => undefined);
    this.loadingTask = undefined;
    if (this.refCanvasWrap) this.refCanvasWrap.innerHTML = "";
  };

  // Ends the current pass: in-flight work is cancelled and canvases freed.
  private resetPages = () => {
    ++this.renderGen;
    ++this.paintGen;
    this.observer?.disconnect();
    this.observer = undefined;
    Array.from(this.pages.keys()).forEach(this.evict);
    this.slots.clear();
    this.visible.clear();
    this.active.clear();
    this.failed.clear();
    this.pageError = undefined;
    // Let a pending renderPage settle; its generation check skips onLoaded.
    this.onIdle?.();
    this.onIdle = undefined;
  };

  private evict = (page: number) => {
    const entry = this.pages.get(page);
    if (!entry) return;
    this.pages.delete(page);
    entry.task?.cancel();
    [entry.base, entry.hl, entry.found].forEach((c) => {
      c.width = 0; // release the bitmap now (iOS keeps it until GC otherwise)
      c.height = 0;
    });
    entry.div.innerHTML = "";
    entry.pagePdf.cleanup();
  };

  private loadResize = () => {
    if (this.timeoutRender) clearTimeout(this.timeoutRender);
    this.timeoutRender = setTimeout(() => {
      const wrap = this.refCanvasWrap;
      if (!wrap || !this.pdf || this.unmounted) return;
      const w = wrap.clientWidth;
      if (!w) return; // hidden (display:none, closed tab/modal)
      const ratio = this.renderedWidth ? w / this.renderedWidth : 0;
      // Canvases are width:100%, so CSS absorbs small and height-only changes
      // (scrollbars, the iOS toolbar). Re-rasterize only when the bitmap would
      // be visibly soft (>10% upscale) or badly oversized.
      if (ratio && ratio <= 1.1 && ratio >= 0.75) return;
      this.log?.info(this.tag, "resize", w);
      // A render still owed (e.g. loaded while hidden) already signalled start.
      if (this.renderedWidth) this.props.onStartLoad?.();
      this.renderPage();
    }, 150);
  };

  private isCancelled = (e: any) => e?.name === "RenderingCancelledException";

  // Lays out one placeholder per page, then rasterizes pages lazily as they
  // approach the viewport. onLoaded fires once the first visible batch is drawn.
  private renderPage = async () => {
    const pdf = this.pdf; // capture once: never switch documents mid-pass
    const wrap = this.refCanvasWrap;
    if (!pdf || !wrap) return;
    if (!wrap.clientWidth) {
      // Hidden (display:none tab or modal): render once it gets a width.
      this.renderedWidth = 0;
      this.log?.info(this.tag, "hidden, rendering when shown");
      return;
    }
    this.resetPages();
    const gen = this.renderGen;
    const { page, pageSearch } = this.props;
    if (pageSearch && (pageSearch < 1 || pageSearch > pdf.numPages)) {
      this.log?.warn(this.tag, "pageSearch", pageSearch, "is not a page of 1 to", pdf.numPages);
    }
    try {
      const nums = page
        ? [page]
        : Array.from({ length: pdf.numPages }, (_, i) => i + 1);
      // Size every placeholder like the first page so the scroll height is
      // right before anything is drawn; each page fixes its ratio on render.
      const first = await pdf.getPage(nums[0]);
      if (gen !== this.renderGen) return;
      const vp = first.getViewport({ scale: 1 });
      const frag = document.createDocumentFragment();
      nums.forEach((n) => {
        const div = document.createElement("div");
        div.dataset.page = String(n); // per instance, no global ids
        div.style.position = "relative";
        div.style.aspectRatio = `${vp.width} / ${vp.height}`;
        frag.appendChild(div);
        this.slots.set(n, div);
      });
      const keep =
        wrap.scrollHeight > wrap.clientHeight
          ? wrap.scrollTop / wrap.scrollHeight
          : 0;
      wrap.innerHTML = "";
      wrap.appendChild(frag);
      if (keep) wrap.scrollTop = keep * wrap.scrollHeight;
      this.renderedWidth = wrap.clientWidth;
      if (this.scrollOnLayout) {
        this.scrollOnLayout = false;
        this.scrollToMatch();
      }
      const error = await this.observePages(wrap, gen);
      if (gen === this.renderGen) this.loaded(error);
    } catch (e) {
      if (gen === this.renderGen && !this.isCancelled(e)) this.loaded(e);
    }
  };

  private observePages = (wrap: HTMLDivElement, gen: number) =>
    new Promise<any>((resolve) => {
      this.onIdle = resolve;
      if (typeof IntersectionObserver === "undefined") {
        this.slots.forEach((_, n) => this.visible.add(n));
        this.pump(gen);
        return;
      }
      // The wrapper is the root when it scrolls itself; otherwise the viewport.
      const root = wrap.scrollHeight > wrap.clientHeight ? wrap : null;
      const observer = new IntersectionObserver(
        (entries) => {
          if (gen !== this.renderGen) return;
          entries.forEach((e) => {
            const n = Number((e.target as HTMLElement).dataset.page);
            if (e.isIntersecting) {
              this.visible.add(n);
            } else {
              if (this.visible.delete(n) && this.pendingScroll?.page === n) {
                this.pendingScroll = undefined;
              }
              this.failed.delete(n); // retried when it comes back
              this.evict(n);
            }
          });
          this.pump(gen);
        },
        { root, rootMargin: RENDER_MARGIN },
      );
      this.observer = observer;
      this.slots.forEach((div) => observer.observe(div));
    });

  // Starts renders for visible pages, at most MAX_CONCURRENT_RENDERS at once.
  // In page order: a page above grows (reflow) before the ones below it are
  // painted, so a scroll to a match lands where it should.
  private pump = (gen: number) => {
    const queue = Array.from(this.visible)
      .filter(
        (n) => !this.pages.has(n) && !this.active.has(n) && !this.failed.has(n),
      )
      .sort((a, b) => a - b);
    while (this.active.size < MAX_CONCURRENT_RENDERS && queue.length) {
      const n = queue.shift() as number;
      this.active.add(n);
      this.renderPdf(n, gen)
        .catch((e) => {
          if (gen !== this.renderGen || this.isCancelled(e)) return;
          if (this.onIdle) this.pageError = this.pageError || e; // -> onLoaded
          else this.warnOnce(`page ${n}`, "page", n, "failed to render:", e);
        })
        .then(() => {
          if (gen !== this.renderGen) return;
          this.active.delete(n);
          // A page that did not render is not retried in a loop.
          if (!this.pages.has(n) && this.visible.has(n)) this.failed.add(n);
          this.pump(gen);
        });
    }
    if (!this.active.size && this.onIdle) {
      this.onIdle(this.pageError);
      this.onIdle = undefined;
    }
  };

  private renderPdf = async (page: number, gen: number) => {
    const pdf = this.pdf;
    const div = this.slots.get(page);
    if (!pdf || !div) return;
    const pagePdf = await pdf.getPage(page);
    if (gen !== this.renderGen || !this.visible.has(page)) return;
    const { keywords = [], pageSearch, replaceTexts = [] } = this.props;
    const needText =
      this.props.allowHtml ||
      replaceTexts.length > 0 ||
      (keywords.length > 0 && (!pageSearch || pageSearch === page));
    // Fetched alongside the render, and only when something uses it.
    const text = needText ? this.getText(pagePdf, page) : undefined;
    // Only a page with replacements reads its pixels back (colorsAt).
    const readsBack =
      text && replaceTexts.length
        ? await text.then(
          (tc) =>
            this.planReplacements(
              this.buildIndex(tc.items, this.props.specialWordRemoves || []),
            ).length > 0,
          () => false,
        )
      : false;
    if (gen !== this.renderGen || !this.visible.has(page)) return;
    const start = Date.now();
    const { scale = 1, allowHtml } = this.props;
    const vp1 = pagePdf.getViewport({ scale: 1 });
    const dpr = window.devicePixelRatio || 1;
    const wanted = Math.max(scale, (this.renderedWidth / vp1.width) * dpr);
    const rasterScale = Math.min(
      wanted,
      Math.sqrt(MAX_CANVAS_PIXELS / (vp1.width * vp1.height)),
    );
    const viewport = pagePdf.getViewport({ scale: rasterScale });
    div.style.aspectRatio = `${vp1.width} / ${vp1.height}`;

    const base = document.createElement("canvas");
    const hl = document.createElement("canvas"); // highlights live here
    const found = document.createElement("canvas");
    [base, hl, found].forEach((c) => {
      // Overlays get their width (and memory) only once they draw something.
      c.width = c === base ? Math.floor(viewport.width) : 0;
      c.height = Math.floor(viewport.height);
      c.style.display = "block";
      c.style.width = "100%";
    });
    [hl, found].forEach((c) => {
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

    // colorsAt reads replaced regions back: keep that canvas in CPU memory.
    const ctx = base.getContext("2d", { willReadFrequently: readsBack });
    if (!ctx) {
      [base, hl, found].forEach((c) => {
        c.width = 0;
        c.height = 0;
        c.remove();
      });
      throw new Error("no 2D canvas context (canvas memory limit?)");
    }
    const entry: PageEntry = {
      pagePdf,
      div,
      base,
      hl,
      found,
      viewport,
      vp1,
      colors: new Map(),
    };
    this.pages.set(page, entry);
    entry.task = pagePdf.render({ canvasContext: ctx, viewport });
    await Promise.all([entry.task.promise, text]);
    // Once rendered, pdf.js has loaded the PDF's own fonts, so measured text
    // (reflowed paragraphs, highlight offsets) matches the page.
    entry.ready = true;
    this.log?.info(this.tag, "page", page, "rendered", {
      ms: Date.now() - start,
      canvas: `${base.width}x${base.height}`,
      capped: rasterScale < wanted,
    });
    await Promise.all([
      allowHtml ? this.appendTextToCanvas(entry, page) : undefined,
      this.paintPage(page, this.paintGen),
    ]);
  };

  private getText = (pagePdf: any, page: number): Promise<TextContent> => {
    let p = this.textCache.get(page);
    if (!p) {
      const created: Promise<TextContent> = pagePdf.getTextContent();
      this.textCache.set(page, created);
      created.catch(() => {
        if (this.textCache.get(page) === created) this.textCache.delete(page);
      });
      p = created;
    }
    return p;
  };

  private repaintHighlights = () => {
    const paint = ++this.paintGen;
    this.pages.forEach((_, page) => {
      this.paintPage(page, paint).catch((e) => this.fail(`paint ${page}`, e, page));
    });
  };

  private paintPage = async (page: number, paint: number) => {
    const entry = this.pages.get(page);
    const ctx = entry?.hl.getContext("2d");
    const foundCtx = entry?.found.getContext("2d");
    if (!entry || !ctx || !foundCtx) return;
    const {
      keywords = [],
      pageSearch,
      replaceTexts = [],
      colorHighlight,
      isBorderHighlight,
    } = this.props;
    // The hl overlay (replacements, reflow) does not depend on keywords.
    // mark() sizes borders from the canvas' CSS width: part of what hl shows.
    const px = !isBorderHighlight
      ? 0
      : entry.hl.clientWidth
        ? entry.base.width / entry.hl.clientWidth
        : window.devicePixelRatio || 1;
    const hlKey = `${this.textGen}|${colorHighlight}|${px}`;
    const keepHl = !!replaceTexts.length && entry.hlKey === hlKey;
    if (!keepHl) {
      entry.hlKey = undefined;
      ctx.clearRect(0, 0, entry.hl.width, entry.hl.height);
    }
    foundCtx.clearRect(0, 0, entry.found.width, entry.found.height);
    const search = !!keywords.length && (!pageSearch || pageSearch === page);
    if (!search && !replaceTexts.length) {
      this.fitHeight(entry, 0);
      this.own(entry, entry.hl, false);
      this.own(entry, entry.found, false);
      return;
    }
    const tc = await this.getText(entry.pagePdf, page);
    if (paint !== this.paintGen || this.pages.get(page) !== entry) return;
    const p = this.paintOf(entry, ctx, tc);
    const removes = this.props.specialWordRemoves || [];
    const laid = this.layoutOf(entry, p);
    const { items, reps, flows } = laid;
    const grow = flows.reduce((n, f) => n + f.grow, 0);
    const height = entry.hl.height;
    this.fitHeight(entry, Math.max(0, grow));
    const resized = this.own(entry, entry.hl, !!reps.length || !!flows.length);
    this.own(entry, entry.found, search);
    p.dyAt = (x: number, y: number) => this.shiftOf(flows, x, y);
    let replaced: number;
    if (keepHl && !resized && entry.hl.height === height) {
      replaced = reps.filter((part) => part === part.whole[0]).length;
    } else {
      if (flows.some((f) => f.grow)) this.shiftBelow(p, flows);
      // Replacements first, so highlights stay visible on top of them.
      replaced = this.drawReplacements(p, reps);
      flows.forEach((flow) => this.drawFlow(p, flow));
      if (entry.ready) entry.hlKey = hlKey;
    }
    let matches: Record<string, number> = {};
    if (search) {
      // Keywords match what is displayed, i.e. the text after replacement.
      const shown =
        laid.shown ||
        (laid.shown =
          !reps.length && !flows.length
            ? laid.original
            : this.buildIndex(items, removes, reps));
      matches = this.drawHighlights(p, shown, foundCtx);
      entry.lastPaint = { gen: paint, p, shown };
      this.finishScroll(entry, page, p, shown);
    }
    if (Object.keys(matches).length || replaced || flows.length) {
      this.log?.info(this.tag, "page", page, {
        matches,
        replaced,
        reflowed: flows.length,
        grownPx: Math.round(grow),
      });
    }
  };

  // An overlay canvas gets the page's width only while it has something to
  // show, so an empty one holds no memory. Resizing clears it.
  private own = (entry: PageEntry, c: HTMLCanvasElement, on: boolean) => {
    const w = on ? entry.base.width : 0;
    if (c.width === w) return false;
    c.width = w;
    return true;
  };

  private fitHeight = (entry: PageEntry, grow: number) => {
    const height = entry.base.height + Math.ceil(grow);
    if (entry.hl.height !== height) entry.hl.height = height;
    if (entry.found.height !== height) entry.found.height = height;
    entry.div.style.aspectRatio = `${entry.vp1.width} / ${(entry.vp1.height * height) / entry.base.height}`;
  };

  private shiftOf = (flows: Flow[], x: number, y: number) =>
    flows.reduce(
      (n, f) =>
        f.grow && (y >= f.end || (y >= f.bottom && x >= f.x0 && x <= f.x1))
          ? n + f.grow
          : n,
      0,
    );

  private shiftBelow = (p: Paint, flows: Flow[]) => {
    const { ctx, base } = p;
    const move = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      before: number,
      after: number,
    ) => {
      const left = Math.max(0, Math.floor(x0));
      const right = Math.min(base.width, Math.ceil(x1));
      const top = Math.max(0, Math.floor(y0));
      const bottom = Math.min(base.height, Math.ceil(y1));
      if (right <= left || bottom <= top) return;
      const { paper } = this.colorsAt(p, [
        { x: left, y: top, w: right - left, h: 4 },
      ]);
      const from = top + Math.min(before, after);
      ctx.fillStyle = paper;
      ctx.fillRect(left, from, right - left, ctx.canvas.height - from);
      ctx.drawImage(
        base,
        left,
        top,
        right - left,
        bottom - top,
        left,
        top + after,
        right - left,
        bottom - top,
      );
    };
    ctx.save();
    flows
      .filter((f) => f.grow)
      .sort((a, b) => a.bottom - b.bottom)
      .forEach((f) => {
        const mid = (Math.max(0, f.x0) + Math.min(base.width, f.x1)) / 2;
        if (f.end > f.bottom) {
          const after = this.shiftOf(flows, mid, f.bottom);
          move(f.x0, f.bottom, f.x1, f.end, after - f.grow, after);
        }
        if (f.end < base.height) {
          const after = this.shiftOf(flows, -1, f.end);
          move(0, f.end, base.width, base.height, after - f.grow, after);
        }
      });
    ctx.restore();
  };

  private paintOf = (
    entry: PageEntry,
    ctx: CanvasRenderingContext2D,
    tc: TextContent,
  ): Paint => ({
    ctx,
    tc,
    viewport: entry.viewport,
    pagePdf: entry.pagePdf,
    base: entry.base,
    colors: entry.colors,
    dyAt: () => 0,
    metrics: new Map(),
  });

  // What the page shows: the PDF's items plus replaceTexts. A replacement too
  // long for its place is flowed into its paragraph like typed text (those
  // paragraphs become new items); otherwise it is drawn in place.
  private layout = (p: Paint) => {
    const items: Item[] = p.tc.items;
    const original = this.buildIndex(
      items,
      this.props.specialWordRemoves || [],
    );
    const reps = this.planReplacements(original);
    const flows: Flow[] = [];
    const long = reps.filter((r) => r === r.line[0] && this.overflows(p, r));
    if (!long.length) return { items, reps, flows, original };
    const at = new Map<Contents, number>();
    items.forEach((item, i) => at.set(item, i));
    const segs = this.segments(p);
    const flowed = new Set<ReplaceSlice>();
    this.paragraphs(segs).forEach((para) => {
      const lo = para[0].first;
      const hi = para[para.length - 1].last;
      const inside = (r: ReplaceSlice) => {
        const i = at.get(r.item) as number;
        return i >= lo && i <= hi;
      };
      if (!long.some(inside)) return;
      const mine = reps.filter(inside);
      if (mine.some((r) => !r.whole.every(inside))) return; // match leaves it
      const flow = this.flow(p, para, mine, segs, at);
      if (!flow) return;
      flows.push(flow);
      mine.forEach((r) => flowed.add(r));
    });
    if (!flows.length) return { items, reps, flows, original };
    flows.forEach((f) => {
      f.offset = this.shiftOf(flows, f.cover[0].x + 1, f.top);
      f.items.forEach((item) => (item.dy = f.offset));
    });
    const shown: Item[] = [];
    let i = 0;
    flows
      .sort((a, b) => a.first - b.first)
      .forEach((flow) => {
        while (i < flow.first) shown.push(items[i++]);
        flow.items.forEach((item) => shown.push(item));
        i = flow.last + 1;
      });
    while (i < items.length) shown.push(items[i++]);
    return {
      items: shown,
      reps: reps.filter((r) => !flowed.has(r)),
      flows,
      original,
    };
  };

  // layout() depends on the text, replaceTexts and specialWordRemoves only,
  // not on keywords: kept per page once the PDF's fonts are loaded.
  private layoutOf = (entry: PageEntry, p: Paint): Laid => {
    const c = entry.laid;
    if (c && c.gen === this.textGen && c.tc === p.tc) return c;
    const laid: Laid = { ...this.layout(p), gen: this.textGen, tc: p.tc };
    if (entry.ready) entry.laid = laid;
    return laid;
  };

  private overflows = (p: Paint, lead: ReplaceSlice) => {
    // A replacement equal to the text it covers stays in place.
    const bare = (t: string) => t.replace(/\s+/g, "");
    const covered = lead.line.map((s) => s.item.str.slice(s.start, s.end));
    if (bare(lead.text) === bare(covered.join(""))) return false;
    const b = this.lineBox(p, lead.line);
    if (!lead.text) return b.w > b.h * 0.5;
    p.ctx.save();
    const k = this.useFont(p.ctx, b, lead.text);
    const w = p.ctx.measureText(lead.text).width;
    p.ctx.restore();
    return k < 0.99 || b.w - w > b.h * 0.5;
  };

  private segments = (p: Paint): Segment[] => {
    const { Util } = this.lib;
    const out: Segment[] = [];
    p.tc.items.forEach((item, i) => {
      const cur = out[out.length - 1];
      if (!item.str || !item.str.trim()) {
        if (cur) cur.last = i;
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
      const tx: number[] = Util.transform(p.viewport.transform, item.transform);
      const flat =
        Math.abs(tx[1]) < 1e-6 &&
        Math.abs(tx[2]) < 1e-6 &&
        tx[0] > 0 &&
        tx[3] < 0;
      const x = tx[4];
      const right = x + item.width * p.viewport.scale;
      const size = Math.abs(tx[3]);
      if (cur && !cur.text) {
        Object.assign(cur, {
          last: i,
          text: true,
          flat,
          x,
          right,
          y: tx[5],
          size,
        });
      } else if (
        cur &&
        cur.flat &&
        flat &&
        Math.abs(tx[5] - cur.y) < cur.size / 2 &&
        x - cur.right < cur.size * 2
      ) {
        cur.last = i;
        cur.right = Math.max(cur.right, right);
      } else {
        out.push({
          first: i,
          last: i,
          text: true,
          flat,
          x,
          right,
          y: tx[5],
          size,
        });
      }
    });
    return out;
  };

  // Consecutive segments that read as one paragraph: same size, steady line
  // spacing, aligned left edges and no short line before the last one.
  private paragraphs = (segs: Segment[]): Segment[][] => {
    const out: Segment[][] = [];
    let para: Segment[] = [];
    let step = 0;
    segs.forEach((s) => {
      const prev = para[para.length - 1];
      const d = prev ? s.y - prev.y : 0;
      const widest = para.reduce((m, o) => Math.max(m, o.right), s.right);
      const joins =
        !!prev &&
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
      } else {
        if (para.length) out.push(para);
        para = [s];
        step = 0;
      }
    });
    if (para.length) out.push(para);
    return out;
  };

  // Lays a paragraph out again from its first replaced line, like typed text:
  // words wrap at the column edge and justified text stays justified. Lines
  // beyond the paragraph's own are added below it and push the page down.
  private flow = (
    p: Paint,
    para: Segment[],
    mine: ReplaceSlice[],
    segs: Segment[],
    at: Map<Contents, number>,
  ): Flow | undefined => {
    const { ctx, tc } = p;
    const items = tc.items;
    const size = para[0].size;
    const left = para.reduce((m, s) => Math.min(m, s.x), Infinity);
    // The column's right edge, also judged from other lines of the column.
    const columnRight = segs
      .filter(
        (s) =>
          s.flat &&
          s.text &&
          Math.abs(s.x - left) <= size * 3 &&
          Math.abs(s.size - size) <= size * 0.1,
      )
      .reduce((m, s) => Math.max(m, s.right), 0);
    const beside = segs.filter(
      (s) =>
        !para.includes(s) &&
        s.text &&
        s.y > para[0].y - size &&
        s.y < para[para.length - 1].y + size,
    );
    const right = beside
      .filter((s) => s.x > left + size)
      .reduce((m, s) => Math.min(m, s.x - size * 0.5), columnRight);
    const justified =
      para.length > 1 &&
      para.slice(0, -1).every((s) => s.right >= right - s.size);
    const holds = (s: Segment) =>
      mine.some((r) => {
        const i = at.get(r.item) as number;
        return i >= s.first && i <= s.last;
      });
    const lines = para.slice(para.findIndex(holds));

    // The text from the first replaced line on, with the replacements in place.
    interface Part {
      text: string;
      item: Contents;
      rule?: ReplaceText;
      w: number;
    }
    const pieces = new Map<Contents, ReplaceSlice[]>();
    mine.forEach((r) =>
      pieces.set(r.item, (pieces.get(r.item) || []).concat(r)),
    );
    const parts: Part[] = [];
    const add = (text: string, item: Contents, rule?: ReplaceText) =>
      parts.push({ text, item, rule, w: 0 });
    lines.forEach((s) => {
      for (let i = s.first; i <= s.last; i++) {
        const item = items[i];
        let pos = 0;
        (pieces.get(item) || [])
          .sort((a, b) => a.start - b.start)
          .forEach((r) => {
            add(item.str.slice(pos, r.start), item);
            if (r === r.whole[0]) add(r.rule.replace || "", item, r.rule);
            pos = r.end;
          });
        add(item.str.slice(pos), item);
      }
      add(" ", items[s.last]); // a line break reads as a space
    });

    // Words, each part measured in its source item's font and spacing.
    const boxes = new Map<Contents, Box>();
    const boxOf = (item: Contents) => {
      let b = boxes.get(item);
      if (!b)
        boxes.set(item, (b = this.sliceBox(p, { item, start: 0, end: 0 })));
      return b;
    };
    const words: Part[][] = [];
    let word: Part[] | undefined;
    parts.forEach((part) => {
      part.text.split(/(\s+)/).forEach((t) => {
        if (!t) return;
        if (/^\s/.test(t)) {
          word = undefined;
          return;
        }
        if (!word) words.push((word = []));
        const b = boxOf(part.item);
        ctx.font = b.font;
        word.push({
          ...part,
          text: t,
          w: ctx.measureText(t).width + b.track * t.length,
        });
      });
    });
    const widthOf = (w: Part[]) => w.reduce((n, part) => n + part.w, 0);
    let space = 0;
    if (words.length) {
      ctx.font = boxOf(words[0][0].item).font;
      space = ctx.measureText(" ").width;
    }

    const column = segs.filter(
      (s) =>
        s.flat &&
        s.text &&
        Math.abs(s.size - size) <= size * 0.1 &&
        s.right >= right - size * 3,
    );
    const margin = column.reduce(
      (m, s) => Math.min(m, s.x),
      lines[lines.length - 1].x,
    );
    const nextX =
      lines.length > 1
        ? lines[lines.length - 1].x
        : Math.min(margin, lines[0].x);
    const step = this.lineStep(segs, size, para);
    const last = lines[lines.length - 1];
    const lineAt = (n: number) =>
      n < lines.length
        ? lines[n]
        : { x: nextX, y: last.y + (n - lines.length + 1) * step };

    const fits = words.flatMap((w) =>
      this.splitWord(p, w, right - nextX, boxOf),
    );

    const rows: Part[][][] = [[]];
    let x = lines[0].x;
    for (const w of fits) {
      const wide = widthOf(w);
      let row = rows[rows.length - 1];
      if (row.length && x + space + wide > right) {
        rows.push((row = []));
        x = lineAt(rows.length - 1).x;
      } else if (row.length) {
        x += space;
      }
      row.push(w);
      x += wide;
    }

    const out: Item[] = [];
    const make = (part: Part, x: number, y: number): Item => {
      const [px, py] = p.viewport.convertToPdfPoint(x, y);
      const t = part.item.transform;
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
    const centerOf = (s: { x: number; right: number }) => (s.x + s.right) / 2;
    const above = segs
      .filter(
        (s) =>
          s.flat &&
          s.text &&
          !para.includes(s) &&
          s.y < lines[0].y - size * 0.5 &&
          s.right > lines[0].x &&
          s.x < lines[0].right,
      )
      .reduce<
        Segment | undefined
      >((m, s) => (!m || s.y > m.y ? s : m), undefined);
    const centered =
      lines.length > 1
        ? lines.every(
            (l) => Math.abs(centerOf(l) - centerOf(lines[0])) < size * 0.5,
          ) && lines.some((l) => Math.abs(l.x - lines[0].x) > size * 0.5)
        : !!above &&
          Math.abs(centerOf(above) - centerOf(lines[0])) < size * 0.75 &&
          Math.abs(above.x - lines[0].x) > size * 0.75;
    const middle = centerOf(lines[0]);
    rows.forEach((row, n) => {
      const line = lineAt(n);
      const used =
        row.reduce((m, w) => m + widthOf(w), 0) + space * (row.length - 1);
      const gap =
        !centered && justified && n < rows.length - 1 && row.length > 1
          ? space + (right - line.x - used) / (row.length - 1)
          : space;
      let cx = centered ? middle - used / 2 : line.x;
      row.forEach((w, j) => {
        w.forEach((part) => {
          out.push(make(part, cx, line.y));
          cx += part.w;
        });
        if (j === row.length - 1) return;
        // Spaces are not drawn; they keep copied text readable.
        out.push(
          make({ text: " ", item: w[w.length - 1].item, w: gap }, cx, line.y),
        );
        cx += gap;
      });
    });

    const metricsOf = (s: Segment) => {
      const first = items
        .slice(s.first, s.last + 1)
        .find((it) => !!it.str && !!it.str.trim()) as Contents;
      const style = tc.styles[first.fontName];
      return {
        asc: style && style.ascent > 0 ? style.ascent : 0.8,
        desc: style && style.descent < 0 ? style.descent : -0.2,
      };
    };
    const cover = lines.map((s) => {
      const { asc, desc } = metricsOf(s);
      const pad = s.size * 0.05;
      return {
        x: s.x - pad,
        y: s.y - asc * s.size - pad,
        w: right - s.x + 2 * pad,
        h: (asc - desc) * s.size + 2 * pad,
      };
    });
    const top = cover[0].y;
    const bottom = cover[cover.length - 1].y + cover[cover.length - 1].h;
    const extra = rows.length - lines.length;
    const grow = extra > 0 || !beside.length ? extra * step : 0;
    const x0 = beside.length ? Math.min(left, nextX) - size * 0.3 : -Infinity;
    const x1 = beside.length ? right + size * 0.3 : Infinity;
    const end = beside.length
      ? segs
          .filter(
            (s) =>
              s.text &&
              s.y > last.y + size * 0.5 &&
              ((s.x < x0 && s.right > x0 + size) ||
                (s.x < x1 - size && s.right > x1)),
          )
          .reduce(
            (m, s) => Math.min(m, s.y - metricsOf(s).asc * s.size - size * 0.2),
            Infinity,
          )
      : bottom;
    return {
      first: lines[0].first,
      last: last.last,
      items: out,
      cover: grow < 0 ? cover.slice(0, rows.length) : cover,
      background: mine[0].rule.background,
      top,
      bottom,
      end,
      x0,
      x1,
      grow,
      offset: 0,
    };
  };

  private lineStep = (segs: Segment[], size: number, para: Segment[]) => {
    const own =
      para.length > 1
        ? (para[para.length - 1].y - para[0].y) / (para.length - 1)
        : 0;
    if (own) return own;
    const gaps: number[] = [];
    for (let i = 1; i < segs.length; i++) {
      const a = segs[i - 1];
      const b = segs[i];
      if (!a.text || !b.text || Math.abs(a.size - size) > size * 0.1) continue;
      if (Math.abs(b.size - size) > size * 0.1) continue;
      const d = b.y - a.y;
      if (d > size * 0.9 && d < size * 1.6) gaps.push(d);
    }
    if (!gaps.length) return size * 1.2;
    gaps.sort((a, b) => a - b);
    return gaps[Math.floor(gaps.length / 2)];
  };

  private splitWord = <T extends { text: string; item: Contents; w: number }>(
    p: Paint,
    word: T[],
    max: number,
    boxOf: (item: Contents) => Box,
  ): T[][] => {
    if (word.reduce((n, part) => n + part.w, 0) <= max) return [word];
    const out: T[][] = [];
    let cur: T[] = [];
    let used = 0;
    word.forEach((part) => {
      const b = boxOf(part.item);
      p.ctx.font = b.font;
      let chunk = "";
      let chunkW = 0;
      Array.from(part.text).forEach((ch) => {
        const w = p.ctx.measureText(ch).width + b.track;
        if (used + chunkW + w > max && (cur.length || chunk)) {
          if (chunk) cur.push({ ...part, text: chunk, w: chunkW });
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
        cur.push({ ...part, text: chunk, w: chunkW });
        used += chunkW;
      }
    });
    if (cur.length) out.push(cur);
    return out;
  };

  private drawFlow = (p: Paint, flow: Flow) => {
    const { ctx } = p;
    const { paper, ink } = this.colorsAt(p, flow.cover);
    ctx.save();
    ctx.translate(0, flow.offset);
    ctx.fillStyle = flow.background || paper;
    flow.cover.forEach((r) => ctx.fillRect(r.x, r.y, r.w, r.h));
    ctx.textBaseline = "alphabetic";
    const marks: Slice[][] = [];
    let run: Slice[] | undefined;
    flow.items.forEach((item) => {
      if (!item.str.trim()) return;
      const slice = { item, start: 0, end: item.str.length };
      const b = this.sliceBox(p, slice); // also sets ctx.font
      ctx.save();
      if ("letterSpacing" in ctx) (ctx as any).letterSpacing = `${b.track}px`;
      ctx.fillStyle = (item.rule && item.rule.color) || ink;
      ctx.fillText(item.str, b.tx[4], b.tx[5]);
      ctx.restore();
      if (!item.rule || item.rule.highlight === false) {
        run = undefined;
      } else {
        if (!run) marks.push((run = []));
        run.push(slice);
      }
    });
    // Replacement text is marked like a keyword match, one band per line.
    marks.forEach((m) =>
      this.lines(m).forEach((line) => {
        const b = this.mergeBoxes(line.map((s) => this.sliceBox(p, s)));
        ctx.save();
        ctx.translate(b.tx[4], b.tx[5]);
        this.markReplaced(ctx, b.x0, b.y, b.w, b.h);
        ctx.restore();
      }),
    );
    ctx.restore();
  };

  // Paper and ink of a region of the rendered page, so drawn text blends in:
  // the most common color is the paper, the one farthest from it the ink.
  private colorsAt = (p: Paint, rects: Rect[]): Colors => {
    const x0 = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.x))));
    const y0 = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.y))));
    const x1 = Math.min(
      p.base.width,
      Math.ceil(Math.max(...rects.map((r) => r.x + r.w))),
    );
    const y1 = Math.min(
      p.base.height,
      Math.ceil(Math.max(...rects.map((r) => r.y + r.h))),
    );
    const key = [x0, y0, x1, y1].join();
    let colors = p.colors.get(key);
    if (colors) return colors;
    colors = { paper: "#fff", ink: "#000" };
    try {
      const ctx = p.base.getContext("2d");
      if (ctx && x1 > x0 && y1 > y0) {
        const { data } = ctx.getImageData(x0, y0, x1 - x0, y1 - y0);
        const counts = new Map<number, number>();
        let paper = 2 ** 24 - 1;
        let most = 0;
        // Runs of one color (mostly paper) are counted with one Map update.
        let run = -1;
        let len = 0;
        const flush = () => {
          if (!len) return;
          const n = (counts.get(run) || 0) + len;
          counts.set(run, n);
          if (n > most) {
            most = n;
            paper = run;
          }
        };
        for (let i = 0; i < data.length; i += 8) {
          const c = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
          if (c === run) {
            len++;
            continue;
          }
          flush();
          run = c;
          len = 1;
        }
        flush();
        const diff = (c: number) =>
          [16, 8, 0].reduce(
            (d, s) => d + Math.abs(((c >> s) & 255) - ((paper >> s) & 255)),
            0,
          );
        let ink = paper;
        counts.forEach((_, c) => {
          if (diff(c) > diff(ink)) ink = c;
        });
        const css = (c: number) => `#${(c | 0x1000000).toString(16).slice(1)}`;
        colors = { paper: css(paper), ink: css(ink) };
      }
    } catch {
      // keep the defaults
    }
    p.colors.set(key, colors);
    return colors;
  };

  // Axis-aligned canvas rect around a (possibly rotated) box.
  private rectOf = (b: Box): Rect => {
    const cos = Math.cos(b.angle);
    const sin = Math.sin(b.angle);
    const xs: number[] = [];
    const ys: number[] = [];
    [b.x0, b.x0 + b.w].forEach((u) =>
      [b.y, b.y + b.h].forEach((v) => {
        xs.push(b.tx[4] + u * cos - v * sin);
        ys.push(b.tx[5] + u * sin + v * cos);
      }),
    );
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
  };

  // The font pdf.js drew the item with: the PDF's embedded font (a FontFace
  // pdf.js registers while rendering) in its weight and style, then the
  // generic fallback.
  private fontOf = (p: Paint, item: Contents, size: number) => {
    const style = p.tc.styles[item.fontName];
    const fallback = (style && style.fontFamily) || "sans-serif";
    const objs = p.pagePdf.commonObjs;
    const font =
      objs && objs.has(item.fontName) ? objs.get(item.fontName) : undefined;
    if (!font) return `${size}px "${item.fontName}", ${fallback}`;
    const name = String(font.name || "");
    const weight = font.black
      ? "900"
      : font.bold || /bold/i.test(name)
        ? "bold"
        : "normal";
    const italic =
      font.italic || /italic|oblique/i.test(name) ? "italic" : "normal";
    const system = systemFamilyOf(name);
    const generic =
      system && SERIF_FAMILY.test(system)
        ? "serif"
        : font.fallbackName || fallback;
    const family =
      (font.systemFontInfo && font.systemFontInfo.css) ||
      (system ? `"${system}", ${generic}` : `"${font.loadedName}", ${generic}`);
    return `${italic} ${weight} ${size}px ${family}`;
  };

  // Box of item.str[start, end). Browser widths are scaled onto the exact PDF
  // advance (item.width); `track` is the extra spacing per char the PDF adds.
  // Per item, once per paint: its canvas transform, font and PDF advance.
  private metricsOf = (p: Paint, item: Contents): ItemMetrics => {
    let m = p.metrics.get(item);
    if (m) return m;
    const { Util } = this.lib;
    const style = p.tc.styles[item.fontName];
    const tx: number[] = Util.transform(p.viewport.transform, item.transform);
    const fontH = Math.hypot(tx[2], tx[3]);
    const font = this.fontOf(p, item, fontH);
    p.ctx.font = font;
    const target = item.width * p.viewport.scale;
    const raw = p.ctx.measureText(item.str).width;
    const full = raw || 1;
    m = {
      tx,
      angle: Math.atan2(tx[1], tx[0]),
      fontH,
      asc:
        style && Number.isFinite(style.ascent) && style.ascent > 0
          ? style.ascent
          : 0.8,
      desc:
        style && Number.isFinite(style.descent) && style.descent < 0
          ? style.descent
          : -0.2,
      font,
      raw,
      k: target / full,
      track: (target - full) / Math.max(1, item.str.length),
    };
    p.metrics.set(item, m);
    return m;
  };

  // Box of item.str[start, end). Browser widths are scaled onto the exact PDF
  // advance (item.width); `track` is the extra spacing per char the PDF adds.
  private sliceBox = (p: Paint, { item, start, end }: Slice): Box => {
    const m = this.metricsOf(p, item);
    p.ctx.font = m.font;
    const x0 = start > 0 ? p.ctx.measureText(item.str.slice(0, start)).width * m.k : 0;
    const x1 =
      end >= item.str.length
        ? m.raw * m.k
        : p.ctx.measureText(item.str.slice(0, end)).width * m.k;
    return {
      tx: m.tx,
      angle: m.angle,
      x0,
      w: x1 - x0,
      y: -m.asc * m.fontH,
      h: (m.asc - m.desc) * m.fontH,
      font: m.font,
      track: m.track,
    };
  };

  // One box spanning boxes of the same line, in the first box's frame, so a
  // phrase gets one continuous band across the gaps between words.
  private mergeBoxes = (boxes: Box[]): Box => {
    const f = boxes[0];
    const cos = Math.cos(f.angle);
    const sin = Math.sin(f.angle);
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    boxes.forEach((b) => {
      const dx = b.tx[4] - f.tx[4];
      const dy = b.tx[5] - f.tx[5];
      const u = dx * cos + dy * sin;
      const v = dy * cos - dx * sin;
      x0 = Math.min(x0, u + b.x0);
      x1 = Math.max(x1, u + b.x0 + b.w);
      y0 = Math.min(y0, v + b.y);
      y1 = Math.max(y1, v + b.y + b.h);
    });
    return { ...f, x0, w: x1 - x0, y: y0, h: y1 - y0 };
  };

  private lineBox = (p: Paint, line: Slice[]) =>
    this.mergeBoxes(line.map((s) => this.sliceBox(p, s)));

  // Consecutive slices whose items share a baseline form one visual line.
  private lines = <T extends Slice>(slices: T[]): T[][] => {
    const out: T[][] = [];
    slices.forEach((s) => {
      const line = out[out.length - 1];
      if (line && this.sameLine(line[line.length - 1].item, s.item)) {
        line.push(s);
      } else {
        out.push([s]);
      }
    });
    return out;
  };

  private sameLine = (a: Contents, b: Contents) => {
    if (a === b) return true;
    const ta = a.transform;
    const tb = b.transform;
    const angle = Math.atan2(ta[1], ta[0]);
    if (Math.abs(angle - Math.atan2(tb[1], tb[0])) > 0.01) return false;
    const size = Math.hypot(ta[2], ta[3]) || 1;
    const off =
      (tb[5] - ta[5]) * Math.cos(angle) - (tb[4] - ta[4]) * Math.sin(angle);
    return Math.abs(off) < size / 2;
  };

  // Sets the box's font and the PDF's spacing for drawing `text`; returns the
  // scale (<= 1) that fits it into the box.
  private useFont = (ctx: CanvasRenderingContext2D, b: Box, text: string) => {
    ctx.font = b.font;
    if ("letterSpacing" in ctx) (ctx as any).letterSpacing = `${b.track}px`;
    return Math.min(1, b.w / (ctx.measureText(text).width || 1));
  };

  // Box of part.text[start, end) as drawReplacements draws it.
  private replacedBox = (
    p: Paint,
    part: ReplaceSlice,
    start: number,
    end: number,
  ): Box => {
    const { ctx } = p;
    const b = this.lineBox(p, part.line);
    ctx.save();
    const k = this.useFont(ctx, b, part.text);
    const x0 = b.x0 + ctx.measureText(part.text.slice(0, start)).width * k;
    const x1 = b.x0 + ctx.measureText(part.text.slice(0, end)).width * k;
    ctx.restore();
    return { ...b, x0, w: x1 - x0 };
  };

  // Returns how many matches were replaced in place.
  private drawReplacements = (p: Paint, parts: ReplaceSlice[]) => {
    const { ctx } = p;
    parts.forEach((part) => {
      if (part !== part.line[0]) return; // drawn once per visual line
      ctx.save();
      const b = this.lineBox(p, part.line);
      const pad = b.h * 0.05; // hide anti-aliased edges of the original glyphs
      const { paper, ink } = this.colorsAt(p, [this.rectOf(b)]);
      ctx.translate(b.tx[4], b.tx[5] + p.dyAt(b.tx[4], b.tx[5]));
      ctx.rotate(b.angle);
      ctx.fillStyle = part.rule.background || paper;
      ctx.fillRect(b.x0 - pad, b.y - pad, b.w + 2 * pad, b.h + 2 * pad);
      if (part.text && b.w > 0) {
        const k = this.useFont(ctx, b, part.text);
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
          this.markReplaced(
            ctx,
            b.x0,
            b.y,
            ctx.measureText(part.text).width * k,
            b.h,
          );
        }
      }
      ctx.restore();
    });
    return parts.filter((part) => part === part.whole[0]).length;
  };

  // A solid fill (drawn multiplied), or a border with isBorderHighlight.
  private mark = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
  ) => {
    ctx.save();
    if (this.props.isBorderHighlight) {
      // 2 screen px, whatever the canvas resolution.
      const { canvas } = ctx;
      const px = canvas.clientWidth
        ? canvas.width / canvas.clientWidth
        : window.devicePixelRatio || 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * px;
      ctx.strokeRect(x, y, w, h);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  };

  private keywordColor = () =>
    this.props.colorKeyword || this.props.colorHighlight || "yellow";

  private replaceColor = () => this.props.colorHighlight || "yellow";

  // Solid and multiplied onto the replaced text, so its ink stays dark.
  private markReplaced = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    ctx.save();
    if (!this.props.isBorderHighlight) ctx.globalCompositeOperation = "multiply";
    this.mark(ctx, x, y, w, h, this.replaceColor());
    ctx.restore();
  };

  // Every occurrence of every replaceTexts rule as per-item pieces, with the
  // replacement text spread over the visual lines the match spans. Earlier
  // rules win where matches overlap.
  private planReplacements = (index: PageIndex): ReplaceSlice[] => {
    const { replaceTexts = [], specialWordRemoves = [] } = this.props;
    const out: ReplaceSlice[] = [];
    const taken = new Uint8Array(index.text.length);
    const size = (line: Slice[]) =>
      line.reduce((n, s) => n + s.end - s.start, 0);
    replaceTexts.forEach((rule) => {
      const needle = this.normalizeNeedle(
        rule.search,
        specialWordRemoves,
        Infinity,
      );
      const text = rule.replace || "";
      this.findAll(index, needle).forEach(([from, to]) => {
        for (let i = from; i < to; i++) {
          if (taken[i]) return;
        }
        taken.fill(1, from, to);
        const lines = this.lines(this.slices(index, from, to));
        const total = lines.reduce((n, l) => n + size(l), 0);
        const whole: ReplaceSlice[] = [];
        let acc = 0;
        let pos = 0;
        lines.forEach((l, i) => {
          acc += size(l);
          const cut =
            i === lines.length - 1
              ? text.length
              : this.cutAt(text, pos, Math.round((text.length * acc) / total));
          const chunk = text.slice(pos, cut).trim();
          pos = cut;
          const line: ReplaceSlice[] = [];
          l.forEach((s, j) => {
            const piece: ReplaceSlice = {
              item: s.item,
              start: s.start,
              end: s.end,
              text: j ? "" : chunk,
              rule,
              line,
              whole,
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
  private cutAt = (text: string, from: number, target: number) => {
    for (let d = 0; d <= 10; d++) {
      const back = target - d;
      const fwd = target + d;
      if (back > from && back <= text.length && /\s/.test(text[back - 1])) {
        return back;
      }
      if (fwd > from && fwd < text.length && /\s/.test(text[fwd])) return fwd;
    }
    return Math.max(from, Math.min(text.length, target));
  };

  private needles = () => {
    const {
      keywords = [],
      specialWordRemoves = [],
      maxKeywordLength = 2000,
    } = this.props;
    return Array.from(
      new Set(
        keywords.map((k) =>
          this.normalizeNeedle(k, specialWordRemoves, maxKeywordLength),
        ),
      ),
    ).filter(Boolean);
  };

  private firstMatch = (index: PageIndex) => {
    let first: [number, number] | undefined;
    this.needles().forEach((needle) => {
      const [m] = this.findAll(index, needle);
      if (m && (!first || m[0] < first[0])) first = m;
    });
    return first;
  };

  // What firstMatch reads (the lowercased shown text), kept per page so a
  // keystroke does not rebuild every page's index.
  private shownText = (page: number, tc: TextContent) => {
    let lower = this.searchText.get(page);
    if (lower === undefined) {
      lower = this.shownIndex(tc).lower;
      this.searchText.set(page, lower);
    }
    return { lower } as PageIndex;
  };

  private shownIndex = (tc: TextContent) => {
    const removes = this.props.specialWordRemoves || [];
    const original = this.buildIndex(tc.items, removes);
    const reps = this.planReplacements(original);
    return reps.length ? this.buildIndex(tc.items, removes, reps) : original;
  };

  private hitBox = (
    p: Paint,
    index: PageIndex,
    s: Slice & { rep: number },
  ): Box => {
    const b =
      s.rep < 0
        ? this.sliceBox(p, s)
        : this.replacedBox(p, index.reps[s.rep], s.start, s.end);
    const dy = (s.item as Item).dy ?? p.dyAt(b.tx[4], b.tx[5]);
    const tx = b.tx.slice();
    tx[5] += dy;
    return { ...b, tx };
  };

  private matchBox = (
    p: Paint,
    index: PageIndex,
    line: (Slice & { rep: number })[],
  ): Box => this.mergeBoxes(line.map((s) => this.hitBox(p, index, s)));

  // Replaced text that carries its own highlight mark.
  private onMarkedReplacement = (
    index: PageIndex,
    s: Slice & { rep: number },
  ) => {
    const rule = s.rep >= 0 ? index.reps[s.rep].rule : (s.item as Item).rule;
    return !!rule && rule.highlight !== false;
  };

  // Jumps near the first match, then refines onto its highlight once the page
  // is painted. Resolves false when nothing matches or the pages are still
  // being laid out (the search then runs after layout).
  scrollToMatch = async (): Promise<boolean> => {
    const req = ++this.scrollReq;
    this.pendingScroll = undefined;
    await undefined; // let a state update made just before render first
    if (req !== this.scrollReq || !this.needles().length) return false;
    const pdf = this.pdf;
    if (!pdf || !this.slots.size) {
      this.scrollOnLayout = true;
      return false;
    }
    const { pageSearch } = this.props;
    const nums = Array.from(this.slots.keys()).filter(
      (n) => !pageSearch || n === pageSearch,
    );
    try {
      let slice = Date.now();
      for (const n of nums) {
        // Cached text resolves as microtasks: yield so typing stays smooth.
        if (Date.now() - slice > 8) {
          await new Promise((r) => setTimeout(r));
          slice = Date.now();
        }
        const pagePdf = await pdf.getPage(n);
        const tc = await this.getText(pagePdf, n);
        if (req !== this.scrollReq) return false;
        const match = this.firstMatch(this.shownText(n, tc));
        if (!match) continue;
        const index = this.shownIndex(tc);
        this.pendingScroll = { page: n, req };
        const entry = this.pages.get(n);
        const last = entry && entry.lastPaint;
        if (entry && entry.ready && last && last.gen === this.paintGen) {
          this.finishScroll(entry, n, last.p, last.shown);
        } else if (entry && entry.ready) {
          this.paintPage(n, this.paintGen).catch((e) =>
            this.fail(`paint ${n}`, e, n),
          );
        } else {
          this.scrollMarker(n, this.roughRect(pagePdf, index, match));
        }
        this.log?.info(this.tag, "scroll to page", n, entry ? "" : "(rendering)");
        return true;
      }
      this.log?.info(this.tag, "no match");
    } catch (e) {
      if (this.pdf === pdf) this.fail("search", e); // not a released document
    }
    return false;
  };

  private roughRect = (
    pagePdf: any,
    index: PageIndex,
    [from, to]: [number, number],
  ): Rect => {
    const [s] = this.slices(index, from, to);
    const vp1 = pagePdf.getViewport({ scale: 1 });
    const tx: number[] = this.lib.Util.transform(vp1.transform, s.item.transform);
    const size = Math.hypot(tx[2], tx[3]);
    const len = Math.max(1, s.item.str.length);
    const width = s.item.width || size;
    const r = this.rectOf({
      tx,
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

  private cancelScroll = () => {
    ++this.scrollReq;
    this.pendingScroll = undefined;
  };

  private finishScroll = (
    entry: PageEntry,
    page: number,
    p: Paint,
    index: PageIndex,
  ) => {
    const pending = this.pendingScroll;
    if (!pending || pending.page !== page || !entry.ready) return;
    this.pendingScroll = undefined;
    if (pending.req !== this.scrollReq) return;
    const match = this.firstMatch(index);
    if (!match) return;
    const [line] = this.lines(this.slices(index, match[0], match[1]));
    const r = this.rectOf(this.matchBox(p, index, line));
    const width = entry.base.width; // hl may hold no pixels (width 0)
    const height = entry.hl.height;
    this.scrollMarker(page, {
      x: r.x / width,
      y: r.y / height,
      w: r.w / width,
      h: r.h / height,
    });
  };

  // Jumps straight there, like a browser's find.
  private scrollMarker = (page: number, target: Rect) => {
    const slot = this.slots.get(page);
    if (!slot) return;
    const x = Math.min(1, Math.max(0, target.x));
    const y = Math.min(1, Math.max(0, target.y));
    const marker = this.marker || (this.marker = document.createElement("div"));
    marker.style.cssText =
      "position:absolute;visibility:hidden;pointer-events:none";
    marker.style.left = `${x * 100}%`;
    marker.style.top = `${y * 100}%`;
    marker.style.width = `${Math.max(0, Math.min(target.w, 1 - x)) * 100}%`;
    marker.style.height = `${Math.max(0, Math.min(target.h, 1 - y)) * 100}%`;
    if (marker.parentNode !== slot) slot.appendChild(marker);
    const wrap = this.refCanvasWrap;
    if (wrap && wrap.scrollHeight > wrap.clientHeight) {
      // Scroll only the wrapper, not the page around it.
      const m = marker.getBoundingClientRect();
      const c = wrap.getBoundingClientRect();
      const top =
        wrap.scrollTop +
        m.top -
        c.top -
        wrap.clientTop -
        (wrap.clientHeight - m.height) / 2;
      wrap.scrollTop = top;
    } else if (marker.scrollIntoView) {
      marker.scrollIntoView({ block: "center", inline: "nearest" });
    }
  };

  // Returns the match count per keyword that matched (for debug output).
  private drawHighlights = (
    p: Paint,
    index: PageIndex,
    ctx: CanvasRenderingContext2D,
  ) => {
    const counts: Record<string, number> = {};
    const color = this.keywordColor();
    // Over replaced text marked in the same color the match would not show:
    // that part is drawn darker.
    const strong =
      !this.props.isBorderHighlight &&
      normColor(color) === normColor(this.replaceColor())
        ? darker(color)
        : undefined;
    const draw = (b: Box, c: string) => {
      ctx.save();
      ctx.translate(b.tx[4], b.tx[5]);
      ctx.rotate(b.angle);
      this.mark(ctx, b.x0, b.y, b.w, b.h, c);
      ctx.restore();
    };
    for (const needle of this.needles()) {
      const matches = this.findAll(index, needle);
      if (matches.length) counts[needle.slice(0, 40)] = matches.length;
      for (const [from, to] of matches) {
        for (const line of this.lines(this.slices(index, from, to))) {
          draw(this.matchBox(p, index, line), color);
          if (!strong) continue;
          // Consecutive pieces on marked replaced text, one band each.
          const runs: (Slice & { rep: number })[][] = [];
          line.forEach((s, i) => {
            if (!this.onMarkedReplacement(index, s)) return;
            const prev = runs[runs.length - 1];
            if (prev && this.onMarkedReplacement(index, line[i - 1])) prev.push(s);
            else runs.push([s]);
          });
          runs.forEach((run) => draw(this.matchBox(p, index, run), strong));
        }
      }
    }
    return counts;
  };

  // Whitespace-free page text plus a map from each char back to its source:
  // (item, offset) in the PDF text, or (replacement, offset) where `reps`
  // changed what is displayed.
  private buildIndex = (
    items: Contents[],
    removes: string[],
    reps: ReplaceSlice[] = [],
  ): PageIndex => {
    let text = "";
    const item: number[] = [];
    const off: number[] = [];
    const rep: number[] = [];
    const clean = (s: string) => {
      removes.forEach((r) => {
        if (r && s.includes(r)) s = s.split(r).join(" ".repeat(r.length)); // keep offsets
      });
      return s;
    };
    const add = (s: string, i: number, r: number, from: number, to: number) => {
      for (let j = from; j < to; j++) {
        if (isSpace(s.charCodeAt(j))) continue;
        text += s[j];
        item.push(i);
        off.push(j);
        rep.push(r);
      }
    };
    const repsOf = new Map<Contents, number[]>();
    reps.forEach((r, n) => {
      const mine = repsOf.get(r.item);
      if (mine) mine.push(n);
      else repsOf.set(r.item, [n]);
    });
    items.forEach((it, i) => {
      const s = clean(it.str || "");
      let pos = 0;
      (repsOf.get(it) || [])
        .sort((a, b) => reps[a].start - reps[b].start)
        .forEach((n) => {
          const t = clean(reps[n].text);
          add(s, i, -1, pos, reps[n].start);
          add(t, i, n, 0, t.length);
          pos = reps[n].end;
        });
      add(s, i, -1, pos, s.length);
    });
    return { text, lower: lowerChars(text), item, off, rep, items, reps };
  };

  private normalizeNeedle = (
    keyword: string,
    removes: string[],
    max: number,
  ) => {
    let k = keyword || "";
    removes.forEach((r) => {
      if (r) k = k.split(r).join(" ");
    });
    return k.replace(/\s+/g, "").slice(0, max || 2000);
  };

  // Case-insensitive, like a browser's find.
  private findAll = (idx: PageIndex, needle: string): [number, number][] => {
    const out: [number, number][] = [];
    if (!needle) return out;
    const find = lowerChars(needle);
    let p = idx.lower.indexOf(find);
    while (p !== -1) {
      out.push([p, p + find.length]);
      p = idx.lower.indexOf(find, p + find.length);
    }
    return out;
  };

  // Splits an index range into [start, end) slices of one source string each:
  // an item's raw text (rep = -1) or a replacement's text (rep = its index).
  private slices = (idx: PageIndex, from: number, to: number) => {
    const out: (Slice & { rep: number })[] = [];
    let k = from;
    while (k < to) {
      const i = idx.item[k];
      const r = idx.rep[k];
      let last = k;
      while (
        last + 1 < to &&
        idx.item[last + 1] === i &&
        idx.rep[last + 1] === r
      ) {
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
  private appendTextToCanvas = async (entry: PageEntry, page: number) => {
    const tc = await this.getText(entry.pagePdf, page);
    const ctx = entry.hl.getContext("2d");
    if (this.pages.get(page) !== entry || !ctx) return; // evicted or superseded
    const { Util } = this.lib;
    const { styles } = tc;
    const vp1 = entry.vp1;
    // Selected/copied text is what is displayed: replaced and reflowed.
    const { items, reps } = this.layoutOf(entry, this.paintOf(entry, ctx, tc));
    const edits = new Map<Contents, ReplaceSlice[]>();
    reps.forEach((r) => edits.set(r.item, (edits.get(r.item) || []).concat(r)));
    const layer = document.createElement("div");
    layer.style.cssText =
      "position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;line-height:1;container-type:inline-size";
    const frag = document.createDocumentFragment();
    for (const item of items) {
      if (!item.str) continue;
      const style = styles[item.fontName];
      const tx: number[] = Util.transform(vp1.transform, item.transform);
      const fontH = Math.hypot(tx[2], tx[3]);
      const asc =
        style && Number.isFinite(style.ascent) && style.ascent > 0
          ? style.ascent
          : 0.8;
      const span = document.createElement("span");
      // PDF text is untrusted: never innerHTML
      span.textContent = this.applyEdits(item.str, edits.get(item));
      span.style.cssText =
        "position:absolute;white-space:pre;color:transparent;transform-origin:0 0";
      span.style.left = `${(tx[4] / vp1.width) * 100}%`;
      span.style.top = `${((tx[5] - asc * fontH) / vp1.height) * 100}%`;
      span.style.fontSize = `${(fontH / vp1.width) * 100}cqw`;
      // The PDF's embedded font (registered by pdf.js), else the fallback.
      span.style.fontFamily = `"${item.fontName}", ${(style && style.fontFamily) || "sans-serif"}`;
      const angle = Math.atan2(tx[1], tx[0]);
      if (angle) span.style.transform = `rotate(${angle}rad)`;
      frag.appendChild(span);
    }
    layer.appendChild(frag);
    entry.textLayer?.remove();
    entry.textLayer = layer;
    entry.div.appendChild(layer);
  };

  private applyEdits = (str: string, edits?: ReplaceSlice[]) => {
    if (!edits) return str;
    let out = "";
    let pos = 0;
    edits
      .slice()
      .sort((a, b) => a.start - b.start)
      .forEach((e) => {
        out += str.slice(pos, e.start) + e.text;
        pos = e.end;
      });
    return out + str.slice(pos);
  };

  private setWrap = (ref: HTMLDivElement | null) => {
    this.refCanvasWrap = ref;
  };

  render() {
    const { width = "100%", styleWrap } = this.props;
    return (
      <div
        ref={this.setWrap}
        style={{
          width,
          minHeight: "100%",
          overflow: "auto",
          ...(styleWrap || {}),
        }}
      />
    );
  }
}

export default PDFHighlight;
