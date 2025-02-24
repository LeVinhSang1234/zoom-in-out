import { Fragment, useRef, useState } from "react";
import ScrollInverted from "./packages/ScrollInverted";

function App() {
  const [state1, setState1] = useState(
    new Array(20).fill(null).map((_, i) => `${i + 1} Text`)
  );

  const refScroll = useRef<ScrollInverted<(typeof state1)[0]>>(null);

  return (
    <Fragment>
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
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
          initialScrollIndex={3}
          onScroll={console.log}
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
