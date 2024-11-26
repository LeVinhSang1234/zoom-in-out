import { Component } from "react";
import {
  ComponentApp,
  ComponentBase,
  KEYBOARD_CODE,
  ModeResize,
  WindowSize,
  Zoom,
} from "../../types";
import { DrawPage } from "../../helpers/DrawPage";
import {
  addClass,
  getConfig,
  getMaxHeightSize,
  getMaxWidthSize,
  getSize,
  makeComponent,
  makeTitle,
  removeClass,
  zoomedX_INV,
  zoomedY_INV,
} from "../../utlis";
import { DrawFramePixel } from "../../helpers/DrawFramePixel";
import { BACKGROUND_COLOR, MAX_ZOOM, MIN_ZOOM, RATIO } from "../../conts";
import EventListener from "../../lib/EventListener";
import ElementListener from "../../lib/ElementListener";
import DisabledBrowser from "../../lib/DisabledBrowser";
import { withCanvasProvider } from "../../context/withCanvasProvider";
import {
  CanvasContextValue,
  TCanvasControlContext,
} from "../../context/canvas";
import { DrawName } from "../../helpers/DrawName";
import FPS from "../../lib/FPS";
import { withControlProvider } from "../../context/withControlProvider";
import "./index.css";
import { DrawInputTitle } from "../../helpers/DrawInputTitle";
import { DrawBoxResize } from "../../helpers/DrawBoxResize";

type Props = {
  layout: WindowSize;
  components: ComponentBase[];
};

class CanvasBase extends Component<Props> {}

type CanvasProps = Props & CanvasContextValue & TCanvasControlContext;

class Canvas extends Component<CanvasProps> {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private zoom: Zoom;
  private app: {
    pressSpace: boolean; // Check đang giữ phim space sẽ hiển thị bàn tay đợi drag screen
    downing: boolean; // Check mouse down sẽ cho phép drag screen
  };

  constructor(props: CanvasProps & CanvasContextValue) {
    super(props);
    this.ctx = null;
    this.canvas = null;
    const { layout, initScale = 1, components, ratio = RATIO } = props;
    const { width, height } = getSize(layout, ratio);
    const maxWidth = getMaxWidthSize(components, initScale);
    const maxHeight = getMaxHeightSize(components, initScale);
    const origin = { x: (width - maxWidth) / 2, y: (height - maxHeight) / 2 };
    this.zoom = {
      scale: initScale,
      worldOrigin: { x: 0, y: 0 },
      screenOrigin: { ...origin },
      mouse: { ...origin, rx: 0, ry: 0, bounds: undefined },
    };
    this.zoom.mouse.rx = zoomedX_INV(origin.x, this.zoom);
    this.zoom.mouse.ry = zoomedY_INV(origin.y, this.zoom);
    this.app = { downing: false, pressSpace: false };
  }

  shouldComponentUpdate(nProps: CanvasProps): boolean {
    const { layout, ratio = RATIO } = this.props;
    if (layout !== nProps.layout) {
      this.setSizeCanvas(nProps.layout, ratio);
      this.draw();
    }
    return false;
  }

  componentDidMount(): void {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    const { layout, ratio = RATIO } = this.props;
    this.setSizeCanvas(layout, ratio);
    this.draw();
  }

  private calculateMouse = (event: MouseEvent) => {
    if (!this.canvas) return;
    const { mouse } = this.zoom;
    const { ratio = RATIO } = this.props;
    const size = getSize(
      { width: event.clientX, height: event.clientY },
      ratio
    );
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
    const {
      minZoom = MIN_ZOOM,
      maxZoom = MAX_ZOOM,
      ratio = RATIO,
    } = this.props;
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
      const size = getSize({ width: e.deltaX, height: e.deltaY }, ratio);
      this.zoom.worldOrigin.y += size.height / 5 / this.zoom.scale;
      this.zoom.worldOrigin.x += size.width / 5 / this.zoom.scale;
    }
    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    this.draw();
  };

  draw = (props = this.props) => {
    if (!this.ctx || !this.canvas) return;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.imageSmoothingEnabled = true;

    this.ctx.save();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.rect(0, 0, width, height);
    this.ctx.fill();
    this.ctx.restore();

    const { layout } = props;
    const components = props.components as ComponentApp[];
    const config = getConfig({ ...props, isSpace: this.app.pressSpace });
    for (const component of components) {
      component.zoom = this.zoom;
      component.config = config;
      makeTitle(this.ctx!, component);
      component.titleConfig.onChange = (title: string) => {
        component.title = title;
        this.draw();
      };
      makeComponent(this.ctx!, component);
      component.cursor.setModeResize = this.setModeResize;
      DrawPage(this.ctx!, component);
    }
    DrawFramePixel(this.ctx, { layout, zoom: this.zoom, config });
    for (const component of components) {
      DrawName(this.ctx!, component);
      DrawInputTitle(this.ctx!, component);
      DrawBoxResize(this.ctx!, component);
    }
  };

  private setModeResize = (mode?: ModeResize) => {
    this.canvasMode(mode);
  };

  private setSizeCanvas = (windowSize: WindowSize, radio: number) => {
    if (!this.canvas) return;
    const size = getSize(windowSize, radio);
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
    const { getControl } = this.props;
    const control = getControl();
    const { titleEdited, titleHover, setSelection } = control;
    if (!this.app.pressSpace) {
      setSelection(titleHover?.id ? [titleHover.id] : []);
    }
    if (titleEdited && titleHover?.id !== titleEdited?.id) {
      control.removeTitleEdited(titleEdited.id);
    }
    this.draw();
  };

  private onDoubleClick = () => {
    const { titleHover, setTitleEdited } = this.props.getControl();
    if (titleHover) setTitleEdited(titleHover.id);
    this.draw();
  };

  private onMouseUp = () => {
    this.app.downing = false;
    if (this.app.pressSpace) {
      this.canvasGrab();
    } else this.canvasCursor();
  };

  private canvasGrab = () => {
    addClass(this.canvas, "canvas--grab");
  };

  private canvasGrabbing = () => {
    addClass(this.canvas, "canvas--grabbing");
  };

  private canvasMode = (mode?: ModeResize) => {
    if (!mode) {
      removeClass(this.canvas, "canvas--resize-tl_br");
      removeClass(this.canvas, "canvas--resize-tr_bl");
      removeClass(this.canvas, "canvas--resize-horizontal");
      removeClass(this.canvas, "canvas--resize-vertical");
    } else {
      if ([ModeResize.TOP_LEFT, ModeResize.BOTTOM_RIGHT].includes(mode)) {
        addClass(this.canvas, "canvas--resize-tl_br");
      } else if ([ModeResize.LEFT, ModeResize.RIGHT].includes(mode)) {
        addClass(this.canvas, "canvas--resize-horizontal");
      } else if ([ModeResize.TOP, ModeResize.BOTTOM].includes(mode)) {
        addClass(this.canvas, "canvas--resize-vertical");
      }
    }
  };

  private canvasCursor = () => {
    if (this.canvas) this.canvas.className = "canvas";
  };

  render() {
    const { layout: size, backgroundColor = BACKGROUND_COLOR } = this.props;
    const style = { backgroundColor, ...size };
    return (
      <>
        <canvas
          {...size}
          ref={(ref) => (this.canvas = ref)}
          style={style}
          className="canvas --no-edit"
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
