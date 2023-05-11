import React, { useCallback, useRef, useEffect, useMemo } from "react";

import Button from "./components/Button";
import AdvancedOptions from "./components/AdvancedOptions";
import DimensionSelector from "./components/DimensionSelector";

import styles from "./App.module.scss";
import Separator from "./components/Separator";

function App() {
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);

      const formValues = Array.from(formData.entries()).reduce(
        (acc, [name, value]) => ({ ...acc, [name]: value }),
        {}
      );

      window.postMessage("submit", JSON.stringify(formValues));
    },
    []
  );

  const handleReset = useCallback(() => {
    window.postMessage("cancel");
  }, []);

  // Add an handle that detects content height changed to run a window.postMessage("resize") to make sure the window is always adjusted to content height (no scroll)
  useEffect(() => {
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
    <form
      className={styles["app"]}
      onReset={handleReset}
      onSubmit={handleSubmit}
      ref={form}
    >
      <main className={styles["app__body"]}>
        <DimensionSelector />

        <Separator />

        <AdvancedOptions />
      </main>

      <footer className={styles["app__footer"]}>
        <Button type="reset" label="Annuler" />
        <Button type="submit" label="Créer" />
      </footer>
    </form>
  );
}

App.displayName = "App";

export default App;
