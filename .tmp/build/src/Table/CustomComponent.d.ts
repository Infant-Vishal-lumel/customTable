import powerbi from "powerbi-visuals-api";
import * as React from "react";
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
declare const CustomComponent: React.FC<CustomComponentProps>;
export default CustomComponent;
