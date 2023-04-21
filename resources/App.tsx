import React, { useCallback, useRef, useState } from "react";

import Button from "./components/Button";
import AdvancedOptions from "./components/AdvancedOptions";
import DimensionSelector from "./components/DimensionSelector";

import { CreateTableOptions } from "../src/commands/createTable";

import styles from "./App.module.scss";
import Separator from "./components/Separator";

function App() {
  const options = useRef<CreateTableOptions>({});

  const handleSubmit = useCallback(() => {
    window.postMessage("submit", JSON.stringify(options.current));
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

  return (
    <form className={styles["app"]}>
      <DimensionSelector onChange={onDimensionChange} />

      <Separator />

      <AdvancedOptions />

      <footer className={styles["app__footer"]}>
        <Button type="reset" onClick={handleCancel}>
          Annuler
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Créer
        </Button>
      </footer>
    </form>
  );
}

App.displayName = "App";

export default App;
