import React, { FC } from "react";

import styles from "./AdvancedOptions.module.scss";

export interface AdvancedOptionsProps {}

const AdvancedOptions: FC<AdvancedOptionsProps> = (props) => {
  return (
    <details style={styles['advance-options']}>
      <summary>Paramètres avancés</summary>

      <div>
        <label htmlFor="col-width">Largeur des colonnes :</label>
        <input
          type="number"
          id="col-width"
          name="col-width"
          min="50"
          value="250"
        />
      </div>
    </details>
  );
};

AdvancedOptions.displayName = "AdvancedOptions";

export default AdvancedOptions;
