import React, { useCallback, useRef, useEffect, useState } from "react";

import Button from "./components/Button";
import Switch from "./components/Switch";
import Separator from "./components/Separator";
import RadioGroup from "./components/RadioGroup";
import AdvancedOptions from "./components/AdvancedOptions";
import DimensionSelector from "./components/DimensionSelector";

import { useSketchContext } from "./context/SketchContext";

import styles from "./App.module.scss";

function App() {
  const form = useRef<HTMLFormElement>(null);

  const sketchContext = useSketchContext();

  const [mode, setMode] = useState<"edit" | "new">();

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
    // Ask to update the selection
    window.postMessage("updateSelection");

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
          onChange={(newMode) => setMode(newMode)}
          value={mode || (sketchContext.selectedTable ? "edit" : "new")}
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
