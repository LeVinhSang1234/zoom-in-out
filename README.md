# Scroll Inverted 
```js
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
      style: CSSProperties
    ) => JSX.Element | JSX.Element[] | ReactNode | null | undefined;
    keyExtractor?: (item: T, index: number) => string | number;
  };
```

```js
import { Fragment, useRef, useState } from "react";
import ScrollInverted from "@react-scroll-inverted/react-scroll";

function App() {
  const [state1, setState1] = useState(
    new Array(10).fill(null).map((_, i) => `${i + 1} Text`)
  );

  const refScroll = useRef < ScrollInverted < (typeof state1)[0] > null;

  return (
    <Fragment>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "0 20px",
        }}
      >
        <ScrollInverted
          renderItem={({ item }) => (
            <div>
              <div style={{ paddingTop: 100, color: "red" }}>{item}</div>
            </div>
          )}
          data={state1}
          ref={refScroll}
          onStartReached={() => {
            console.log("onStartReached");
          }}
          keyExtractor={(item) => item}
          onEndReached={() => {
            console.log("onEndReached");
          }}
          onLayout={() => {
            refScroll.current?.scrollToEnd("smooth");
          }}
        />
      </div>
      <button
        onClick={() => setState1([...state1, `${state1.length + 1} Text`])}
      >
        add data
      </button>
    </Fragment>
  );
}

export default App;
```
[Demo](https://github.com/LeVinhSang1234/zoom-in-out/assets/35788280/592d2954-035c-4389-b724-6b13013288f9)
