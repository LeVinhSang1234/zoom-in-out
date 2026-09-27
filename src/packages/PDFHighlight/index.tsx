import { Component, CSSProperties } from "react";

type Contents = {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
};

export type ReplaceText = {
  search: string;
  replace: string;
  color?: string; // text color, default: the page's ink
  background?: string; // covers the original glyphs, default: the page's paper
};

type Props = {
  url?: string;
  width?: number | string;
  scale?: number;
  page?: number;
  pageSearch?: number;
  onLoaded?: (error?: any) => void;
  onStartLoad?: (error?: any) => void;
  keywords?: string[];
  colorHighlight?: string;
  isBorderHighlight?: boolean;
  styleWrap?: CSSProperties;
  debug?: boolean;
  allowHtml?: boolean;
  specialWordRemoves?: string[];
  maxKeywordLength?: number;
  // Display-only: the PDF file and pdf.js text extraction keep the original.
  replaceTexts?: ReplaceText[];
  // The app's own pdf.js (e.g. `import * as pdfjs from "pdfjs-dist"`). Without
  // it a global pdfjsLib is reused, else pdf.js 3.11.174 comes from cdnjs.
  pdfjs?: any;
};

type TextStyle = { fontFamily: string; ascent: number; descent: number };
type TextContent = { items: Contents[]; styles: Record<string, TextStyle> };
type PageEntry = {
  pagePdf: any;
  div: HTMLDivElement;
  base: HTMLCanvasElement;
  hl: HTMLCanvasElement;
  viewport: any;
  vp1: any;
  task?: any;
  textLayer?: HTMLDivElement;
  colors: Map<string, Colors>; // sampled from the rendered page, by region
};
type PageIndex = {
  text: string;
  item: number[];
  off: number[];
  rep: number[]; // -1 for PDF text, else the index into reps
  items: Contents[];
  reps: ReplaceSlice[];
};
type Slice = { item: Contents; start: number; end: number };
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
type Item = Contents & { rule?: ReplaceText };
// Items [first, last] on one baseline (canvas px); a wide gap ends a segment
// so table cells and columns stay apart.
type Segment = {
  first: number;
  last: number;
  text: boolean;
  flat: boolean; // upright, unrotated text: the only kind that is reflowed
  x: number;
  right: number;
  y: number;
  size: number;
};
type Rect = { x: number; y: number; w: number; h: number };
type Colors = { paper: string; ink: string };
// A paragraph laid out again: new items replace items [first, last], drawn
// over the `cover` rects that hide the original lines.
type Flow = {
  first: number;
  last: number;
  items: Item[];
  cover: Rect[];
  background?: string;
};
// A text box in canvas px, relative to the baseline origin tx[4], tx[5] and
// rotated by `angle`; `font`/`track` reproduce how the PDF sets that text.
type Box = {
  tx: number[];
  angle: number;
  x0: number;
  w: number;
  y: number;
  h: number;
  font: string;
  track: number;
};
type Paint = {
  ctx: CanvasRenderingContext2D;
  tc: TextContent;
  viewport: any;
  pagePdf: any;
  base: HTMLCanvasElement;
  colors: Map<string, Colors>;
};

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
const withWorker = (lib: any) => {
  const options = lib.GlobalWorkerOptions;
  if (!options.workerSrc && !options.workerPort) {
    options.workerSrc = workerFor(lib);
  }
  return lib;
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
  "isBorderHighlight",
  "pageSearch",
  "specialWordRemoves",
  "maxKeywordLength",
  "replaceTexts",
];
// Props that change the page bitmaps.
const RASTER_KEYS: (keyof Props)[] = ["scale", "page", "allowHtml"];

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
const loadPdfJs = (): Promise<any> =>
  (pdfjsPromise ??= new Promise((res, rej) => {
    const ready = () => {
      const lib = globalPdfJs();
      if (!lib) return rej(new Error("pdf.js loaded but pdfjsLib is missing"));
      res(withWorker(lib));
    };
    if (globalPdfJs()) return ready();
    const script = document.createElement("script");
    script.src = DEFAULT_CDN_PDFJS;
    script.crossOrigin = "anonymous";
    script.integrity = DEFAULT_INTEGRITY;
    script.referrerPolicy = "no-referrer";
    script.onload = ready;
    script.onerror = () => {
      script.remove();
      pdfjsPromise = undefined;
      rej(new Error("Failed to load pdf.js from " + DEFAULT_CDN_PDFJS));
    };
    document.head.appendChild(script);
  }));

class PDFHighlight extends Component<Props> {
  private lib?: any; // the pdf.js in use
  private pdf?: any;
  private loadingTask?: any;
  private refCanvasWrap?: HTMLDivElement | null;
  private resizeObserver?: ResizeObserver;
  private observer?: IntersectionObserver;
  private timeoutRender?: ReturnType<typeof setTimeout>;
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
  private onIdle?: (error?: any) => void;
  private pageError?: any;

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
  }

  componentDidUpdate(prev: Props): void {
    const p = this.props;
    const changed = (keys: (keyof Props)[]) =>
      keys.some((k) => !sameValue(prev[k], p[k]));
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
        this.pages.forEach((entry, page) => {
          this.appendTextToCanvas(entry, page).catch(() => undefined);
        });
      }
    }
    // width / styleWrap are CSS only; the ResizeObserver re-rasterizes if needed.
  }

  componentWillUnmount(): void {
    this.unmounted = true;
    ++this.loadReq;
    if (this.timeoutRender) clearTimeout(this.timeoutRender);
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    window.removeEventListener("resize", this.loadResize);
    this.releaseDocument();
    // The pdf.js <script> stays: other and future instances reuse it.
  }

  private startLoad = () => {
    const { url, onStartLoad, onLoaded } = this.props;
    if (!url) {
      this.loadPDf().catch(() => undefined); // only releases the old document
      return;
    }
    onStartLoad?.();
    this.loadPDf()
      .then((ok) => (ok ? this.renderPage() : undefined))
      .catch((e) => onLoaded?.(e));
  };

  private loadPDf = async (): Promise<boolean> => {
    const req = ++this.loadReq;
    const { url, pdfjs } = this.props;
    this.releaseDocument();
    if (!url) return false;
    let task: any;
    try {
      // `import pdfjs from "pdfjs-dist"` may hand over the CommonJS wrapper.
      const own = pdfjs && (pdfjs.getDocument ? pdfjs : pdfjs.default);
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
      return true;
    } catch (e) {
      if (req !== this.loadReq) return false; // superseded or unmounted
      throw e;
    }
  };

  private releaseDocument = () => {
    this.resetPages();
    this.textCache.clear();
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
    [entry.base, entry.hl].forEach((c) => {
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
      if (this.props.debug) console.info("[PDFHighlight] resize", w);
      this.props.onStartLoad?.();
      this.renderPage();
    }, 150);
  };

  private isCancelled = (e: any) => e?.name === "RenderingCancelledException";

  // Lays out one placeholder per page, then rasterizes pages lazily as they
  // approach the viewport. onLoaded fires once the first visible batch is drawn.
  private renderPage = async () => {
    const pdf = this.pdf; // capture once: never switch documents mid-pass
    const wrap = this.refCanvasWrap;
    if (!pdf || !wrap || !wrap.clientWidth) return;
    this.resetPages();
    const gen = this.renderGen;
    const { onLoaded, page } = this.props;
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
      const error = await this.observePages(wrap, gen);
      if (gen === this.renderGen) onLoaded?.(error);
    } catch (e) {
      if (gen === this.renderGen && !this.isCancelled(e)) onLoaded?.(e);
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
              this.visible.delete(n);
              this.evict(n);
            }
          });
          this.pump(gen);
        },
        { root, rootMargin: RENDER_MARGIN }
      );
      this.observer = observer;
      this.slots.forEach((div) => observer.observe(div));
    });

  // Starts renders for visible pages, at most MAX_CONCURRENT_RENDERS at once.
  private pump = (gen: number) => {
    const queue = Array.from(this.visible)
      .filter((n) => !this.pages.has(n) && !this.active.has(n))
      .sort((a, b) => a - b);
    while (this.active.size < MAX_CONCURRENT_RENDERS && queue.length) {
      const n = queue.shift() as number;
      this.active.add(n);
      this.renderPdf(n, gen)
        .catch((e) => {
          if (gen !== this.renderGen || this.isCancelled(e)) return;
          this.pageError = this.pageError || e;
          if (this.props.debug) console.error("[PDFHighlight] page", n, e);
        })
        .then(() => {
          if (gen !== this.renderGen) return;
          this.active.delete(n);
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
    const { scale = 1, allowHtml } = this.props;
    const vp1 = pagePdf.getViewport({ scale: 1 });
    const dpr = window.devicePixelRatio || 1;
    const rasterScale = Math.min(
      Math.max(scale, (this.renderedWidth / vp1.width) * dpr),
      Math.sqrt(MAX_CANVAS_PIXELS / (vp1.width * vp1.height))
    );
    const viewport = pagePdf.getViewport({ scale: rasterScale });
    div.style.aspectRatio = `${vp1.width} / ${vp1.height}`;

    const base = document.createElement("canvas");
    const hl = document.createElement("canvas"); // highlights live here
    [base, hl].forEach((c) => {
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

    const ctx = base.getContext("2d");
    if (!ctx) return;
    const entry: PageEntry = {
      pagePdf,
      div,
      base,
      hl,
      viewport,
      vp1,
      colors: new Map(),
    };
    this.pages.set(page, entry);
    const text = this.getText(pagePdf, page); // fetched alongside the render
    entry.task = pagePdf.render({ canvasContext: ctx, viewport });
    await Promise.all([entry.task.promise, text]);
    // Once rendered, pdf.js has loaded the PDF's own fonts, so measured text
    // (reflowed paragraphs, highlight offsets) matches the page.
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
      this.paintPage(page, paint).catch(() => undefined);
    });
  };

  private paintPage = async (page: number, paint: number) => {
    const entry = this.pages.get(page);
    const ctx = entry?.hl.getContext("2d");
    if (!entry || !ctx) return;
    ctx.clearRect(0, 0, entry.hl.width, entry.hl.height);
    const { keywords = [], pageSearch, replaceTexts = [] } = this.props;
    const search = !!keywords.length && (!pageSearch || pageSearch === page);
    if (!search && !replaceTexts.length) return;
    const tc = await this.getText(entry.pagePdf, page);
    if (paint !== this.paintGen || this.pages.get(page) !== entry) return;
    const p = this.paintOf(entry, ctx, tc);
    const removes = this.props.specialWordRemoves || [];
    const { items, reps, flows } = this.layout(p);
    // Replacements first, so highlights stay visible on top of them.
    this.drawReplacements(p, reps, page);
    flows.forEach((flow) => this.drawFlow(p, flow));
    if (!search) return;
    // Keywords match what is displayed, i.e. the text after replacement.
    this.drawHighlights(p, this.buildIndex(items, removes, reps), page);
  };

  private paintOf = (
    entry: PageEntry,
    ctx: CanvasRenderingContext2D,
    tc: TextContent
  ): Paint => ({
    ctx,
    tc,
    viewport: entry.viewport,
    pagePdf: entry.pagePdf,
    base: entry.base,
    colors: entry.colors,
  });

  // What the page shows: the PDF's items plus replaceTexts. A replacement too
  // long for its place is flowed into its paragraph like typed text (those
  // paragraphs become new items); otherwise it is drawn in place.
  private layout = (p: Paint) => {
    const items: Item[] = p.tc.items;
    const original = this.buildIndex(items, this.props.specialWordRemoves || []);
    const reps = this.planReplacements(original);
    const flows: Flow[] = [];
    const long = reps.filter((r) => r === r.line[0] && this.overflows(p, r));
    if (!long.length) return { items, reps, flows };
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
      if (!flow) return; // needs more lines than it has: drawn scaled instead
      flows.push(flow);
      mine.forEach((r) => flowed.add(r));
    });
    if (!flows.length) return { items, reps, flows };
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
    return { items: shown, reps: reps.filter((r) => !flowed.has(r)), flows };
  };

  private overflows = (p: Paint, lead: ReplaceSlice) => {
    if (!lead.text) return false;
    const b = this.lineBox(p, lead.line);
    p.ctx.save();
    const k = this.useFont(p.ctx, b, lead.text);
    p.ctx.restore();
    return k < 0.99;
  };

  private segments = (p: Paint): Segment[] => {
    const { Util } = this.lib;
    const out: Segment[] = [];
    p.tc.items.forEach((item, i) => {
      const cur = out[out.length - 1];
      if (!item.str || !item.str.trim()) {
        if (cur) cur.last = i;
        else out.push({ first: i, last: i, text: false, flat: false, x: 0, right: 0, y: 0, size: 0 });
        return;
      }
      const tx: number[] = Util.transform(p.viewport.transform, item.transform);
      const flat =
        Math.abs(tx[1]) < 1e-6 && Math.abs(tx[2]) < 1e-6 && tx[0] > 0 && tx[3] < 0;
      const x = tx[4];
      const right = x + item.width * p.viewport.scale;
      const size = Math.abs(tx[3]);
      if (cur && !cur.text) {
        Object.assign(cur, { last: i, text: true, flat, x, right, y: tx[5], size });
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
        out.push({ first: i, last: i, text: true, flat, x, right, y: tx[5], size });
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
  // words wrap at the column edge and justified text stays justified. Returns
  // nothing when the text needs more lines than the paragraph has.
  private flow = (
    p: Paint,
    para: Segment[],
    mine: ReplaceSlice[],
    segs: Segment[],
    at: Map<Contents, number>
  ): Flow | undefined => {
    const { ctx, tc } = p;
    const items = tc.items;
    const size = para[0].size;
    const left = para.reduce((m, s) => Math.min(m, s.x), Infinity);
    // The column's right edge, also judged from other lines of the column.
    const right = segs
      .filter(
        (s) =>
          s.flat &&
          s.text &&
          Math.abs(s.x - left) <= size * 3 &&
          Math.abs(s.size - size) <= size * 0.1
      )
      .reduce((m, s) => Math.max(m, s.right), 0);
    const justified =
      para.length > 1 && para.slice(0, -1).every((s) => s.right >= right - s.size);
    const holds = (s: Segment) =>
      mine.some((r) => {
        const i = at.get(r.item) as number;
        return i >= s.first && i <= s.last;
      });
    const lines = para.slice(para.findIndex(holds));

    // The text from the first replaced line on, with the replacements in place.
    type Part = { text: string; item: Contents; rule?: ReplaceText; w: number };
    const pieces = new Map<Contents, ReplaceSlice[]>();
    mine.forEach((r) => pieces.set(r.item, (pieces.get(r.item) || []).concat(r)));
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
      if (!b) boxes.set(item, (b = this.sliceBox(p, { item, start: 0, end: 0 })));
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
        word.push({ ...part, text: t, w: ctx.measureText(t).width + b.track * t.length });
      });
    });
    const widthOf = (w: Part[]) => w.reduce((n, part) => n + part.w, 0);
    let space = 0;
    if (words.length) {
      ctx.font = boxOf(words[0][0].item).font;
      space = ctx.measureText(" ").width;
    }

    // Fill the original baselines greedily.
    const rows: Part[][][] = [[]];
    let x = lines[0].x;
    for (const w of words) {
      const wide = widthOf(w);
      let row = rows[rows.length - 1];
      if (row.length && x + space + wide > right) {
        if (rows.length === lines.length) return undefined;
        rows.push((row = []));
        x = lines[rows.length - 1].x;
      } else if (row.length) {
        x += space;
      }
      if (x + wide > right + 0.5) return undefined; // a word wider than a line
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
    rows.forEach((row, n) => {
      const line = lines[n];
      const used = row.reduce((m, w) => m + widthOf(w), 0) + space * (row.length - 1);
      const gap =
        justified && n < rows.length - 1 && row.length > 1
          ? space + (right - line.x - used) / (row.length - 1)
          : space;
      let cx = line.x;
      row.forEach((w, j) => {
        w.forEach((part) => {
          out.push(make(part, cx, line.y));
          cx += part.w;
        });
        if (j === row.length - 1) return;
        // Spaces are not drawn; they keep copied text readable.
        out.push(make({ text: " ", item: w[w.length - 1].item, w: gap }, cx, line.y));
        cx += gap;
      });
    });

    const cover = lines.map((s) => {
      const first = items
        .slice(s.first, s.last + 1)
        .find((it) => !!it.str && !!it.str.trim()) as Contents;
      const style = tc.styles[first.fontName];
      const asc = style && style.ascent > 0 ? style.ascent : 0.8;
      const desc = style && style.descent < 0 ? style.descent : -0.2;
      const pad = s.size * 0.05;
      return {
        x: s.x - pad,
        y: s.y - asc * s.size - pad,
        w: right - s.x + 2 * pad,
        h: (asc - desc) * s.size + 2 * pad,
      };
    });
    return {
      first: lines[0].first,
      last: lines[lines.length - 1].last,
      items: out,
      cover,
      background: mine[0].rule.background,
    };
  };

  private drawFlow = (p: Paint, flow: Flow) => {
    const { ctx } = p;
    const { paper, ink } = this.colorsAt(p, flow.cover);
    ctx.save();
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
      if (!item.rule) {
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
        this.mark(ctx, b.x0, b.y, b.w, b.h);
        ctx.restore();
      })
    );
    ctx.restore();
  };

  // Paper and ink of a region of the rendered page, so drawn text blends in:
  // the most common color is the paper, the one farthest from it the ink.
  private colorsAt = (p: Paint, rects: Rect[]): Colors => {
    const x0 = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.x))));
    const y0 = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.y))));
    const x1 = Math.min(p.base.width, Math.ceil(Math.max(...rects.map((r) => r.x + r.w))));
    const y1 = Math.min(p.base.height, Math.ceil(Math.max(...rects.map((r) => r.y + r.h))));
    const key = [x0, y0, x1, y1].join();
    let colors = p.colors.get(key);
    if (colors) return colors;
    colors = { paper: "#fff", ink: "#000" };
    try {
      const ctx = p.base.getContext("2d");
      if (ctx && x1 > x0 && y1 > y0) {
        const { data } = ctx.getImageData(x0, y0, x1 - x0, y1 - y0);
        const counts = new Map<number, number>();
        let paper = 0xffffff;
        let most = 0;
        for (let i = 0; i < data.length; i += 8) {
          const c = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
          const n = (counts.get(c) || 0) + 1;
          counts.set(c, n);
          if (n > most) {
            most = n;
            paper = c;
          }
        }
        const diff = (c: number) =>
          [16, 8, 0].reduce((d, s) => d + Math.abs(((c >> s) & 255) - ((paper >> s) & 255)), 0);
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
      })
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
    const weight = font.black ? "900" : font.bold ? "bold" : "normal";
    const italic = font.italic ? "italic" : "normal";
    const family =
      (font.systemFontInfo && font.systemFontInfo.css) ||
      `"${font.loadedName}", ${font.fallbackName || fallback}`;
    return `${italic} ${weight} ${size}px ${family}`;
  };

  // Box of item.str[start, end). Browser widths are scaled onto the exact PDF
  // advance (item.width); `track` is the extra spacing per char the PDF adds.
  private sliceBox = (p: Paint, { item, start, end }: Slice): Box => {
    const { Util } = this.lib;
    const style = p.tc.styles[item.fontName];
    const tx: number[] = Util.transform(p.viewport.transform, item.transform);
    const fontH = Math.hypot(tx[2], tx[3]);
    const asc =
      style && Number.isFinite(style.ascent) && style.ascent > 0
        ? style.ascent
        : 0.8;
    const desc =
      style && Number.isFinite(style.descent) && style.descent < 0
        ? style.descent
        : -0.2;
    const font = this.fontOf(p, item, fontH);
    p.ctx.font = font;
    const target = item.width * p.viewport.scale;
    const full = p.ctx.measureText(item.str).width || 1;
    const k = target / full;
    const x0 = p.ctx.measureText(item.str.slice(0, start)).width * k;
    const x1 = p.ctx.measureText(item.str.slice(0, end)).width * k;
    return {
      tx,
      angle: Math.atan2(tx[1], tx[0]),
      x0,
      w: x1 - x0,
      y: -asc * fontH,
      h: (asc - desc) * fontH,
      font,
      track: (target - full) / Math.max(1, item.str.length),
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
    end: number
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

  private drawReplacements = (p: Paint, parts: ReplaceSlice[], page: number) => {
    const { ctx } = p;
    if (this.props.debug && parts.length) {
      console.info("[PDFHighlight] page", page, "replaced slices", parts.length);
    }
    parts.forEach((part) => {
      if (part !== part.line[0]) return; // drawn once per visual line
      ctx.save();
      const b = this.lineBox(p, part.line);
      const pad = b.h * 0.05; // hide anti-aliased edges of the original glyphs
      const { paper, ink } = this.colorsAt(p, [this.rectOf(b)]);
      ctx.translate(b.tx[4], b.tx[5]);
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
        this.mark(ctx, b.x0, b.y, ctx.measureText(part.text).width * k, b.h);
      }
      ctx.restore();
    });
  };

  // One highlight box in the current transform: a translucent fill, or a
  // border with isBorderHighlight.
  private mark = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const { colorHighlight = "yellow", isBorderHighlight } = this.props;
    ctx.save();
    if (isBorderHighlight) {
      ctx.strokeStyle = colorHighlight;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    } else {
      ctx.fillStyle = colorHighlight;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  };

  // Every occurrence of every replaceTexts rule as per-item pieces, with the
  // replacement text spread over the visual lines the match spans. Earlier
  // rules win where matches overlap.
  private planReplacements = (index: PageIndex): ReplaceSlice[] => {
    const { replaceTexts = [], specialWordRemoves = [] } = this.props;
    const out: ReplaceSlice[] = [];
    const taken = new Uint8Array(index.text.length);
    const size = (line: Slice[]) => line.reduce((n, s) => n + s.end - s.start, 0);
    replaceTexts.forEach((rule) => {
      const needle = this.normalizeNeedle(rule.search, specialWordRemoves, Infinity);
      const text = rule.replace || "";
      this.findAll(index, needle).forEach(([from, to]) => {
        for (let i = from; i < to; i++) if (taken[i]) return;
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

  private drawHighlights = (p: Paint, index: PageIndex, page: number) => {
    const { ctx } = p;
    const {
      keywords = [],
      specialWordRemoves = [],
      maxKeywordLength = 2000,
      debug,
    } = this.props;
    const needles = Array.from(
      new Set(
        keywords.map((k) =>
          this.normalizeNeedle(k, specialWordRemoves, maxKeywordLength)
        )
      )
    ).filter(Boolean); // drops whitespace-only keywords
    for (const needle of needles) {
      const matches = this.findAll(index, needle);
      if (debug) {
        console.info("[PDFHighlight] page", page, "matches", matches.length, needle);
      }
      for (const [from, to] of matches) {
        for (const line of this.lines(this.slices(index, from, to))) {
          const b = this.mergeBoxes(
            line.map((s) =>
              s.rep < 0
                ? this.sliceBox(p, s)
                : this.replacedBox(p, index.reps[s.rep], s.start, s.end)
            )
          );
          ctx.save();
          ctx.translate(b.tx[4], b.tx[5]);
          ctx.rotate(b.angle);
          this.mark(ctx, b.x0, b.y, b.w, b.h);
          ctx.restore();
        }
      }
    }
  };

  // Whitespace-free page text plus a map from each char back to its source:
  // (item, offset) in the PDF text, or (replacement, offset) where `reps`
  // changed what is displayed.
  private buildIndex = (
    items: Contents[],
    removes: string[],
    reps: ReplaceSlice[] = []
  ): PageIndex => {
    const chars: string[] = [];
    const item: number[] = [];
    const off: number[] = [];
    const rep: number[] = [];
    const clean = (s: string) => {
      removes.forEach((r) => {
        if (r) s = s.split(r).join(" ".repeat(r.length)); // keep offsets
      });
      return s;
    };
    const add = (s: string, i: number, r: number, from: number, to: number) => {
      for (let j = from; j < to; j++) {
        if (/\s/.test(s[j])) continue;
        chars.push(s[j]);
        item.push(i);
        off.push(j);
        rep.push(r);
      }
    };
    const repsOf = new Map<Contents, number[]>();
    reps.forEach((r, n) => repsOf.set(r.item, (repsOf.get(r.item) || []).concat(n)));
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
    return { text: chars.join(""), item, off, rep, items, reps };
  };

  private normalizeNeedle = (keyword: string, removes: string[], max: number) => {
    let k = keyword || "";
    removes.forEach((r) => {
      if (r) k = k.split(r).join(" ");
    });
    return k.replace(/\s+/g, "").slice(0, max || 2000);
  };

  private findAll = (idx: PageIndex, needle: string): [number, number][] => {
    const out: [number, number][] = [];
    if (!needle) return out;
    let p = idx.text.indexOf(needle);
    while (p !== -1) {
      out.push([p, p + needle.length]);
      p = idx.text.indexOf(needle, p + needle.length);
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
  private appendTextToCanvas = async (entry: PageEntry, page: number) => {
    const tc = await this.getText(entry.pagePdf, page);
    const ctx = entry.hl.getContext("2d");
    if (this.pages.get(page) !== entry || !ctx) return; // evicted or superseded
    const { Util } = this.lib;
    const { styles } = tc;
    const vp1 = entry.vp1;
    // Selected/copied text is what is displayed: replaced and reflowed.
    const { items, reps } = this.layout(this.paintOf(entry, ctx, tc));
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
