import React, { FC, useCallback, useState, ChangeEvent } from "react";

import Input from "../Input";

import styles from "./AdvancedOptions.module.scss";
import Select from "../Select";

export interface AdvancedOptionsProps {}

const AdvancedOptions: FC<AdvancedOptionsProps> = (props) => {
  const [values, setValues] = useState<Record<string, string>>({
    rowHeight: "56",
    cellWidth: "250",
    cellSymbolName: "Table/Cell Content/Default/Text",
    cellStyleName: "Table/Cell/Default/Transparent",
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const name = e.target.name;
      const value = e.target.value;

      setValues((v) => ({
        ...v,
        [name]: value,
      }));
    },
    []
  );

  return (
    <details className={styles["advanced-options"]}>
      <summary>Paramètres avancés</summary>

      <div className={styles["advanced-options-content"]}>
        <label htmlFor="cellWidth">Largeur des cellules :</label>
        <Input
          min="50"
          type="number"
          id="cellWidth"
          name="cellWidth"
          onChange={handleChange}
          value={values["cellWidth"]}
        />

        <label htmlFor="rowHeight">Hauteur des lignes :</label>
        <Input
          min="56"
          type="number"
          id="rowHeight"
          name="rowHeight"
          onChange={handleChange}
          value={values["rowHeight"]}
        />

        <label>Contenu des cellules</label>
        <Select
          name="cellSymbolName"
          onChange={handleChange}
          value={values["cellSymbolName"]}
          options={[
            {
              label: "Dropdown list",
              value: "Table/Cell Content/Default/Dropdown list",
            },
            {
              label: "Text",
              value: "Table/Cell Content/Default/Text",
            },
          ]}
        />

        <label>Style des cellules</label>
        <Select
          name="cellStyleName"
          onChange={handleChange}
          value={values["cellStyleName"]}
          options={[
            {
              label: "Default",
              value: "Table/Cell/Default/Default",
            },
            {
              label: "Disabled",
              value: "Table/Cell/Default/Disabled",
            },
            {
              label: "Error",
              value: "Table/Cell/Default/Error",
            },
            {
              label: "Focus",
              value: "Table/Cell/Default/Focus",
            },
            {
              label: "Transparent",
              value: "Table/Cell/Default/Transparent",
            },
          ]}
        />
      </div>
    </details>
  );
};

AdvancedOptions.displayName = "AdvancedOptions";

export default AdvancedOptions;
