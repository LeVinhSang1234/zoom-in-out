export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const enum ComponentAppType {
  FRAME = "FRAME",
  TEXT = "text",
  GROUP = "group",
}

export type WindowSize = {
  width: number;
  height: number;
};

export type CSSPropertiesProps = {
  backgroundColor?: string;
  fontSize?: number;
  color?: string;
  lineHeight?: number;
  fontFamily?: string;
  fontWeight?: string;
};

export type Pointer = { x: number; y: number };

export type TConfig = CanvasContextValue & {
  layout: WindowSize;
  onChange: (component: ComponentApp) => void;
};

export type ComponentBase = {
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  id: string;
  children?: ComponentBase[];
  text?: string;
  type: ComponentAppType;
} & CSSPropertiesProps;

export type TitleConfig = {
  width: number;
  height: number;
  x: number;
  y: number;
  fontSize: number;
  text: string;
  fullText: string;
  xCanvas: number;
  yCanvas: number;
  heightCanvas: number;
};

export type ComponentProps = {} & WindowSize & Pointer;

export type Mouse = {
  screenX: number;
  screenY: number;
  pageX: number;
  pageY: number;
};

export type AppControl = {
  isPressSpace: boolean; // Check đang giữ phim space sẽ hiển thị bàn tay đợi drag screen
  modeResize?: ModeResize;
  cursorDowning?: Pointer & Mouse; // Check mouse down sẽ cho phép drag screen
  cursor?: Pointer & Mouse;
  sizeBegin?: Pointer & WindowSize;
  isMouseMove?: boolean;
};

export type ComponentCursor = {
  inTitle: () => boolean;
  triggerModeResize: (mode?: ModeResize) => void;
  getApp: () => AppControl;
};

export type ComponentApp = {
  zoom: Zoom;
  cursor: ComponentCursor;
  children?: ComponentApp[];
  type: ComponentAppType;
  titleConfig: TitleConfig;
} & ComponentProps &
  ComponentBase & { config: TConfig };

export type TGuideLine = Partial<Pointer> & {
  modeX?: ModeResize;
  modeY?: ModeResize;
};

export type Zoom = {
  scale: number;
  worldOrigin: Pointer; // translate x và translate y. sẽ bằng rx
  screenOrigin: Pointer; // Tương đương mouse x và y nhưng chỉ đc set lại.= mouse x , y khi giữ phím ctr vị trí => drag tới vị trí;
  mouse: Pointer & {
    rx: number; // vị trí chuột x sau khi bị scale và translate so với thực tế
    ry: number; // vị trí chuột y sau khi bị scale và translate so với thực tế
    bounds?: DOMRect;
    // x:  vị trí chuột x thực tế trên màn hình
    // y: vị trí chuột y thực tế trên màn hình
  };
};

export type CanvasContextValue = {
  lineWidth: number;
  fontSize: number;
  minZoom: number;
  maxZoom: number;
  sizeLineFrame: number;
  colorBorderHoverElement: string;
  colorBorderHoverGroup: string;
  backgroundColor: string;
  backgroundColorMenu: string;
  framePixelColor: string;
  titlePageColor: string;
  titlePageHoverColor: string;
  scaleVisibleFrame: number;
  initScale: number;
  isPressSpace: boolean;
  ratio: number;
  sizeBoxResize: number;
  colorGuideLine: string;
  guideLineDistance: number;
  textColor: string;
} & TCanvasControlContext;

export type TitleReq = { id: string; config: TitleConfig };

export type TCanvasControl = {
  selection: { id: string; parents: ComponentApp[] }[];
  titleHover?: TitleReq;
  hover?: { id: string; parents: ComponentApp[] };
  titleEdited?: { id: string; input?: HTMLInputElement };
  setSelection: (selection: { id: string; parents: ComponentApp[] }[]) => void;
  setTitleHover: (req: TitleReq) => void;
  setTitleEdited: (id: string) => void;
  removeTitleEdited: (id: string) => void;
  setHover: (id: string, parents: ComponentApp[]) => void;
  removeHover: (id: string) => void;
  removeTitleHover: (id: string) => void;
};

export type TCanvasControlContext = {
  getControl: () => TCanvasControl;
};

export enum CursorType {
  DEFAULT = "default",
  GRAB = "grab",
  GRABBING = "grabbing",
}

export enum KEYBOARD_CODE {
  F12 = "F12",
  F7 = "F7",
  SPACE = "Space",
}

export enum MouseType {
  DOWN = "mousedown",
  UP = "mouseup",
  OUT = "mouseout",
  MOVE = "mousemove",
}

export type Point = [number, number];

export enum ModeResize {
  LEFT = "left",
  TOP_LEFT = "topLeft",
  BOTTOM_LEFT = "bottomLeft",
  RIGHT = "right",
  TOP_RIGHT = "topRight",
  BOTTOM_RIGHT = "bottomRight",
  TOP = "top",
  BOTTOM = "bottom",
  DRAG_DROP = "drag_drop",
}

declare global {
  interface Array<T> {
    last(): T | undefined;
  }
}
// eslint-disable-next-line no-extend-native
Array.prototype.last = function <T>(): T | undefined {
  return this.length > 0 ? this[this.length - 1] : undefined;
};
