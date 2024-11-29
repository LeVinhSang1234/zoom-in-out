import { ComponentApp } from "../types";
import { zoomed, zoomedX, zoomedY } from "../utlis";
import { DrawChildrenComponent } from "./support/DrawChildren";

export const DrawGroup = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp,
  parents: ComponentApp[]
) => {
  const { sx, sy } = parents.reduce(
    (a, b) => ({ sx: a.sx + b.x, sy: a.sy + b.y }),
    { sx: 0, sy: 0 }
  );
  const { x, y, width, height } = component;
  const _x = zoomedX(x + sx, component.zoom);
  const _y = zoomedY(y + sy, component.zoom);
  const _width = zoomed(width, component.zoom);
  const _height = zoomed(height, component.zoom);

  ctx.save();
  ctx.beginPath();
  ctx.rect(_x, _y, _width, _height);
  ctx.clip();
  DrawChildrenComponent(ctx, component, parents);
  ctx.closePath();
  ctx.restore();
};
