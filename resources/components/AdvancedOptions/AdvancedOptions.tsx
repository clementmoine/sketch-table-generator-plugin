import React, { FC, useCallback, useState, ChangeEvent } from "react";

import styles from "./AdvancedOptions.module.scss";

export interface AdvancedOptionsProps {}

const AdvancedOptions: FC<AdvancedOptionsProps> = (props) => {
  const [values, setValues] = useState<Record<string, string>>({
    "colWidth": "250",
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues((v) => ({
      ...v,
      [name]: value,
    }));
  }, []);

  return (
    <details className={styles["advanced-options"]}>
      <summary>Paramètres avancés</summary>

      <div className={styles["advanced-options-content"]}>
        <label htmlFor="colWidth">Largeur des colonnes :</label>
        <input
          min="50"
          type="number"
          id="colWidth"
          name="colWidth"
          onChange={handleChange}
          value={values['colWidth']}
        />
      </div>
    </details>
  );
};

AdvancedOptions.displayName = "AdvancedOptions";

export default AdvancedOptions;
