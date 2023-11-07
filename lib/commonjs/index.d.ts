declare module "@react-scroll-inverted/react-scroll" {
  import { CSSProperties, PureComponent, ReactNode } from "react";
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
    renderItem: (
      {
        item,
        index,
      }: {
        item: T;
        index: number;
      },
    ) => JSX.Element | JSX.Element[] | ReactNode | null | undefined;
    keyExtractor?: (item: T, index: number) => string | number;
  };

  export class ScrollInverted<T> extends PureComponent<ScrollInvertedProps<T>> {
    scrollTo(options: ScrollToOptions): void;
    scrollToTop(options?: ScrollBehavior): void;
    scrollToEnd(options?: ScrollBehavior): void;
  }
}
