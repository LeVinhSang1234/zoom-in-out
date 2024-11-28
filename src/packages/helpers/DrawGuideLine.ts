import { COLOR_GUIDE_LINE, RATIO } from "../conts";
import { CanvasContextValue, TGuideLine, WindowSize, Zoom } from "../types";
import { getSize, zoomedX, zoomedY } from "../utlis";

export const DrawGuideLine = (
  ctx: CanvasRenderingContext2D,
  config: CanvasContextValue & { layout: WindowSize; zoom: Zoom },
  guideLine: TGuideLine
) => {
  if (!guideLine) return;
  const { x, y } = guideLine;
  if (x !== undefined || y !== undefined) {
    const { ratio = RATIO, layout, zoom } = config;
    const { width, height } = getSize(layout, ratio);
    ctx.save();
    ctx.strokeStyle = config.colorGuideLine || COLOR_GUIDE_LINE;
    ctx.lineWidth = 1 * ratio;
    ctx.beginPath();

    if (x !== undefined) {
      const newX = zoomedX(x, zoom);
      ctx.moveTo(newX, 0);
      ctx.lineTo(newX, height);
    }
    if (y !== undefined) {
      const newY = zoomedY(y, zoom);
      ctx.moveTo(0, newY);
      ctx.lineTo(width, newY);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
};
