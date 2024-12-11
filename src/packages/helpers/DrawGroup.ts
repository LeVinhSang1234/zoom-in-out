import { ComponentApp } from "../types";
import { isHoved, zoomed, zoomedX, zoomedY } from "../utlis";
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
  const { x, y, width, height, backgroundColor, config, id, zoom } = group;

  const { getControl } = config;
  const { setHover, removeHover } = getControl();

  const _x = zoomedX(x + sx, group.zoom);
  const _y = zoomedY(y + sy, group.zoom);
  const _w = zoomed(width, group.zoom);
  const _h = zoomed(height, group.zoom);

  const isHover = isHoved(zoom.mouse, { width: _w, height: _h, x: _x, y: _y });
  if (isHover) setHover(id);
  else removeHover(id);

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = backgroundColor || "transparent";
  ctx.fillRect(_x, _y, _w, _h);
  ctx.rect(_x, _y, _w, _h);
  ctx.clip();
  DrawChildrenComponent(ctx, group, parents);
  ctx.closePath();
  ctx.restore();
};
