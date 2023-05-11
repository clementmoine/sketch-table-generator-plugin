import React, { FC, useCallback, useState } from "react";

import Input, { InputProps } from "../Input";
import Select, { SelectProps } from "../Select";

import styles from "./AdvancedOptions.module.scss";

export interface AdvancedOptionsProps {}

const AdvancedOptions: FC<AdvancedOptionsProps> = (props) => {
  const [values, setValues] = useState<Record<string, string>>({
    rowHeight: "56",
    cellWidth: "250",
    cellSymbolName: "Table/Cell Content/Default/Text",
    cellStyleName: "Table/Cell/Default/Transparent",
  });

  const handleChange = useCallback<
    NonNullable<SelectProps["onChange"] & InputProps["onChange"]>
  >((value, input) => {
    if (!input.name) {
      return;
    }

    const { name } = input;

    setValues((v) => ({
      ...v,
      [name]: value as string,
    }));
  }, []);

  return (
    <details className={styles["advanced-options"]}>
      <summary data-app-region="no-drag">Paramètres avancés</summary>

      <div className={styles["advanced-options-content"]}>
        <Input
          min="50"
          type="number"
          id="cellWidth"
          name="cellWidth"
          direction="vertical"
          onChange={handleChange}
          label="Largeur des cellules :"
          value={values["cellWidth"]}
        />

        <Input
          min="56"
          type="number"
          id="rowHeight"
          name="rowHeight"
          direction="vertical"
          onChange={handleChange}
          label="Hauteur des lignes :"
          value={values["rowHeight"]}
        />

        <Select
          label="Contenu des cellules"
          id="cellSymbolName"
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

        <Select
          id="cellStyleName"
          name="cellStyleName"
          onChange={handleChange}
          label="Style des cellules"
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
