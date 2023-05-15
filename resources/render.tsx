import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { SketchContextProvider } from "./context/SketchContext";

import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <SketchContextProvider>
      <App />
    </SketchContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
