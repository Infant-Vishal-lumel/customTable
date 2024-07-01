import powerbi from "powerbi-visuals-api";
import * as React from "react";
import { useState, useEffect } from "react";
import DataView = powerbi.DataView;
import ISelectionId = powerbi.visuals.ISelectionId;

interface CustomComponentProps {
  dataView: DataView;
  settings: {
    theme: string;
    valueFormat: string;
  };
  onThemeChange: (theme: string) => void;
  onValueFormatChange: (valueFormat: string) => void;
  onSelect: (selectionId: ISelectionId) => void;
}

const formatOptions = [
  {
    value: "default",
    label: "Default",
    formatValue: (value: number) => value.toString(),
    spanLabel: null,
  },
  {
    value: "thousand",
    label: "Thousand",
    formatValue: (value: number) => (value / 1000).toFixed(2) + "K",
    spanLabel: "In Thousand",
  },
  {
    value: "million",
    label: "Million",
    formatValue: (value: number) => (value / 1000000).toFixed(2) + "M",
    spanLabel: "In Million",
  },
  {
    value: "billion",
    label: "Billion",
    formatValue: (value: number) => (value / 1000000000).toFixed(2) + "B",
    spanLabel: "In Billion",
  },
];

const getFormatUtilities = (valueFormat: string) => {
  const formatOption =
    formatOptions.find((option) => option.value === valueFormat) ||
    formatOptions[0];
  return {
    formatValue: formatOption.formatValue,
    formatSpanLabel: formatOption.spanLabel,
  };
};

const getRenderVal = (formatValue: (value: number) => string) => {
  return (value: powerbi.PrimitiveValue) => {
    if (typeof value === "number") {
      return formatValue(value);
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return value?.toString() || "";
  };
};

// eslint-disable-next-line max-lines-per-function
const CustomComponent: React.FC<CustomComponentProps> = ({
  dataView,
  settings,
  onThemeChange,
  onValueFormatChange,
  onSelect,
}) => {
  const [theme, setTheme] = useState(settings.theme);
  const [valueFormat, setValueFormat] = useState(settings.valueFormat);
  const toggleValue = theme === "light" ? "dark" : "light";

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = toggleValue;
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleValueFormatChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValueFormat = event.target.value;
    setValueFormat(newValueFormat);
    onValueFormatChange(newValueFormat);
  };

  const rows = dataView?.matrix?.rows?.root?.children || [];
  const columns = dataView?.matrix?.columns?.root?.children || [];

  const { formatValue, formatSpanLabel } = getFormatUtilities(valueFormat);

  const renderValue = getRenderVal(formatValue);

  const handleCellClick = (
    event: React.MouseEvent<HTMLTableCellElement>,
    selectionId: ISelectionId
  ) => {
    event.preventDefault();
    onSelect(selectionId);
  };

  return (
    <div className={theme}>
      <h2>Data Table</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={toggleTheme}>Change {toggleValue} Theme</button>
        <select
          value={valueFormat}
          onChange={handleValueFormatChange}
          style={{ marginLeft: 16 }}
        >
          {formatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Category</th>
            {columns.map((column, index) => (
              <th key={column.levelValues?.[0]?.value + "_" + index}>
                <span>{renderValue(column.levelValues?.[0]?.value)}</span>
                <br />
                <span
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "right",
                  }}
                >
                  {formatSpanLabel}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{renderValue(row.levelValues?.[0]?.value)}</td>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  onClick={(event) =>
                    handleCellClick(event, row.identity as ISelectionId)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {row.values && row.values[colIndex]
                    ? renderValue(row.values[colIndex].value)
                    : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomComponent;
