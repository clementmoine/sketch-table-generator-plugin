import React, { useCallback, useRef, useEffect } from "react";

import Button from "./components/Button";
import AdvancedOptions from "./components/AdvancedOptions";
import DimensionSelector from "./components/DimensionSelector";

import { CreateTableOptions } from "../src/commands/createTable";

import styles from "./App.module.scss";
import Separator from "./components/Separator";

function App() {
  const options = useRef<CreateTableOptions>({});
  const appRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); // prevent the form from submitting
  
    const formData = new FormData(e.currentTarget); // get the form data

    // create an object from the form data
    const formValues = Array.from(formData.entries()).reduce(
      (acc, [name, value]) => ({ ...acc, [name]: value }),
      {}
    );

    window.postMessage("submit", JSON.stringify(formValues));
  }, []);

  const handleCancel = useCallback(() => {
    window.postMessage("cancel");
  }, []);

  const onDimensionChange = useCallback(
    (value: { rowCount: number; colCount: number }) => {
      options.current.rowCount = value.rowCount;
      options.current.colCount = value.colCount;
    },
    []
  );
  // Add an handle that detects content height changed to run a window.postMessage("resize") to make sure the window is always adjusted to content height (no scroll)

  useEffect(() => {
    // Send the height in second argument
    const resizeObserver = new ResizeObserver(() => {
      const height = appRef.current!.clientHeight;

      window.postMessage("resize", height.toString());
    });

    resizeObserver.observe(appRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <form className={styles["app"]} onSubmit={handleSubmit} ref={appRef}>
      <main className={styles["app__body"]}>
        <DimensionSelector />

        <Separator />

        <AdvancedOptions />
      </main>

      <footer className={styles["app__footer"]}>
        <Button type="reset" onClick={handleCancel} label="Annuler" />
        <Button type="submit" label="Créer" />
      </footer>
    </form>
  );
}

App.displayName = "App";

export default App;
