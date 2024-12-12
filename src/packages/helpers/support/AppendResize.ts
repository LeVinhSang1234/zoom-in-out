import { RATIO } from "../../conts";
import { ComponentApp, ModeResize } from "../../types";

export const AppendResize = (screen: ComponentApp) => {
  const app = screen.cursor.getApp();
  const zoom = screen.zoom;
  const { selection } = screen.config.getControl();
  const isSelection = selection[0]?.id === screen.id;
  const isPressSpace = screen.config.isPressSpace;

  if (!isSelection || isPressSpace) return;
  const { cursorDowning, cursor, modeResize, sizeBegin } = app;
  if (cursorDowning && cursor && sizeBegin && modeResize) {
    const { x, width, y, height } = sizeBegin;
    const changeX = ((cursor.x - cursorDowning.x) / zoom.scale) * RATIO;
    const changeY = ((cursor.y - cursorDowning.y) / zoom.scale) * RATIO;
    switch (modeResize) {
      case ModeResize.LEFT:
        screen.x = x + changeX;
        screen.width = width - changeX;
        break;
      case ModeResize.RIGHT:
        screen.width = width + changeX;
        break;
      case ModeResize.TOP:
        screen.y = y + changeY;
        screen.height = height - changeY;
        break;
      case ModeResize.BOTTOM:
        screen.height = height + changeY;
        break;
      case ModeResize.TOP_LEFT:
        screen.x = x + changeX;
        screen.width = width - changeX;
        screen.y = y + changeY;
        screen.height = height - changeY;
        break;
      case ModeResize.TOP_RIGHT:
        screen.width = width + changeX;
        screen.y = y + changeY;
        screen.height = height - changeY;
        break;
      case ModeResize.BOTTOM_LEFT:
        screen.x = x + changeX;
        screen.width = width - changeX;
        screen.height = height + changeY;
        break;
      case ModeResize.BOTTOM_RIGHT:
        screen.width = width + changeX;
        screen.height = height + changeY;
        break;
      case ModeResize.DRAG_DROP:
        screen.x = x + changeX;
        screen.y = y + changeY;
        break;
    }
  }
};
