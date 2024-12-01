import { ComponentApp } from "../types";
import { zoomed, zoomedX, zoomedY } from "../utlis";
import { DrawChildrenComponent } from "./support/DrawChildren";

export const DrawGroup = (
  ctx: CanvasRenderingContext2D,
  group: ComponentApp,
  parents: ComponentApp[]
) => {
  const { sx, sy } = parents.reduce(
    (a, b) => ({ sx: a.sx + b.x, sy: a.sy + b.y }),
    { sx: 0, sy: 0 }
  );
  const { x, y, width, height, backgroundColor } = group;
  const _x = zoomedX(x + sx, group.zoom);
  const _y = zoomedY(y + sy, group.zoom);
  const _width = zoomed(width, group.zoom);
  const _height = zoomed(height, group.zoom);

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = backgroundColor || 'transparent';
  ctx.fillRect(_x, _y, _width, _height);
  ctx.rect(_x, _y, _width, _height);
  ctx.clip();
  DrawChildrenComponent(ctx, group, parents);
  ctx.closePath();
  ctx.restore();
};
