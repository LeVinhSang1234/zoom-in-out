import React, { useCallback, useEffect, useState } from "react";
import Canvas from "./packages/Canvas";
import { ComponentAppType, ComponentBase, WindowSize } from "./packages/types";
import CanvasControlWrapper from "./packages/CanvasControl";

const scs: ComponentBase[] = [
  {
    id: "7df2236d89c2",
    name: "Home v15",
    width: 375,
    height: 667,
    x: 0,
    y: 0,
    children: [],
    type: ComponentAppType.SCREEN,
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
  },
];

const Editor: React.FC = () => {
  const [windowSize, setWindowSize] = useState<WindowSize | undefined>();

  const isMobile =
    /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
      navigator.userAgent
    );

  const [screens /*setScreens*/] = useState(scs);

  useEffect(() => {
    getWindowSize();
    window.addEventListener("resize", getWindowSize);
    return () => {
      window.removeEventListener("resize", getWindowSize);
    };
    //eslint-disable-next-line
  }, []);

  const getWindowSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  if (isMobile && (windowSize?.width || 0) < 1000) {
    return (
      <div className="app">
        <span style={{ fontWeight: "600", fontSize: 18 }}>
          No Support Mobile Device
        </span>
      </div>
    );
  }

  if (!windowSize) return null;

  return (
    <div className="app">
      <CanvasControlWrapper components={screens}>
        <Canvas windowSize={windowSize} />
      </CanvasControlWrapper>
    </div>
  );
};

export default Editor;
