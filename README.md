# React Zoom In, Zoom Out

```js
type ZoomProps = {
  animationDuration?: number,
  minZoom?: number,
  maxZoom?: number,
  tabScale?: number,
  percentWheel?: number,
  allowSpaceDrag?: boolean,
  allowCtrWheel?: boolean,
};
```

- animationDuration

```
Animation duration in milliseconds. (default 300ms)

```

- minZoom

```
Minimum zoom factor. (default 0.5)

```

- maxZoom

```
Maximum zoom factor. (default 10)

```

- tabScale

```
Zoom factor that will be added for current zoom Factor when a double tap zooms to. (default 1)
```

- percentWheel

```
zoom ratio when scrolling mouse wheel (default 0.01)
```

- allowSpaceDrag

```
have to press spacebar to be dragged? (default true)
```

- allowCtrWheel

```
have to press ctrl or command key to zoom when scrolling mouse wheel? (default true)
```

# Method

- onZoomIn(isCenter: boolean = true)

- onZoomOut(isCenter: boolean = true)

- reset()

# Example

```js
import { Fragment, useRef } from "react";
import { Zoom } from "@react-zoom/react-zoom-in-out";

function App() {
  const refZoom = (useRef < Zoom) | (null > null);

  const onZoomIn = () => {
    if (!refZoom.current) return;
    refZoom.current.onZoomIn();
  };

  const onZoomOut = () => {
    if (!refZoom.current) return;
    refZoom.current.onZoomOut();
  };

  return (
    <Fragment>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
        <button style={{ width: 120 }} onClick={onZoomIn}>
          Zoom In
        </button>
        <button style={{ width: 120, marginLeft: 16 }} onClick={onZoomOut}>
          Zoom Out
        </button>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Zoom ref={refZoom}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
              <div>zoom zoom zoom zoom zoom zoom</div>
            </div>
          </div>
        </Zoom>
      </div>
    </Fragment>
  );
}

export default App;
```
