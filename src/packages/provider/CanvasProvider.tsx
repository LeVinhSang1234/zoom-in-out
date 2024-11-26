import { Component, ReactNode } from "react";
import { CanvasContext, defaultValueContext } from "../context/canvas";
import { CanvasContextValue } from "../types";

type Props = {
  children?: ReactNode;
} & { config: Partial<CanvasContextValue> };

class CanvasProvider extends Component<Props> {
  render() {
    const { children, config } = this.props;
    return (
      <CanvasContext.Provider value={{ ...defaultValueContext, ...config }}>
        {children}
      </CanvasContext.Provider>
    );
  }
}

export default CanvasProvider;
