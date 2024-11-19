import React, { useCallback, useEffect, useState } from "react";
import Canvas from "./packages/Canvas";
import { ComponentAppType, ComponentBase, WindowSize } from "./packages/types";
import Layout from "./packages/Layout";

const screens: ComponentBase[] = [
  {
    id: "7df2236d89c2",
    name: "Home v15",
    width: 375,
    height: 667,
    x: 0,
    y: 0,
    children: [],
    type: ComponentAppType.SCREEN,
    backgroundColor: "#F8C8A5",
  },
  {
    id: "6e12c422cbcf",
    name: "Page 1",
    width: 375,
    height: 667,
    x: 475,
    y: 0,
    children: [],
    type: ComponentAppType.SCREEN,
    backgroundColor: "#F8C8A5",
  },
];

const Editor: React.FC = () => {
  const [{ width, height }, setWindowSize] = useState<WindowSize>({
    width: window?.innerWidth,
    height: window?.innerHeight,
  });

  const getWindowSize = useCallback(() => {
    if (width !== window.innerWidth || height !== window.innerHeight) {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [height, width]);

  useEffect(() => {
    getWindowSize();
    window.addEventListener("resize", getWindowSize);
    return () => {
      window.removeEventListener("resize", getWindowSize);
    };
  }, [getWindowSize]);

  if (!width || !height) return null;

  return (
    <Layout>
      <Canvas
        components={screens}
        windowSize={{ width, height }}
        defaultScale={0.5}
      />
    </Layout>
  );
};

export default Editor;
