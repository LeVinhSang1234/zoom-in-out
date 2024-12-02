import React, { useCallback, useEffect, useRef, useState } from "react";
import Canvas from "./packages/components/Canvas";
import { ComponentAppType, ComponentBase, WindowSize } from "./packages/types";

const screens: ComponentBase[] = [
  {
    id: "7df2236d89c2",
    title: "Home v15",
    width: 375,
    height: 667,
    x: 0,
    y: 0,
    children: [
      {
        id: "7df2236d89c3",
        width: 200,
        height: 30,
        text: "Text",
        x: 0,
        y: 20,
        type: ComponentAppType.TEXT,
      },
    ],
    type: ComponentAppType.FRAME,
  },
  {
    id: "6e12c422cbcf",
    title: "Page 1",
    width: 375,
    height: 667,
    x: 475,
    y: 0,
    children: [],
    type: ComponentAppType.FRAME,
  },
];

const Editor: React.FC = () => {
  const components = useRef(screens);

  useEffect(() => {
    (window as any).components = components.current;
  }, []);

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

  return <Canvas screens={components.current} layout={{ width, height }} />;
};

export default Editor;
