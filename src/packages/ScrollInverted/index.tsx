import { CSSProperties, PureComponent, ReactNode } from "react";

const clsx = (...args: (string | false | undefined | null | number)[]) => {
  return args.filter(Boolean).join(" ").trim();
};

type ScrollInvertedProps<T> = {
  classNameWrap?: string;
  className?: string;
  classNameContentContainer?: string;
  onScrollEnd?: () => void;
  onScroll?: (top: number) => void;
  initialScrollTop?: number;
  styleWrap?: CSSProperties;
  style?: CSSProperties;
  styleContentContainer?: CSSProperties;
  direction?: "rtl" | "ltr";
  onLayout?: (layout: { height: number; scrollHeight: number }) => void;
  onEndReachedThreshold?: number;
  onStartReachedThreshold?: number;
  onEndReached?: () => void;
  onStartReached?: () => void;
  data?: T[];
  renderItem: ({
    item,
    index,
  }: {
    item: T;
    index: number;
  }) => JSX.Element | JSX.Element[] | ReactNode | null | undefined;
  keyExtractor?: (item: T, index: number) => string | number;
};

class ScrollInverted<T> extends PureComponent<ScrollInvertedProps<T>> {
  private timeoutEnd?: NodeJS.Timeout;
  private divScroll?: HTMLDivElement | null;

  private height: number;
  private scrollHeight: number;

  private preScrollTop: number;
  private frameRequest?: number;
  private frameGetLayout?: number;

  private modeScroll?: "down" | "up";
  private divContent?: HTMLDivElement | null;
  private divContentWrap?: HTMLDivElement | null;

  private styleDom?: HTMLStyleElement;

  private isEnd?: boolean;

  constructor(props: ScrollInvertedProps<T>) {
    super(props);
    this.height = 0;
    this.scrollHeight = 0;
    this.preScrollTop = 0;
  }

  componentDidMount(): void {
    try {
      Promise.all([
        this.appendCss(),
        this.getLayout(),
        this.scrollToInit(),
        this.getDirection(),
      ]);
    } catch {}
    this.divScroll?.addEventListener("wheel", this.onWheel, { passive: false });
  }

  componentWillUnmount(): void {
    this.divScroll?.removeEventListener("wheel", this.onWheel);
    if (this.frameGetLayout) window.cancelAnimationFrame(this.frameGetLayout);
    this.removeCss();
  }

  componentDidUpdate(): void {
    if (!this.divScroll) return;
    if (!this.preScrollTop) {
      const { scrollHeight } = this.divScroll;
      if (scrollHeight !== this.scrollHeight) {
        this.divScroll.scrollTo({ top: scrollHeight - this.scrollHeight });
      }
    }
  }

  private appendCss = async () => {
    const head = document.querySelector("head");
    if (!head) return;
    this.styleDom = document.createElement("style");
    this.styleDom.innerHTML = `
    .scroll-inverted-wrap {
      flex: 1;
      direction: ltr !important;
      display: flex;
      height: 100%;
      width: 100%;
    }
    .scroll-inverted-container {
      flex: 1;
      transform: rotate(180deg);
      overflow: auto;
      position: relative;
      display: flex;
    }
    .scroll-inverted-wrap > .scroll-inverted-container > .scroll-inverted-content {
      height: max-content;
      min-height: 100%;
      position: relative !important;
      flex: 1;
      align-content: flex-end;
    }
    .scroll-inverted-wrap > .scroll-inverted-indicator-scroll {
      position: absolute;
      right: 2px;
      bottom: 0;
      width: 8px;
      display: flex;
    }
    
    .scroll-inverted-indicator-scroll--relative {
      position: relative;
      flex: 1;
    }
    
    .scroll-inverted-wrap .scroll-inverted-indicator-scroll-thumb {
      background-color: #a0a0a5;
      border-radius: 16px;
      bottom: 0;
      position: absolute;
      right: 0px;
      width: 100%;
      transition: opacity 0.2s, transform 0.1s;
    }
    `;
    head.append(this.styleDom);
  };

  private removeCss = () => {
    const head = document.querySelector("head");
    if (head && this.styleDom) head.removeChild(this.styleDom);
  };

  private getDirection = async () => {
    const elem = document.querySelector("body");
    if (!elem || !this.divContentWrap || !this.divScroll || !this.divContent) {
      return;
    }
    const { direction: directionProps = "" } = this.props;
    let direction = directionProps;
    if (!direction && window.getComputedStyle) {
      direction = window
        .getComputedStyle(elem, null)
        .getPropertyValue("direction");
    }
    this.divContent.style.direction = direction;
    this.divContentWrap.style.direction = direction === "rtl" ? "ltr" : "rtl";
    this.divScroll.style.direction = direction === "rtl" ? "ltr" : "rtl";
  };

  private scrollToInit = async () => {
    const { initialScrollTop } = this.props;
    if (!this.divScroll || !initialScrollTop) return;
    this.divScroll.scrollTo({ top: initialScrollTop });
  };

  private getLayout = async () => {
    if (!this.divScroll) return;
    const { clientHeight, scrollHeight } = this.divScroll;
    const { onLayout } = this.props;
    if (this.height !== clientHeight || this.scrollHeight !== scrollHeight) {
      onLayout?.({ height: clientHeight, scrollHeight });
      this.height = clientHeight;
      this.scrollHeight = scrollHeight;
    }
    this.frameGetLayout = window.requestAnimationFrame(this.getLayout);
  };

  private onWheel = (event: WheelEvent) => {
    if (!this.divScroll) return;
    event.preventDefault();
    const { scrollTop, scrollHeight } = this.divScroll;
    if (this.frameRequest) window.cancelAnimationFrame(this.frameRequest);
    let newScroll = scrollTop - event.deltaY;
    if (newScroll > scrollHeight) {
      newScroll = scrollHeight;
    }
    this.divScroll.scrollTo({ top: newScroll });
    this.beginFrameAnimated();
  };

  private onScrollEndHandle = () => {
    const { onScrollEnd } = this.props;
    onScrollEnd?.();
    this.onReached();
  };

  private onScrollEnd = () => {
    if (this.frameRequest) window.cancelAnimationFrame(this.frameRequest);
    if (this.timeoutEnd) clearTimeout(this.timeoutEnd);
    this.timeoutEnd = setTimeout(this.onScrollEndHandle, 100);
  };

  private beginFrameAnimated = () => {
    if (!this.divScroll) return;
    const { scrollTop } = this.divScroll;
    if (scrollTop !== this.preScrollTop) {
      this.isEnd = false;
      this.modeScroll = scrollTop < this.preScrollTop ? "down" : "up";
      const { onScroll } = this.props;
      onScroll?.(scrollTop);
      this.preScrollTop = scrollTop;
      this.frameRequest = window.requestAnimationFrame(this.beginFrameAnimated);
    } else if (!this.isEnd) {
      this.isEnd = true;
      this.onScrollEnd();
    }
  };

  private onReached = () => {
    const {
      onEndReached,
      onEndReachedThreshold = 0.01,
      onStartReached,
      onStartReachedThreshold = 0.01,
    } = this.props;
    if (!this.divScroll) return;
    const { scrollTop } = this.divScroll;
    if (this.modeScroll === "down") {
      const topCheck = onEndReachedThreshold * this.scrollHeight;
      if (scrollTop <= topCheck) {
        onEndReached?.();
      }
      return;
    }
    const topCheck =
      this.scrollHeight - this.height - onStartReachedThreshold * this.height;

    if (scrollTop >= topCheck) {
      onStartReached?.();
    }
    return;
  };

  private onScrollMobile = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;
    this.beginFrameAnimated();
  };

  scrollTo = (options: ScrollToOptions) => {
    if (!this.divScroll) return;
    this.divScroll.scrollTo(options);
    this.beginFrameAnimated();
  };

  scrollToEnd = (behavior?: ScrollBehavior) => {
    if (!this.divScroll) return;
    this.divScroll.scrollTo({ top: 0, behavior });
    this.beginFrameAnimated();
  };

  scrollToTop = (behavior?: ScrollBehavior) => {
    if (!this.divScroll) return;
    const { scrollHeight } = this.divScroll;
    this.divScroll.scrollTo({ top: scrollHeight, behavior });
    this.beginFrameAnimated();
  };

  private getReverse = () => {
    const { data = [] } = this.props;
    return [...data].reverse();
  };

  render() {
    const {
      className,
      style,
      classNameContentContainer,
      styleContentContainer = {},
      styleWrap,
      classNameWrap,
      renderItem,
      keyExtractor,
    } = this.props;
    return (
      <div
        className={clsx("scroll-inverted-wrap", classNameWrap)}
        style={styleWrap}
      >
        <div
          className={clsx("scroll-inverted-container", className)}
          ref={(ref) => (this.divScroll = ref)}
          style={style}
          onScroll={this.onScrollMobile}
        >
          <div
            style={{ ...styleContentContainer, position: "relative" }}
            className={clsx(
              "scroll-inverted-content",
              classNameContentContainer
            )}
            ref={(ref) => (this.divContentWrap = ref)}
          >
            <div ref={(ref) => (this.divContent = ref)}>
              {this.getReverse().map((item, index) => (
                <ItemRenderring key={keyExtractor?.(item, index) || index}>
                  {renderItem?.({ item, index })}
                </ItemRenderring>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ItemRenderring extends PureComponent<{ children?: ReactNode }> {
  render() {
    const { children } = this.props;
    return (
      <div style={{ width: "100%", transform: "rotate(180deg)" }}>
        {children}
      </div>
    );
  }
}

export default ScrollInverted;
