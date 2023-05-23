import React, { FC, useCallback, useState } from "react";

import Input, { InputProps } from "../Input";
import Select, { SelectProps } from "../Select";

import styles from "./AdvancedOptions.module.scss";

export interface AdvancedOptionsProps {}

const AdvancedOptions: FC<AdvancedOptionsProps> = (props) => {
  const [value, setValue] = useState<Record<string, string>>({
    rowHeight: "56",
    cellWidth: "250",
    cellSymbolName: "Table/Cell Content/Default/Text",
    cellStyleName: "Table/Cell/Default/Transparent",
  });

  const handleChange = useCallback((value: (SelectProps & InputProps)["value"], name: string) => {
    if (!name) {
      return;
    }

    setValue((v) => ({
      ...v,
      [name]: value as string,
    }));
  }, []);

  return (
    <details className={styles["advanced-options"]}>
      <summary data-app-region="no-drag">Paramètres avancés</summary>

      <div className={styles["advanced-options-content"]}>
        <Input
          min="16"
          type="number"
          id="cellWidth"
          name="cellWidth"
          direction="vertical"
          onChange={(value) => handleChange(value, 'cellWidth')}
          label="Largeur des cellules :"
          value={value["cellWidth"]}
        />

        <Input
          min="16"
          type="number"
          id="rowHeight"
          name="rowHeight"
          direction="vertical"
          onChange={(value) => handleChange(value, 'rowHeight')}
          label="Hauteur des lignes :"
          value={value["rowHeight"]}
        />

        <Select
          label="Contenu des cellules"
          id="cellSymbolName"
          name="cellSymbolName"
          onChange={(value) => handleChange(value, 'cellSymbolName')}
          value={value["cellSymbolName"]}
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

        <Select
          id="cellStyleName"
          name="cellStyleName"
          onChange={(value) => handleChange(value, 'cellStyleName')}
          label="Style des cellules"
          value={value["cellStyleName"]}
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
