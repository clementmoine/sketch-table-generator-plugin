import React, { FC } from "react";

import styles from "./AdvancedOptions.module.scss";

export interface AdvancedOptionsProps {}

const AdvancedOptions: FC<AdvancedOptionsProps> = (props) => {
  return (
    <details className={styles['advanced-options']}>
      <summary>Paramètres avancés</summary>

      <div className={styles['advanced-options-content']}>
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