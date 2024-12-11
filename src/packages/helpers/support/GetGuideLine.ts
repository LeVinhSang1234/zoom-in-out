import { ComponentApp, ModeResize, TGuideLine } from "../../types";

export const GetGuideLine = (
  components: ComponentApp[],
  screen: ComponentApp,
  guideLine: TGuideLine[],
  { x: xParent, y: yParent }: { x: number; y: number } = { x: 0, y: 0 }
) => {
  const app = screen.cursor.getApp();
  const { selection } = screen.config.getControl();
  const isSelection = selection[0] === screen.id;
  const { isPressSpace, guideLineDistance } = screen.config;

  const space = Math.max(guideLineDistance / screen.zoom.scale, 4);

  if (!isSelection || isPressSpace || !app.isMouseMove) return;
  const { cursorDowning, modeResize } = app;
  if (cursorDowning && modeResize) {
    const isLeft = [
      ModeResize.DRAG_DROP,
      ModeResize.LEFT,
      ModeResize.TOP_LEFT,
      ModeResize.BOTTOM_LEFT,
    ].includes(modeResize);
    const isRight = [
      ModeResize.DRAG_DROP,
      ModeResize.RIGHT,
      ModeResize.TOP_RIGHT,
      ModeResize.BOTTOM_RIGHT,
    ].includes(modeResize);

    const isBottom = [
      ModeResize.DRAG_DROP,
      ModeResize.BOTTOM_LEFT,
      ModeResize.BOTTOM,
      ModeResize.BOTTOM_RIGHT,
    ].includes(modeResize);

    const isTop = [
      ModeResize.DRAG_DROP,
      ModeResize.TOP_LEFT,
      ModeResize.TOP,
      ModeResize.TOP_RIGHT,
    ].includes(modeResize);

    const { x, y, width, height } = screen;
    for (const component of components) {
      if (component.id === screen.id) continue;
      const { x: xChild, y: yChild } = component;

      const _x = xParent + xChild;
      const _y = yParent + yChild;
      const _width = component.width;
      const _height = component.height;

      if (x > _x - space && x < _x + space && isLeft) {
        if (!guideLine.length || !guideLine.some((e) => e.x === _x)) {
          guideLine.push({ x: _x, modeX: ModeResize.LEFT });
        }
      }
      if (x > _x + _width - space && x < _x + _width + space && isLeft) {
        if (!guideLine.length || !guideLine.some((e) => e.x === _x + _width)) {
          guideLine.push({ x: _x + _width, modeX: ModeResize.LEFT });
        }
      }
      if (
        x + width > _x + _width - space &&
        x + width < _x + _width + space &&
        isRight
      ) {
        if (!guideLine.length || !guideLine.some((e) => e.x === _x + _width)) {
          guideLine.push({ x: _x + _width, modeX: ModeResize.RIGHT });
        }
      }
      if (x + width > _x - space && x + width < _x + space && isRight) {
        if (!guideLine.length || !guideLine.some((e) => e.x === _x)) {
          guideLine.push({ x: _x, modeX: ModeResize.RIGHT });
        }
      }
      if (
        x + width > _x + _width / 2 - space &&
        x + width < _x + _width / 2 + space &&
        isRight
      ) {
        if (
          !guideLine.length ||
          !guideLine.some((e) => e.x === _x + _width / 2)
        ) {
          guideLine.push({ x: _x + _width / 2, modeX: ModeResize.RIGHT });
        }
      }
      if (
        x > _x + _width / 2 - space &&
        x < _x + _width / 2 + space &&
        isRight
      ) {
        if (
          !guideLine.length ||
          !guideLine.some((e) => e.x === _x + _width / 2)
        ) {
          guideLine.push({ x: _x + _width / 2, modeX: ModeResize.LEFT });
        }
      }
      if (y > _y - space && y < _y + space && isTop) {
        if (!guideLine.length || !guideLine.some((e) => e.y === _y)) {
          guideLine.push({ y: _y, modeY: ModeResize.TOP });
        }
      }
      if (y > _y + _height - space && y < _y + _height + space && isTop) {
        if (!guideLine.length || !guideLine.some((e) => e.y === _y + _height)) {
          guideLine.push({ y: _y + _height, modeY: ModeResize.TOP });
        }
      }
      if (
        y + height > _y + _height - space &&
        y + height < _y + _height + space &&
        isBottom
      ) {
        if (!guideLine.length || !guideLine.some((e) => e.y === _y + _height)) {
          guideLine.push({ y: _y + _height, modeY: ModeResize.BOTTOM });
        }
      }
      if (y + height > _y - space && y + height < _y + space && isBottom) {
        if (!guideLine.length || !guideLine.some((e) => e.y === _y)) {
          guideLine.push({ y: _y, modeY: ModeResize.BOTTOM });
        }
      }
      if (component.children?.length) {
        GetGuideLine(component.children, screen, guideLine, { x: _x, y: _y });
      }
    }
    for (const line of guideLine) {
      const { x: __x, modeX } = line;
      const { y: __y, modeY } = line;
      switch (modeResize) {
        case ModeResize.DRAG_DROP:
          if (__x !== undefined) {
            screen.x = modeX === ModeResize.RIGHT ? __x - screen.width : __x;
          }
          if (__y !== undefined) {
            screen.y = modeY === ModeResize.TOP ? __y : __y - screen.height;
          }
          break;
        case ModeResize.LEFT:
          if (__x !== undefined && modeX === ModeResize.LEFT) {
            screen.width = screen.width + (screen.x - __x);
            screen.x = __x;
          }
          break;
        case ModeResize.RIGHT:
          if (__x !== undefined && modeX === ModeResize.RIGHT) {
            screen.width = screen.width + (__x - (screen.width + screen.x));
          }
          break;

        case ModeResize.TOP:
          if (__y !== undefined && modeY === ModeResize.TOP) {
            screen.height = screen.height + (screen.y - __y);
            screen.y = __y;
          }
          break;
        case ModeResize.BOTTOM:
          if (__y !== undefined && modeY === ModeResize.BOTTOM) {
            screen.height = screen.height + (__y - (screen.y + screen.height));
          }
          break;
        case ModeResize.TOP_LEFT:
          if (__y !== undefined && modeY === ModeResize.TOP) {
            screen.height = screen.height + (screen.y - __y);
            screen.y = __y;
          }
          if (__x !== undefined && modeX === ModeResize.LEFT) {
            screen.width = screen.width + (screen.x - __x);
            screen.x = __x;
          }
          break;
        case ModeResize.TOP_RIGHT:
          if (__y !== undefined && modeY === ModeResize.TOP) {
            screen.height = screen.height + (screen.y - __y);
            screen.y = __y;
          }
          if (__x !== undefined && modeX === ModeResize.RIGHT) {
            screen.width = screen.width + (__x - (screen.width + screen.x));
          }
          break;
        case ModeResize.BOTTOM_LEFT:
          if (__y !== undefined && modeY === ModeResize.BOTTOM) {
            screen.height = screen.height + (__y - (screen.y + screen.height));
          }
          if (__x !== undefined && modeX === ModeResize.LEFT) {
            screen.width = screen.width + (screen.x - __x);
            screen.x = __x;
          }
          break;
        case ModeResize.BOTTOM_RIGHT:
          if (__y !== undefined && modeY === ModeResize.BOTTOM) {
            screen.height = screen.height + (__y - (screen.y + screen.height));
          }
          if (__x !== undefined && modeX === ModeResize.RIGHT) {
            screen.width = screen.width + (__x - (screen.width + screen.x));
          }
          break;
      }
    }
  }
};
