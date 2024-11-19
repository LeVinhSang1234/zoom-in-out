import { Component } from "react";
import { clsx } from "../../utlis";

type Props = {};

type State = { fps: number };

class FPS extends Component<Props, State> {
  lastTime: number;
  frames: number;
  unmout: boolean;

  constructor(props: Props) {
    super(props);
    this.state = { fps: 60 };
    this.lastTime = performance.now();
    this.frames = 0;
    this.unmout = false;
  }

  shouldComponentUpdate(_: Props, nState: State): boolean {
    const { fps } = this.state;
    return nState.fps !== fps;
  }

  updateFPS = () => {
    if (this.unmout) return;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;
    this.frames++;
    if (delta >= 1000) {
      this.setState({ fps: this.frames });
      this.frames = 0;
      this.lastTime = currentTime;
    }
    requestAnimationFrame(this.updateFPS);
  };

  componentDidMount(): void {
    this.unmout = false;
    this.lastTime = performance.now();
    this.updateFPS();
  }

  componentWillUnmount(): void {
    this.unmout = true;
  }

  render() {
    const { fps } = this.state;
    return (
      <span className={clsx("fps-writer", fps <= 30 && "fps-writer--warning")}>
        FPS: {fps}
      </span>
    );
  }
}

export default FPS;
