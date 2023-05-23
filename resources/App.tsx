import React, { useCallback, useRef, useEffect, useMemo } from "react";

import Button from "./components/Button";
import Separator from "./components/Separator";
import AdvancedOptions from "./components/AdvancedOptions";
import DimensionSelector from "./components/DimensionSelector";

import { useSketchContext } from "./context/SketchContext";

import styles from "./App.module.scss";
import Switch from "./components/Switch";
import RadioGroup from "./components/RadioGroup";

function App() {
  const form = useRef<HTMLFormElement>(null);

  const sketchContext = useSketchContext();

  const [mode, options] = useMemo<
    [mode: "edit" | "new", options?: Record<string, any>]
  >(() => ["new", sketchContext.options], [sketchContext]);

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
        <DimensionSelector
          initialValue={
            options?.colCount &&
            options?.rowCount && {
              colCount: options.colCount,
              rowCount: options.rowCount,
            }
          }
        />

        <Switch
          label="Grouper par :"
          options={[
            { label: "Lignes", value: "row" },
            {
              label: "Colonnes",
              value: "column",
            },
          ]}
        />

        <RadioGroup
          name="mode"
          options={[
            {
              label: "Nouveau tableau",
              value: "new",
            },
            {
              label: "Tableau existant",
              value: "edit",
            },
          ]}
        />

        <Separator />

        <AdvancedOptions />
      </main>

      <footer className={styles["app__footer"]}>
        <Button type="reset" label="Annuler" />
        <Button type="submit" label={mode === "edit" ? "Modifier" : "Créer"} />
      </footer>
    </form>
  );
}

App.displayName = "App";

export default App;
