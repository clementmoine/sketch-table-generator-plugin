import React from "react";

import Generator from "./components/Generator";
import AdvancedOptions from "./components/AdvancedOptions";

function App() {
  return (
    <>
      <Generator colCount={10} rowCount={8} />
      <AdvancedOptions />
    </>
  );
}

App.displayName = "App";

export default App;
