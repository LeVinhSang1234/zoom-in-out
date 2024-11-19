import { Component } from "react";
import {
  ComponentApp,
  ComponentProps,
  KEYBOARD_CODE,
  WindowSize,
  Zoom,
} from "../types";
import { DrawPage } from "../components/DrawPage";
import {
  getConfig,
  getMaxHeightSize,
  getMaxWidthSize,
  getSize,
  makeScreen,
  zoomedX_INV,
  zoomedY_INV,
} from "../utlis";
import { framePixel } from "../components/framePixel";
import { BACKGROUND_COLOR, MAX_ZOOM, MIN_ZOOM } from "../conts";
import EventListener from "../lib/EventListener";
import ElementListener from "../lib/ElementListener";
import DisabledBrowser from "../lib/DisabledBrowser";
import { withCanvasProvider } from "../context/withCanvasProvider";
import { CanvasContextValue } from "../context/canvas";
import { DrawName } from "../components/DrawName";
import {
  TCanvasControlContext,
  withControlProvider,
} from "../context/CanvasControl";
import FPS from "../lib/FPS";
import "./index.css";

type Props<T> = {
  windowSize: WindowSize;
  components: (T & ComponentProps)[];
  maxZoom?: number;
  minZoom?: number;
  defaultScale?: number;
  backgroundColor?: string;
};

class CanvasBase<T> extends Component<Props<T>> {}

type CanvasProps<T> = Props<T> & CanvasContextValue & TCanvasControlContext;

class Canvas<T> extends Component<CanvasProps<T>> {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private zoom: Zoom;
  private app: {
    pressSpace: boolean; // Check đang giữ phim space sẽ hiển thị bàn tay đợi drag screen
    downing: boolean; // Check mouse down sẽ cho phép drag screen
  };

  constructor(props: CanvasProps<T> & CanvasContextValue) {
    super(props);
    this.ctx = null;
    this.canvas = null;
    const { windowSize, defaultScale = 1, components } = props;
    const { width, height } = getSize(windowSize);
    const maxWidth = getMaxWidthSize(components, defaultScale);
    const maxHeight = getMaxHeightSize(components, defaultScale);
    const origin = { x: (width - maxWidth) / 2, y: (height - maxHeight) / 2 };
    this.zoom = {
      scale: defaultScale,
      worldOrigin: { x: 0, y: 0 },
      screenOrigin: { ...origin },
      mouse: { ...origin, rx: 0, ry: 0, bounds: undefined },
    };
    this.zoom.mouse.rx = zoomedX_INV(origin.x, this.zoom);
    this.zoom.mouse.ry = zoomedY_INV(origin.y, this.zoom);
    this.app = { downing: false, pressSpace: false };
  }

  shouldComponentUpdate(nProps: CanvasProps<T>): boolean {
    const { components, windowSize } = this.props;
    if (components !== nProps.components || windowSize !== nProps.windowSize) {
      this.setSizeCanvas(nProps.windowSize);
      this.draw();
    }
    return false;
  }

  componentDidMount(): void {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    const { windowSize } = this.props;
    this.setSizeCanvas(windowSize);
    this.draw();
  }

  private calculateMouse = (event: MouseEvent) => {
    if (!this.canvas) return;
    const { mouse } = this.zoom;
    const size = getSize({ width: event.clientX, height: event.clientY });
    mouse.bounds = this.canvas.getBoundingClientRect();
    mouse.x = size.width - mouse.bounds.left;
    mouse.y = size.height - mouse.bounds.top;
    const xx = mouse.rx;
    const yy = mouse.ry;
    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    if (this.app.pressSpace && this.app.downing) {
      this.zoom.worldOrigin.x -= mouse.rx - xx;
      this.zoom.worldOrigin.y -= mouse.ry - yy;
      mouse.rx = zoomedX_INV(mouse.x, this.zoom);
      mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    }
  };

  private onMouseEvent = (event: MouseEvent) => {
    if (!this.canvas) return;
    this.calculateMouse(event);
    this.draw();
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const { minZoom = MIN_ZOOM, maxZoom = MAX_ZOOM } = this.props;
    const { mouse } = this.zoom;
    if (e.ctrlKey || e.metaKey) {
      this.calculateMouse(e);
      let scale = Math.min(maxZoom, this.zoom.scale * 1.1);
      if (e.deltaY >= 0) {
        scale = Math.max(minZoom, this.zoom.scale * (1 / 1.1));
      }
      this.zoom.scale = scale;
      this.zoom.worldOrigin.x = mouse.rx;
      this.zoom.worldOrigin.y = mouse.ry;
      this.zoom.screenOrigin.x = mouse.x;
      this.zoom.screenOrigin.y = mouse.y;
    } else {
      const size = getSize({ width: e.deltaX, height: e.deltaY });
      this.zoom.worldOrigin.y += size.height / 5 / this.zoom.scale;
      this.zoom.worldOrigin.x += size.width / 5 / this.zoom.scale;
    }
    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    this.draw();
  };

  private draw = (props = this.props) => {
    if (!this.ctx || !this.canvas) return;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.imageSmoothingEnabled = true;

    this.ctx.save();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.rect(0, 0, width, height);
    this.ctx.fill();
    this.ctx.restore();

    const { components, windowSize } = props;
    const config = getConfig({ ...props, isSpace: this.app.pressSpace });
    const builds = components.map((component) => {
      let _com: ComponentApp = { ...component, zoom: this.zoom, config } as any;
      makeScreen(this.ctx!, _com);
      DrawPage(this.ctx!, _com);
      return _com;
    });
    framePixel(this.ctx, { windowSize, zoom: this.zoom, config });
    for (const build of builds) DrawName(this.ctx!, build);
  };

  private setSizeCanvas = (windowSize: WindowSize) => {
    if (!this.canvas) return;
    const size = getSize(windowSize);
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    this.canvas.style.width = `${windowSize.width}px`;
    this.canvas.style.height = `${windowSize.height}px`;
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE && !this.app.pressSpace) {
      this.app.pressSpace = true;
      this.canvasGrab();
      this.draw();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE) {
      this.app.pressSpace = false;
      this.canvasCursor();
      this.draw();
    }
  };

  private onMouseDown = () => {
    this.app.downing = true;
    if (this.app.pressSpace) this.canvasGrabbing();
  };

  private onDoubleClick = () => {
    const { titleHover } = this.props.getControl();
    console.log("titleHover", titleHover);
  };

  private onMouseUp = () => {
    this.app.downing = false;
    if (this.app.pressSpace) {
      this.canvasGrab();
    } else this.canvasCursor();
  };

  private canvasGrab = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--grab";
  };

  private canvasGrabbing = () => {
    if (this.canvas) this.canvas.className = "canvas canvas--grabbing";
  };

  private canvasCursor = () => {
    if (this.canvas) this.canvas.className = "canvas";
  };

  render() {
    const { windowSize: size, backgroundColor = BACKGROUND_COLOR } = this.props;
    const style = { backgroundColor, ...size };
    return (
      <>
        <canvas
          {...size}
          ref={(ref) => (this.canvas = ref)}
          style={style}
          className="canvas"
        />
        <ElementListener
          options={{ passive: false }}
          getDom={() => this.canvas}
          onWheel={this.onWheel}
          onMouseDown={this.onMouseDown}
          onDoubleClick={this.onDoubleClick}
          onMouseMove={this.onMouseEvent}
          onMouseOut={this.onMouseEvent}
        />
        <EventListener
          options={{ passive: false }}
          onMouseUp={this.onMouseUp}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
        <DisabledBrowser />
        <FPS />
      </>
    );
  }
}

export default withCanvasProvider(
  withControlProvider(Canvas)
) as unknown as typeof CanvasBase;
