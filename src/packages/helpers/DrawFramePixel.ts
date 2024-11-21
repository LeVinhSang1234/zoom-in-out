import { CanvasContextValue } from "../context/canvas";
import { RATIO } from "../conts";
import { WindowSize, Zoom } from "../types";
import { getSize, zoomedX, zoomedX_INV, zoomedY, zoomedY_INV } from "../utlis";

const scaleLine = 0.3;

export const DrawFramePixel = (
  ctx: CanvasRenderingContext2D,
  screen: { layout: WindowSize; zoom: Zoom; config: CanvasContextValue }
) => {
  const { layout, zoom, config } = screen;
  const { width, height } = getSize(layout, config.ratio || RATIO);
  const newWidth = width / scaleLine;
  const newHeight = height / scaleLine;
  const { screenOrigin } = zoom;
  const newZoom: Zoom = {
    ...zoom,
    scale: zoom.scale / scaleLine,
    screenOrigin: {
      x: screenOrigin.x / scaleLine,
      y: screenOrigin.y / scaleLine,
    },
  };
  const { sizeLineFrame, framePixelColor, scaleVisibleFrame } = config;
  ctx.save();
  ctx.scale(scaleLine, scaleLine);
  ctx.lineWidth = sizeLineFrame;
  ctx.strokeStyle = framePixelColor;
  if (newZoom.scale >= scaleVisibleFrame / scaleLine) {
    const size = 1 * newZoom.scale;
    const max = Math.max(newWidth / size, newHeight / size);
    const xMin = Math.floor(zoomedX_INV(0, newZoom));
    const yMin = Math.floor(zoomedY_INV(0, newZoom));
    for (let x = 0; x <= max + 1; x++) {
      const newX = Math.floor(zoomedX(x + xMin, newZoom));
      ctx.beginPath();
      ctx.moveTo(newX, 0);
      ctx.lineTo(newX, newHeight);
      ctx.stroke();
      ctx.closePath();

      const newY = Math.floor(zoomedY(x + yMin, newZoom));
      ctx.beginPath();
      ctx.moveTo(0, newY);
      ctx.lineTo(newWidth, newY);
      ctx.stroke();
      ctx.closePath();
    }
  }
  ctx.restore();
};
