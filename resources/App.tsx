import { Formik } from "formik";
import React, { useCallback, useRef, useEffect } from "react";

import { useSketchContext } from "./context/SketchContext";

import Options from "./types/options.types";

import Form from "./components/Form";

function App() {
  const form = useRef<HTMLFormElement>(null);

  const sketchContext = useSketchContext();

  const handleSubmit = useCallback((options: Options) => {
    console.log(options);
    window.postMessage("submit", JSON.stringify(options));
  }, []);

  const handleReset = useCallback(() => {
    window.postMessage("cancel");
  }, []);

  // Add an handle that detects content height changed to run a window.postMessage("resize") to make sure the window is always adjusted to content height (no scroll)
  useEffect(() => {
    // Ask to update the selection
    window.postMessage("updateContext");

    // Send the height in second argument
    const resizeObserver = new ResizeObserver(() => {
      const height = form.current!.clientHeight;

      window.postMessage("resize", height.toString());
    });

    resizeObserver.observe(form.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Formik<Options>
      onSubmit={(values) => {
        handleSubmit(values);
      }}
      onReset={() => {
        handleReset();
      }}
      initialValues={{
        ...sketchContext.options,
        mode: sketchContext.selectedTable ? "edit" : "new",
      }}
    >
      <Form ref={form} />
    </Formik>
  );
}

App.displayName = "App";

export default App;
