/* eslint-disable max-lines-per-function */
import powerbi from "powerbi-visuals-api";
import * as React from "react";
import { useState, useEffect } from "react";
import DataView = powerbi.DataView;

interface CustomComponentProps {
  dataView: DataView;
  settings: {
    theme: string;
    valueFormat: string;
  };
  onThemeChange: (theme: string) => void;
  onValueFormatChange: (valueFormat: string) => void;
}

const getFormatValue = (valueFormat: string) => {
  return (value: number) => {
    switch (valueFormat) {
      case "thousand":
        return (value / 1000).toFixed(2) + "K";
      case "million":
        return (value / 1000000).toFixed(2) + "M";
      case "billion":
        return (value / 1000000000).toFixed(2) + "B";
      default:
        return value.toString();
    }
  };
};

const formatLabels = [
  { value: "default", label: "Default" },
  { value: "thousand", label: "Thousand" },
  { value: "million", label: "Million" },
  { value: "billion", label: "Billion" },
];

function getFormatSpanLabel(valueFormat: string) {
  return (column: powerbi.DataViewMatrixNode) => {
    switch (valueFormat) {
      case "thousand":
        return `in Thousand`;
      case "million":
        return `in Million`;
      case "billion":
        return `in Billion`;
      default:
        return null;
    }
  };
}

const CustomComponent: React.FC<CustomComponentProps> = ({
  dataView,
  settings,
  onThemeChange,
  onValueFormatChange,
}) => {
  const [theme, setTheme] = useState(settings.theme);
  const [valueFormat, setValueFormat] = useState(settings.valueFormat);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
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

  const formatValue = getFormatValue(valueFormat);

  const renderValue = (value: powerbi.PrimitiveValue) => {
    if (typeof value === "number") {
      return formatValue(value);
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return value?.toString() || "";
  };

  const getHeaderSpanLabel = getFormatSpanLabel(valueFormat);

  return (
    <div className={theme}>
      <h2>Data Table</h2>
      <button onClick={toggleTheme}>Change Theme</button>
      <select value={valueFormat} onChange={handleValueFormatChange}>
        {formatLabels.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
                  {getHeaderSpanLabel(column)}
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
                <td key={colIndex}>
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
